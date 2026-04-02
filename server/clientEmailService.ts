/**
 * Client-facing email service.
 * 
 * Sends the initial analysis report email to clients from the public portal.
 * Uses a warmer, more client-friendly tone than the staff email.
 */
import nodemailer from "nodemailer";

const SENDER_EMAIL = "kV@rkaglow.com";

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

interface SendClientReportEmailOptions {
  toEmail: string;
  patientName: string;
  skinHealthScore: number;
  pdfBuffer: Buffer;
  analysisDate: string;
  reportUrl: string;
}

/**
 * Send the client-facing analysis report email.
 */
export async function sendClientReportEmail(
  options: SendClientReportEmailOptions
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const { toEmail, patientName, skinHealthScore, pdfBuffer, analysisDate, reportUrl } = options;

  try {
    const transporter = getTransporter();
    const firstName = patientName.split(" ")[0] || patientName;

    const result = await transporter.sendMail({
      from: `"RadiantilyK Skin Care" <${SENDER_EMAIL}>`,
      to: toEmail,
      subject: `${firstName}, Your Personalized Skin Analysis is Ready!`,
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fafafa; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #e8b4b8, #a855f7); padding: 32px 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">Your Skin Analysis Results</h1>
            <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px;">Powered by RadiantilyK AI</p>
          </div>
          
          <div style="padding: 32px 24px;">
            <p style="color: #1a1a2e; font-size: 16px; margin: 0 0 16px;">
              Hi <strong>${firstName}</strong>! 👋
            </p>
            
            <p style="color: #4b5563; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
              Thank you for taking the time to get your personalized skin analysis! We've put together a detailed report just for you — it's attached as a PDF and here's a quick snapshot:
            </p>
            
            <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; text-align: center; margin: 0 0 24px;">
              <p style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px;">Your Skin Health Score</p>
              <p style="color: ${skinHealthScore >= 80 ? "#059669" : skinHealthScore >= 60 ? "#d97706" : "#dc2626"}; font-size: 48px; font-weight: 700; margin: 0;">
                ${skinHealthScore}<span style="font-size: 18px; color: #9ca3af;">/100</span>
              </p>
            </div>
            
            <p style="color: #4b5563; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
              Your report includes a detailed breakdown of your skin health, personalized treatment recommendations, product suggestions picked just for you, and a step-by-step improvement plan.
            </p>

            <div style="text-align: center; margin: 0 0 24px;">
              <a href="https://radiantapp.click/" style="display: inline-block; background: linear-gradient(135deg, #e8b4b8, #a855f7); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 14px;">
                Book Your Consultation
              </a>
            </div>
            
            <p style="color: #4b5563; font-size: 14px; line-height: 1.6; margin: 0 0 8px;">
              <strong>Analysis Date:</strong> ${analysisDate}
            </p>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
            
            <p style="color: #6b7280; font-size: 13px; line-height: 1.5; margin: 0 0 16px;">
              Have questions about your results? We'd love to help! Book a consultation and our team will walk you through everything.
            </p>
            
            <p style="color: #9ca3af; font-size: 11px; line-height: 1.5; margin: 0;">
              <strong>Note:</strong> This AI analysis is for informational purposes only and is not a substitute for professional medical advice. Please consult with our team for personalized treatment recommendations.
            </p>
          </div>
          
          <div style="background: #f3f4f6; padding: 16px 24px; text-align: center;">
            <p style="color: #9ca3af; font-size: 11px; margin: 0;">
              © RadiantilyK Skin Care — Your Personalized Skin Analysis
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
    console.error("[ClientEmail] Failed to send report:", err);
    return { success: false, error: err.message || "Failed to send email" };
  }
}
