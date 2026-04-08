/**
 * Automated Follow-Up Email Service.
 * 
 * Schedules and sends follow-up emails at 24 hours and 72 hours
 * after a client's skin analysis. Uses in-memory timers (setTimeout).
 * 
 * - 24-hour email: Warm check-in, recap results, mention 25% off offer
 * - 72-hour email: Urgent tone, guide to book consultation, emphasize offer expiring
 * 
 * Both emails now include scar treatment package recommendations when
 * scarring was detected during the analysis.
 * 
 * In production, these timers survive as long as the server process runs.
 * For a more robust solution, a job queue (e.g., BullMQ) could be used.
 */
import nodemailer from "nodemailer";

const SENDER_EMAIL = "kV@rkaglow.com";
const CHECKIN_URL = "https://rkaemr.click/portal";

function getTransporter() {
  const appPassword = process.env.GMAIL_APP_PASSWORD;
  if (!appPassword) {
    throw new Error("GMAIL_APP_PASSWORD environment variable is not set.");
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: SENDER_EMAIL,
      pass: appPassword,
    },
  });
}

interface ScarTreatmentInfo {
  scarType: string;
  packageName: string;
  price: string;
  sessions: number;
  includes: string[];
}

interface FollowUpConfig {
  analysisId: number;
  patientEmail: string;
  patientName: string;
  skinHealthScore: number;
  topConcerns: string[];
  topTreatment: string;
  scarTreatments?: ScarTreatmentInfo[];
}

// Track scheduled follow-ups to prevent duplicates
const scheduledFollowUps = new Set<string>();

/**
 * Build the scar treatment HTML block for emails.
 * Returns empty string if no scar treatments were recommended.
 */
function buildScarTreatmentBlock(scarTreatments: ScarTreatmentInfo[] | undefined, urgent: boolean): string {
  if (!scarTreatments || scarTreatments.length === 0) return "";

  const borderColor = urgent ? "#dc2626" : "#a855f7";
  const headerBg = urgent
    ? "linear-gradient(135deg, #fef2f2, #fdf2f8)"
    : "linear-gradient(135deg, #fdf2f8, #f5f3ff)";
  const headerColor = urgent ? "#dc2626" : "#7c3aed";

  const packagesHtml = scarTreatments.map((scar) => {
    const includesList = scar.includes
      .map((item) => `<li style="margin-bottom: 2px; font-size: 12px; color: #6b7280;">${item}</li>`)
      .join("");

    return `
      <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 12px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <div>
            <span style="display: inline-block; background: #f3e8ff; color: #7c3aed; font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 4px; margin-bottom: 4px;">${scar.scarType}</span>
            <h4 style="color: #1a1a2e; font-size: 15px; font-weight: 700; margin: 4px 0 0 0;">${scar.packageName}</h4>
          </div>
          <span style="color: ${headerColor}; font-size: 18px; font-weight: 800;">${scar.price}</span>
        </div>
        <p style="color: #6b7280; font-size: 12px; margin: 0 0 8px 0;">${scar.sessions} sessions included</p>
        <ul style="margin: 0; padding-left: 16px; list-style-type: disc;">
          ${includesList}
        </ul>
      </div>
    `;
  }).join("");

  return `
    <div style="background: ${headerBg}; border: 2px solid ${borderColor}; border-radius: 12px; padding: 20px; margin: 0 0 20px;">
      <p style="color: ${headerColor}; font-size: 16px; font-weight: 700; margin: 0 0 8px; text-align: center;">
        ${urgent ? "⚡ Scar Treatment Packages — Act Now" : "✨ Personalized Scar Treatment Packages"}
      </p>
      <p style="color: #4b5563; font-size: 13px; text-align: center; margin: 0 0 16px;">
        ${urgent
          ? "We detected scarring during your analysis. These packages are specifically designed for your scar type — and your 25% off applies to these too!"
          : "We noticed some scarring during your analysis and put together treatment packages specifically designed for your scar type. Each package bundles multiple treatments together so you save money and get the best results."
        }
      </p>
      ${packagesHtml}
      <div style="text-align: center; margin-top: 12px;">
        <a href="${CHECKIN_URL}" style="display: inline-block; background: linear-gradient(135deg, #e8b4b8, #a855f7); color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 13px;">
          Book a Scar Consultation
        </a>
      </div>
    </div>
  `;
}

/**
 * Send the 24-hour follow-up email.
 * Warm, friendly check-in. Recaps their results, answers common questions,
 * and mentions the 25% off offer to encourage booking.
 * Now includes scar treatment packages when scarring was detected.
 */
export async function send24HourFollowUp(config: FollowUpConfig) {
  const { patientEmail, patientName, skinHealthScore, topConcerns, topTreatment, scarTreatments } = config;
  const firstName = patientName.split(" ")[0] || patientName;

  const concernsList = topConcerns.length > 0
    ? topConcerns.map((c) => `<li style="margin-bottom: 4px;">${c}</li>`).join("")
    : "<li>General skin health improvement</li>";

  const scarBlock = buildScarTreatmentBlock(scarTreatments, false);

  try {
    const transporter = getTransporter();

    await transporter.sendMail({
      from: `"RadiantilyK Skin Care" <${SENDER_EMAIL}>`,
      to: patientEmail,
      subject: `${firstName}, Your Skin Analysis Results — Let's Talk About Your Plan`,
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fafafa; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #e8b4b8, #a855f7); padding: 28px 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700;">Checking In On You</h1>
          </div>
          
          <div style="padding: 32px 24px;">
            <p style="color: #1a1a2e; font-size: 16px; margin: 0 0 16px;">
              Hi ${firstName}!
            </p>
            
            <p style="color: #4b5563; font-size: 14px; line-height: 1.7; margin: 0 0 20px;">
              It's been a day since your AI skin analysis, and we wanted to check in! We hope you had a chance to review your personalized results. If you haven't yet, your full report is still available — just check your email for the link.
            </p>

            <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; margin: 0 0 20px;">
              <p style="color: #1a1a2e; font-size: 14px; font-weight: 600; margin: 0 0 12px;">Quick Recap — Your Results:</p>
              <p style="color: #4b5563; font-size: 14px; margin: 0 0 12px;">
                Your skin health score: <strong style="color: #7c3aed; font-size: 18px;">${skinHealthScore}/100</strong>
              </p>
              <p style="color: #1a1a2e; font-size: 13px; font-weight: 600; margin: 0 0 8px;">Top concerns identified:</p>
              <ul style="color: #4b5563; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
                ${concernsList}
              </ul>
            </div>

            <p style="color: #4b5563; font-size: 14px; line-height: 1.7; margin: 0 0 20px;">
              Based on your analysis, we recommended <strong>${topTreatment}</strong> as a great starting point. Many of our clients see noticeable improvement after just one session!
            </p>

            ${scarBlock}

            <p style="color: #4b5563; font-size: 14px; line-height: 1.7; margin: 0 0 20px;">
              <strong>Common questions we get:</strong>
            </p>
            <ul style="color: #4b5563; font-size: 14px; line-height: 1.7; margin: 0 0 20px; padding-left: 20px;">
              <li><strong>"Does it hurt?"</strong> — Most treatments have minimal discomfort. We use numbing cream for anything that might be sensitive.</li>
              <li><strong>"How long until I see results?"</strong> — Many treatments show visible improvement within 1-2 weeks, with full results in 4-6 weeks.</li>
              <li><strong>"What's the downtime?"</strong> — Most of our treatments have little to no downtime. You can usually return to your normal routine the same day.</li>
            </ul>

            <!-- 25% Off Offer -->
            <div style="background: linear-gradient(135deg, #fdf2f8, #f5f3ff); border: 2px solid #e8b4b8; border-radius: 12px; padding: 20px; margin: 0 0 20px; text-align: center;">
              <p style="color: #7c3aed; font-size: 18px; font-weight: 700; margin: 0 0 8px;">25% OFF Your First Treatment</p>
              <p style="color: #6b7280; font-size: 13px; margin: 0;">
                Book your consultation within 48 hours of your analysis and receive 25% off your first treatment. This offer was created just for you!
              </p>
            </div>

            <div style="text-align: center; margin: 24px 0;">
              <a href="${CHECKIN_URL}" style="display: inline-block; background: linear-gradient(135deg, #e8b4b8, #a855f7); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 14px;">
                Book Your Free Consultation
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 13px; line-height: 1.5; margin: 0;">
              Simply reply to this email if you have any questions — we're here to help!
            </p>
          </div>
          
          <div style="background: #f3f4f6; padding: 16px 24px; text-align: center;">
            <p style="color: #9ca3af; font-size: 11px; margin: 0;">
              © RadiantilyK Skin Care
            </p>
          </div>
        </div>
      `,
    });

    console.log(`[FollowUp] 24hr email sent to ${patientEmail}`);
  } catch (err: any) {
    console.error(`[FollowUp] Failed to send 24hr email to ${patientEmail}:`, err?.message);
  }
}

/**
 * Send the 72-hour follow-up email.
 * More urgent tone. Emphasizes that the 25% offer is expiring soon,
 * guides them step-by-step to book a consultation, creates urgency.
 * Now includes scar treatment packages with urgent messaging.
 */
export async function send72HourFollowUp(config: FollowUpConfig) {
  const { patientEmail, patientName, skinHealthScore, topConcerns, topTreatment, scarTreatments } = config;
  const firstName = patientName.split(" ")[0] || patientName;

  const scarBlock = buildScarTreatmentBlock(scarTreatments, true);

  try {
    const transporter = getTransporter();

    await transporter.sendMail({
      from: `"RadiantilyK Skin Care" <${SENDER_EMAIL}>`,
      to: patientEmail,
      subject: `${firstName}, Your 25% Off Offer Expires Soon — Don't Miss Out!`,
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fafafa; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #dc2626, #9333ea); padding: 28px 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700;">Your Offer Is Expiring Soon</h1>
          </div>
          
          <div style="padding: 32px 24px;">
            <p style="color: #1a1a2e; font-size: 16px; margin: 0 0 16px;">
              Hi ${firstName},
            </p>
            
            <p style="color: #4b5563; font-size: 14px; line-height: 1.7; margin: 0 0 20px;">
              We noticed you haven't booked your consultation yet, and we wanted to reach out one last time because we truly believe we can help you achieve the skin you've been dreaming of.
            </p>

            <p style="color: #4b5563; font-size: 14px; line-height: 1.7; margin: 0 0 20px;">
              Your AI analysis showed a skin health score of <strong style="color: #dc2626; font-size: 18px;">${skinHealthScore}/100</strong>. With the right treatments — starting with <strong>${topTreatment}</strong> — we've seen clients improve by <strong>15-25 points</strong> in just a few months. That's a real, visible transformation.
            </p>

            ${scarBlock}

            <!-- Urgent Offer Box -->
            <div style="background: linear-gradient(135deg, #fef2f2, #fdf2f8); border: 2px solid #dc2626; border-radius: 12px; padding: 24px; margin: 0 0 24px; text-align: center;">
              <p style="color: #dc2626; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px;">Limited Time — Expiring Soon</p>
              <p style="color: #1a1a2e; font-size: 24px; font-weight: 800; margin: 0 0 8px;">25% OFF</p>
              <p style="color: #1a1a2e; font-size: 16px; font-weight: 600; margin: 0 0 8px;">Your First Treatment</p>
              <p style="color: #6b7280; font-size: 13px; margin: 0;">
                This exclusive offer was created for you after your skin analysis. Once it expires, it's gone — book now to lock it in.
              </p>
            </div>

            <p style="color: #1a1a2e; font-size: 14px; font-weight: 600; line-height: 1.7; margin: 0 0 12px;">
              Here's how easy it is to get started:
            </p>
            <ol style="color: #4b5563; font-size: 14px; line-height: 1.8; margin: 0 0 20px; padding-left: 20px;">
              <li><strong>Click the button below</strong> to book your free consultation</li>
              <li><strong>Choose a time</strong> that works for you at either our San Jose or San Mateo location</li>
              <li><strong>Come in for a quick visit</strong> — we'll review your AI analysis together and create a personalized plan</li>
              <li><strong>Start your treatment</strong> with 25% off and begin seeing real results</li>
            </ol>

            <div style="text-align: center; margin: 28px 0;">
              <a href="${CHECKIN_URL}" style="display: inline-block; background: linear-gradient(135deg, #dc2626, #9333ea); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 700; font-size: 16px; letter-spacing: 0.5px;">
                Book Now — Claim Your 25% Off
              </a>
            </div>

            <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin: 0 0 20px;">
              <p style="color: #4b5563; font-size: 13px; line-height: 1.6; margin: 0;">
                <strong>Our locations:</strong><br/>
                San Jose: 2100 Curtner Ave, Ste 1B, San Jose, CA 95124<br/>
                San Mateo: 1528 S El Camino Real #200, San Mateo, CA 94402<br/>
                <strong>Call us:</strong> (408) 900-2674
              </p>
            </div>
            
            <p style="color: #6b7280; font-size: 13px; line-height: 1.5; margin: 0;">
              We're excited to be part of your skin care journey. Don't let this opportunity pass — your best skin is just one appointment away!
            </p>
          </div>
          
          <div style="background: #f3f4f6; padding: 16px 24px; text-align: center;">
            <p style="color: #9ca3af; font-size: 11px; margin: 0;">
              © RadiantilyK Skin Care — If you'd prefer not to receive follow-ups, simply reply with "unsubscribe"
            </p>
          </div>
        </div>
      `,
    });

    console.log(`[FollowUp] 72hr email sent to ${patientEmail}`);
  } catch (err: any) {
    console.error(`[FollowUp] Failed to send 72hr email to ${patientEmail}:`, err?.message);
  }
}

/**
 * Schedule follow-up emails at 24 hours and 72 hours after analysis.
 * 
 * - 24hr: Warm check-in, recap results, mention 25% off offer
 * - 72hr: Urgent, guide to book consultation, emphasize offer expiring
 * 
 * Both emails now include scar treatment packages when scarring was detected.
 */
export function scheduleFollowUpEmails(config: FollowUpConfig) {
  const key = `${config.analysisId}`;

  // Prevent duplicate scheduling
  if (scheduledFollowUps.has(key)) {
    console.log(`[FollowUp] Already scheduled for analysis ${config.analysisId}, skipping`);
    return;
  }

  scheduledFollowUps.add(key);

  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
  const SEVENTY_TWO_HOURS = 72 * 60 * 60 * 1000;

  // Schedule 24-hour follow-up (gentle reminder)
  setTimeout(() => {
    send24HourFollowUp(config).catch((err) => {
      console.error(`[FollowUp] 24hr timer error:`, err);
    });
  }, TWENTY_FOUR_HOURS);

  // Schedule 72-hour follow-up (urgent booking push)
  setTimeout(() => {
    send72HourFollowUp(config).catch((err) => {
      console.error(`[FollowUp] 72hr timer error:`, err);
    });
    // Clean up tracking
    scheduledFollowUps.delete(key);
  }, SEVENTY_TWO_HOURS);

  const scarInfo = config.scarTreatments && config.scarTreatments.length > 0
    ? ` (with ${config.scarTreatments.length} scar treatment package(s))`
    : "";
  console.log(`[FollowUp] Scheduled 24hr and 72hr emails for analysis ${config.analysisId} (${config.patientEmail})${scarInfo}`);
}
