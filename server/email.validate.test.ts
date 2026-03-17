import { describe, expect, it } from "vitest";
import nodemailer from "nodemailer";

describe("Gmail App Password Validation", () => {
  it("can authenticate with Gmail SMTP using GMAIL_APP_PASSWORD", async () => {
    const appPassword = process.env.GMAIL_APP_PASSWORD;
    expect(appPassword).toBeTruthy();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "RadiantilyK@gmail.com",
        pass: appPassword,
      },
    });

    // verify() checks SMTP connection and authentication
    const verified = await transporter.verify();
    expect(verified).toBe(true);
  }, 15000); // 15s timeout for network call
});
