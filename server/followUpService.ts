/**
 * Automated Follow-Up Email Service.
 * 
 * Schedules and sends follow-up emails at 24 hours and 48 hours
 * after a client's skin analysis. Uses in-memory timers (setTimeout).
 * 
 * In production, these timers survive as long as the server process runs.
 * For a more robust solution, a job queue (e.g., BullMQ) could be used.
 */
import nodemailer from "nodemailer";

const SENDER_EMAIL = "kV@rkaglow.com";
const CHECKIN_URL = "https://radiantapp.click/";

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

interface FollowUpConfig {
  analysisId: number;
  patientEmail: string;
  patientName: string;
  skinHealthScore: number;
  topConcerns: string[];
  topTreatment: string;
}

// Track scheduled follow-ups to prevent duplicates
const scheduledFollowUps = new Set<string>();

/**
 * Send the 24-hour follow-up email.
 * Warm check-in, answers common questions, encourages booking.
 */
async function send24HourFollowUp(config: FollowUpConfig) {
  const { patientEmail, patientName, skinHealthScore, topConcerns, topTreatment } = config;
  const firstName = patientName.split(" ")[0] || patientName;

  const concernsList = topConcerns.length > 0
    ? topConcerns.map((c) => `<li style="margin-bottom: 4px;">${c}</li>`).join("")
    : "<li>General skin health improvement</li>";

  try {
    const transporter = getTransporter();

    await transporter.sendMail({
      from: `"RadiantilyK Skin Care" <${SENDER_EMAIL}>`,
      to: patientEmail,
      subject: `${firstName}, Quick Check-In on Your Skin Analysis`,
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fafafa; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #e8b4b8, #a855f7); padding: 28px 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700;">Checking In On You</h1>
          </div>
          
          <div style="padding: 32px 24px;">
            <p style="color: #1a1a2e; font-size: 16px; margin: 0 0 16px;">
              Hi ${firstName}! 👋
            </p>
            
            <p style="color: #4b5563; font-size: 14px; line-height: 1.7; margin: 0 0 20px;">
              We hope you had a chance to look over your skin analysis results! We know it can be a lot of information, so we wanted to check in and see if you have any questions.
            </p>

            <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; margin: 0 0 20px;">
              <p style="color: #1a1a2e; font-size: 14px; font-weight: 600; margin: 0 0 12px;">Quick Recap — Your Top Concerns:</p>
              <ul style="color: #4b5563; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
                ${concernsList}
              </ul>
            </div>

            <p style="color: #4b5563; font-size: 14px; line-height: 1.7; margin: 0 0 20px;">
              Based on your analysis (score: <strong>${skinHealthScore}/100</strong>), we think <strong>${topTreatment}</strong> could make a real difference for you. Many of our clients see noticeable improvement after just one session!
            </p>

            <p style="color: #4b5563; font-size: 14px; line-height: 1.7; margin: 0 0 20px;">
              <strong>Common questions we get:</strong>
            </p>
            <ul style="color: #4b5563; font-size: 14px; line-height: 1.7; margin: 0 0 20px; padding-left: 20px;">
              <li><strong>"Does it hurt?"</strong> — Most treatments have minimal discomfort. We use numbing cream for anything that might be sensitive.</li>
              <li><strong>"How long until I see results?"</strong> — Many treatments show visible improvement within 1-2 weeks, with full results in 4-6 weeks.</li>
              <li><strong>"What's the downtime?"</strong> — Most of our treatments have little to no downtime. You can usually return to your normal routine the same day.</li>
            </ul>

            <div style="text-align: center; margin: 24px 0;">
              <a href="${CHECKIN_URL}" style="display: inline-block; background: linear-gradient(135deg, #e8b4b8, #a855f7); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 14px;">
                Book Your Free Consultation
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 13px; line-height: 1.5; margin: 0;">
              Simply reply to this email if you have any questions — we're here to help! 💜
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
 * Send the 48-hour follow-up email.
 * More urgency, special offer, final encouragement to book.
 */
async function send48HourFollowUp(config: FollowUpConfig) {
  const { patientEmail, patientName, skinHealthScore, topConcerns, topTreatment } = config;
  const firstName = patientName.split(" ")[0] || patientName;

  try {
    const transporter = getTransporter();

    await transporter.sendMail({
      from: `"RadiantilyK Skin Care" <${SENDER_EMAIL}>`,
      to: patientEmail,
      subject: `${firstName}, Don't Let Your Skin Goals Wait!`,
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fafafa; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #e8b4b8, #a855f7); padding: 28px 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700;">Your Skin Journey Awaits</h1>
          </div>
          
          <div style="padding: 32px 24px;">
            <p style="color: #1a1a2e; font-size: 16px; margin: 0 0 16px;">
              Hi ${firstName}! 💜
            </p>
            
            <p style="color: #4b5563; font-size: 14px; line-height: 1.7; margin: 0 0 20px;">
              We wanted to follow up one more time because we truly believe we can help you achieve the skin you've been dreaming of. Your analysis showed a score of <strong>${skinHealthScore}/100</strong>, and with the right treatments, we've seen clients improve by 15-25 points in just a few months!
            </p>

            <div style="background: linear-gradient(135deg, #fdf2f8, #f5f3ff); border: 1px solid #e8b4b8; border-radius: 12px; padding: 20px; margin: 0 0 20px; text-align: center;">
              <p style="color: #1a1a2e; font-size: 16px; font-weight: 700; margin: 0 0 8px;">Ready to Start Your Transformation?</p>
              <p style="color: #6b7280; font-size: 14px; margin: 0;">
                Book a consultation and our expert team will create a personalized treatment plan just for you.
              </p>
            </div>

            <p style="color: #4b5563; font-size: 14px; line-height: 1.7; margin: 0 0 20px;">
              <strong>Here's what happens when you come in:</strong>
            </p>
            <ol style="color: #4b5563; font-size: 14px; line-height: 1.8; margin: 0 0 20px; padding-left: 20px;">
              <li>We review your AI analysis together</li>
              <li>Our expert examines your skin in person</li>
              <li>We create a customized treatment plan that fits your budget and goals</li>
              <li>You leave feeling confident about your next steps</li>
            </ol>

            <div style="text-align: center; margin: 24px 0;">
              <a href="${CHECKIN_URL}" style="display: inline-block; background: linear-gradient(135deg, #e8b4b8, #a855f7); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 14px;">
                Book Now — Let's Get Started!
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 13px; line-height: 1.5; margin: 0;">
              We're excited to be part of your skin care journey. See you soon! 🌟
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

    console.log(`[FollowUp] 48hr email sent to ${patientEmail}`);
  } catch (err: any) {
    console.error(`[FollowUp] Failed to send 48hr email to ${patientEmail}:`, err?.message);
  }
}

/**
 * Schedule follow-up emails at 24 hours and 48 hours after analysis.
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
  const FORTY_EIGHT_HOURS = 48 * 60 * 60 * 1000;

  // Schedule 24-hour follow-up
  setTimeout(() => {
    send24HourFollowUp(config).catch((err) => {
      console.error(`[FollowUp] 24hr timer error:`, err);
    });
  }, TWENTY_FOUR_HOURS);

  // Schedule 48-hour follow-up
  setTimeout(() => {
    send48HourFollowUp(config).catch((err) => {
      console.error(`[FollowUp] 48hr timer error:`, err);
    });
    // Clean up tracking
    scheduledFollowUps.delete(key);
  }, FORTY_EIGHT_HOURS);

  console.log(`[FollowUp] Scheduled 24hr and 48hr emails for analysis ${config.analysisId} (${config.patientEmail})`);
}
