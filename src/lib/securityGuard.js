import nodemailer from 'nodemailer';

// In-memory sliding window rate limiter
const ipRequestHistory = new Map();
const recentAlerts = new Map();

// Known attack signatures
const THREAT_PATTERNS = [
  {
    type: 'Cross-Site Scripting (XSS)',
    test: (str) => /<script|javascript:|vbscript:|onload\s*=|onerror\s*=|onclick\s*=|document\.cookie|<iframe|<embed|<svg[^>]*onload/i.test(str)
  },
  {
    type: 'SQL / NoSQL Injection',
    test: (str) => /\bUNION\b\s+\bSELECT\b|'\s*OR\s*'1'\s*=\s*'1|;\s*DROP\s+TABLE|INFORMATION_SCHEMA|\bSLEEP\s*\(|\bBENCHMARK\s*\(|\$where|\$gt|\$ne|\$regex/i.test(str)
  },
  {
    type: 'Path Traversal / LFI',
    test: (str) => /(\.\.\/|\.\.\\|\/etc\/passwd|\/proc\/self|c:\\windows\\system32)/i.test(str)
  },
  {
    type: 'Remote Command Execution',
    test: (str) => /(cmd\.exe|powershell\.exe|\/bin\/sh|\/bin\/bash|\bexec\s*\(|\bsystem\s*\()/i.test(str)
  }
];

export function getClientIp(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || 'Unknown IP';
}

export function checkRateLimit(clientIp, maxRequests = 15, windowMs = 60000) {
  const now = Date.now();
  const history = ipRequestHistory.get(clientIp) || [];
  
  const validHistory = history.filter(ts => now - ts < windowMs);
  validHistory.push(now);
  ipRequestHistory.set(clientIp, validHistory);

  if (validHistory.length > maxRequests) {
    return {
      exceeded: true,
      count: validHistory.length,
      limit: maxRequests
    };
  }

  return { exceeded: false, count: validHistory.length };
}

export function inspectPayload(data) {
  if (!data) return { isThreat: false };

  const valuesToTest = [];

  function extractStrings(obj) {
    if (typeof obj === 'string') {
      valuesToTest.push(obj);
    } else if (Array.isArray(obj)) {
      obj.forEach(extractStrings);
    } else if (typeof obj === 'object' && obj !== null) {
      Object.entries(obj).forEach(([key, val]) => {
        valuesToTest.push(key);
        extractStrings(val);
      });
    }
  }

  extractStrings(data);

  for (const str of valuesToTest) {
    for (const pattern of THREAT_PATTERNS) {
      if (pattern.test(str)) {
        return {
          isThreat: true,
          type: pattern.type,
          sample: str.substring(0, 150)
        };
      }
    }

    // Check for excessive URL spam (more than 3 URLs)
    const urlPattern = new RegExp('https?:\\/\\/|www\\.', 'gi');
    const matches = str.match(urlPattern);
    if (matches && matches.length > 3) {
      return {
        isThreat: true,
        type: 'Mass Phishing / URL Spam Flood',
        sample: str.substring(0, 150)
      };
    }
  }

  return { isThreat: false };
}

export async function sendSecurityIncidentAlert(details) {
  try {
    const { clientIp, endpoint, threatType, sample, smtpUser, smtpPass, adminEmail } = details;

    if (!smtpUser || !smtpPass) return;

    const alertKey = `${clientIp}_${threatType}`;
    const lastAlert = recentAlerts.get(alertKey);
    const now = Date.now();
    if (lastAlert && (now - lastAlert < 600000)) {
      console.log('Security alert throttled for IP:', clientIp);
      return;
    }
    recentAlerts.set(alertKey, now);

    const istTime = new Date().toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    const istDate = new Date().toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: smtpUser, pass: smtpPass }
    });

    const targetRecipient = adminEmail || 'info@dorek.in';

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 2px solid #ef4444; border-radius: 12px; overflow: hidden;">
        <div style="background: #ef4444; padding: 20px; text-align: center; color: #ffffff;">
          <h2 style="margin: 0; font-size: 20px; letter-spacing: 1px;">🚨 CYBER SECURITY THREAT BLOCKED</h2>
          <p style="margin: 6px 0 0 0; font-size: 13px; font-weight: 600;">Dorek Cyber Defense System Active</p>
        </div>

        <div style="padding: 24px;">
          <div style="background: #fee2e2; border-left: 4px solid #ef4444; padding: 12px 16px; border-radius: 6px; margin-bottom: 20px;">
            <strong style="color: #991b1b; font-size: 15px;">Malicious exploit attempt was automatically intercepted & blocked!</strong>
            <p style="margin: 4px 0 0 0; color: #7f1d1d; font-size: 13px;">
              Incident Timestamp: ${istTime} on ${istDate} (IST)
            </p>
          </div>

          <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b; font-weight: 700; width: 140px;">Threat Category:</td>
              <td style="padding: 8px 0; color: #ef4444; font-weight: 800;">${threatType}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b; font-weight: 700;">Attacker IP Address:</td>
              <td style="padding: 8px 0; color: #0A2E5D; font-weight: 800; font-family: monospace;">${clientIp}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b; font-weight: 700;">Target Endpoint:</td>
              <td style="padding: 8px 0; color: #334155; font-family: monospace;">${endpoint}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b; font-weight: 700;">Defense Action:</td>
              <td style="padding: 8px 0; color: #15803d; font-weight: 800;">BLOCKED AUTOMATICALLY (HTTP 403 Forbidden)</td>
            </tr>
          </table>

          ${sample ? `
          <div style="background: #1e293b; color: #f87171; font-family: monospace; font-size: 12px; padding: 12px; border-radius: 8px; margin-bottom: 18px; word-break: break-all;">
            <strong>Intercepted Malicious Pattern:</strong><br/>
            ${sample.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
          </div>
          ` : ''}

          <p style="font-size: 12px; color: #64748b; margin: 0; text-align: center;">
            This is an automated security dispatch from Dorek Cyber Security Protection Guard.
          </p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"Dorek Cyber Security" <${smtpUser}>`,
      to: targetRecipient,
      subject: `🚨 SECURITY ALERT: ${threatType} Blocked (IP: ${clientIp})`,
      html: htmlContent,
      priority: 'high',
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high'
      }
    });

    console.log(`✅ Security incident email dispatched for ${threatType}`);
  } catch (err) {
    console.error('Error sending security alert email:', err);
  }
}
