/**
 * Staff Notification Email Service
 *
 * Sends an email to staff when a new client analysis completes,
 * including patient info, score, concerns, and a link to the report.
 */
import nodemailer from "nodemailer";

const SENDER_EMAIL = "kV@rkaglow.com";
const STAFF_EMAIL = "kV@rkaglow.com";

function getTransporter() {
  const appPassword = process.env.GMAIL_APP_PASSWORD;
  if (!appPassword) {
    throw new Error("GMAIL_APP_PASSWORD not set");
  }
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: SENDER_EMAIL,
      pass: appPassword,
    },
  });
}

interface StaffNotificationConfig {
  patientName: string;
  patientEmail: string;
  skinHealthScore: number;
  topConcerns: string[];
  topTreatments: string[];
  reportUrl: string;
  analysisId: number;
}

export async function sendStaffNotificationEmail(config: StaffNotificationConfig) {
  const {
    patientName,
    patientEmail,
    skinHealthScore,
    topConcerns,
    topTreatments,
    reportUrl,
    analysisId,
  } = config;

  const scoreColor =
    skinHealthScore >= 75 ? "#22c55e" : skinHealthScore >= 55 ? "#f59e0b" : "#ef4444";

  const concernsList = topConcerns.map((c) => `<li>${c}</li>`).join("");
  const treatmentsList = topTreatments.map((t) => `<li>${t}</li>`).join("");

  const transporter = getTransporter();
  await transporter.sendMail({
    from: `"RadiantilyK AI Skin Analyzer" <${SENDER_EMAIL}>`,
    to: STAFF_EMAIL,
    subject: `New Skin Analysis: ${patientName} (Score: ${skinHealthScore}/100)`,
    html: `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fafafa; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #1a1a2e, #6366f1); padding: 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 20px;">New Client Analysis Complete</h1>
        </div>
        <div style="padding: 24px;">
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Patient</td>
              <td style="padding: 8px 0; font-weight: 600; font-size: 14px;">${patientName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Email</td>
              <td style="padding: 8px 0; font-size: 14px;"><a href="mailto:${patientEmail}">${patientEmail}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Score</td>
              <td style="padding: 8px 0; font-weight: 700; font-size: 18px; color: ${scoreColor};">${skinHealthScore}/100</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Analysis ID</td>
              <td style="padding: 8px 0; font-size: 14px;">#${analysisId}</td>
            </tr>
          </table>
          <div style="margin-bottom: 16px;">
            <h3 style="margin: 0 0 8px; font-size: 14px; color: #1a1a2e;">Top Concerns</h3>
            <ul style="margin: 0; padding-left: 20px; color: #4b5563; font-size: 13px; line-height: 1.8;">
              ${concernsList || "<li>None identified</li>"}
            </ul>
          </div>
          <div style="margin-bottom: 20px;">
            <h3 style="margin: 0 0 8px; font-size: 14px; color: #1a1a2e;">Recommended Treatments</h3>
            <ul style="margin: 0; padding-left: 20px; color: #4b5563; font-size: 13px; line-height: 1.8;">
              ${treatmentsList || "<li>None recommended</li>"}
            </ul>
          </div>
          <div style="text-align: center;">
            <a href="${reportUrl}" style="display: inline-block; background: linear-gradient(135deg, #6366f1, #a855f7); color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 14px;">
              View Full Report
            </a>
          </div>
        </div>
        <div style="background: #f3f4f6; padding: 12px 24px; text-align: center;">
          <p style="color: #9ca3af; font-size: 11px; margin: 0;">RadiantilyK AI Skin Analyzer &mdash; Staff Notification</p>
        </div>
      </div>
    `,
  });

  console.log(`[StaffNotification] Email sent for analysis #${analysisId} (${patientName})`);
}
