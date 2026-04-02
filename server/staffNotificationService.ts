/**
 * Staff Notification Email Service.
 * 
 * Sends an email to the staff team when a new client analysis is completed.
 * Includes client name, score, top concerns, recommended treatments, and a link to the report.
 */
import nodemailer from "nodemailer";

const SENDER_EMAIL = "kV@rkaglow.com";
const STAFF_EMAIL = "kV@rkaglow.com";

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

interface StaffNotificationOptions {
  patientName: string;
  patientEmail: string;
  skinHealthScore: number;
  topConcerns: string[];
  topTreatments: string[];
  reportUrl: string;
  analysisId: number;
}

export async function sendStaffNotificationEmail(
  options: StaffNotificationOptions
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const {
    patientName,
    patientEmail,
    skinHealthScore,
    topConcerns,
    topTreatments,
    reportUrl,
    analysisId,
  } = options;

  try {
    const transporter = getTransporter();

    const scoreColor = skinHealthScore >= 80 ? "#059669" : skinHealthScore >= 60 ? "#d97706" : "#dc2626";
    const concernsList = topConcerns.map((c) => `<li style="margin: 4px 0;">${c}</li>`).join("");
    const treatmentsList = topTreatments.map((t) => `<li style="margin: 4px 0;">${t}</li>`).join("");
    const baseUrl = process.env.VITE_APP_URL || "https://rkaaiskin.best";

    const result = await transporter.sendMail({
      from: `"RadiantilyK AI Skin Analyzer" <${SENDER_EMAIL}>`,
      to: STAFF_EMAIL,
      subject: `🔔 New Skin Analysis Complete — ${patientName} (Score: ${skinHealthScore}/100)`,
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fafafa; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #1e1b4b, #312e81); padding: 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 700;">New Client Analysis Complete</h1>
            <p style="color: rgba(255,255,255,0.7); margin: 8px 0 0; font-size: 13px;">A new skin analysis has been completed and is ready for review</p>
          </div>
          
          <div style="padding: 24px;">
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 13px; border-bottom: 1px solid #e5e7eb;">Client Name</td>
                <td style="padding: 8px 0; color: #1f2937; font-size: 13px; font-weight: 600; text-align: right; border-bottom: 1px solid #e5e7eb;">${patientName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 13px; border-bottom: 1px solid #e5e7eb;">Email</td>
                <td style="padding: 8px 0; color: #1f2937; font-size: 13px; text-align: right; border-bottom: 1px solid #e5e7eb;">${patientEmail}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 13px; border-bottom: 1px solid #e5e7eb;">Skin Health Score</td>
                <td style="padding: 8px 0; color: ${scoreColor}; font-size: 18px; font-weight: 700; text-align: right; border-bottom: 1px solid #e5e7eb;">${skinHealthScore}/100</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 13px; border-bottom: 1px solid #e5e7eb;">Analysis ID</td>
                <td style="padding: 8px 0; color: #1f2937; font-size: 13px; text-align: right; border-bottom: 1px solid #e5e7eb;">#${analysisId}</td>
              </tr>
            </table>

            <div style="background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
              <h3 style="color: #dc2626; font-size: 13px; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 0.5px;">Top Concerns</h3>
              <ul style="margin: 0; padding-left: 20px; color: #374151; font-size: 13px;">
                ${concernsList || "<li>None identified</li>"}
              </ul>
            </div>

            <div style="background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
              <h3 style="color: #7c3aed; font-size: 13px; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 0.5px;">Recommended Treatments</h3>
              <ul style="margin: 0; padding-left: 20px; color: #374151; font-size: 13px;">
                ${treatmentsList || "<li>None recommended</li>"}
              </ul>
            </div>

            <div style="text-align: center;">
              <a href="${baseUrl}${reportUrl}" style="display: inline-block; background: linear-gradient(135deg, #7c3aed, #4f46e5); color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-size: 14px; font-weight: 600;">
                View Full Report
              </a>
            </div>
          </div>
          
          <div style="background: #f3f4f6; padding: 12px 24px; text-align: center;">
            <p style="color: #9ca3af; font-size: 11px; margin: 0;">
              RadiantilyK AI Skin Analyzer — Staff Notification
            </p>
          </div>
        </div>
      `,
    });

    console.log(`[StaffNotification] Email sent for analysis ${analysisId} (${patientName})`);
    return { success: true, messageId: result.messageId };
  } catch (err: any) {
    console.error(`[StaffNotification] Failed to send:`, err?.message);
    return { success: false, error: err.message || "Failed to send staff notification" };
  }
}
