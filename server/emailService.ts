import nodemailer from "nodemailer";

const SENDER_EMAIL = "RadiantilyK@gmail.com";

/**
 * Create a nodemailer transporter using Gmail SMTP.
 * Requires GMAIL_APP_PASSWORD env var (16-char app password from Google).
 */
function getTransporter() {
  const appPassword = process.env.GMAIL_APP_PASSWORD;
  if (!appPassword) {
    throw new Error(
      "GMAIL_APP_PASSWORD environment variable is not set. Please configure a Gmail App Password."
    );
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: SENDER_EMAIL,
      pass: appPassword,
    },
  });
}

interface SendReportEmailOptions {
  toEmail: string;
  patientName: string;
  skinHealthScore: number;
  pdfBuffer: Buffer;
  analysisDate: string;
}

/**
 * Send the skin analysis PDF report to the patient's email.
 */
export async function sendReportEmail(
  options: SendReportEmailOptions
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const { toEmail, patientName, skinHealthScore, pdfBuffer, analysisDate } =
    options;

  try {
    const transporter = getTransporter();

    const result = await transporter.sendMail({
      from: `"RadiantilyK Skin Analyzer" <${SENDER_EMAIL}>`,
      to: toEmail,
      subject: `Your AI Skin Analysis Report — ${analysisDate}`,
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fafafa; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #6C3FA0, #4F46E5); padding: 32px 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">AI Skin Analysis Report</h1>
            <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px;">Powered by RadiantilyK</p>
          </div>
          
          <div style="padding: 32px 24px;">
            <p style="color: #1a1a2e; font-size: 16px; margin: 0 0 16px;">
              Hi <strong>${patientName}</strong>,
            </p>
            
            <p style="color: #4b5563; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
              Thank you for your visit! Your personalized AI skin analysis report is attached to this email as a PDF. Here's a quick overview:
            </p>
            
            <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; text-align: center; margin: 0 0 24px;">
              <p style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px;">Skin Health Score</p>
              <p style="color: ${skinHealthScore >= 80 ? "#059669" : skinHealthScore >= 60 ? "#d97706" : "#dc2626"}; font-size: 48px; font-weight: 700; margin: 0;">
                ${skinHealthScore}<span style="font-size: 18px; color: #9ca3af;">/100</span>
              </p>
            </div>
            
            <p style="color: #4b5563; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
              Your report includes detailed skin analysis, personalized treatment recommendations from our service catalog, skincare product suggestions, and a phased optimization roadmap.
            </p>
            
            <p style="color: #4b5563; font-size: 14px; line-height: 1.6; margin: 0 0 8px;">
              <strong>Analysis Date:</strong> ${analysisDate}
            </p>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
            
            <p style="color: #9ca3af; font-size: 11px; line-height: 1.5; margin: 0;">
              <strong>Disclaimer:</strong> This AI-generated report is for informational purposes only and does not constitute medical advice. Please consult with a licensed dermatologist or skincare professional for diagnosis and treatment decisions.
            </p>
          </div>
          
          <div style="background: #f3f4f6; padding: 16px 24px; text-align: center;">
            <p style="color: #9ca3af; font-size: 11px; margin: 0;">
              © RadiantilyK AI Skin Analyzer — Confidential Patient Report
            </p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: `SkinAnalysis_${patientName.replace(/\s+/g, "_")}_${analysisDate.replace(/[\s,:]/g, "-")}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    return { success: true, messageId: result.messageId };
  } catch (err: any) {
    console.error("[Email] Failed to send report:", err);
    return {
      success: false,
      error: err.message || "Failed to send email",
    };
  }
}
