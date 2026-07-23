import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendAssessmentNotification({
  customerName,
  salespersonName,
  assessmentId,
}: {
  customerName: string;
  salespersonName: string;
  assessmentId: string;
}) {
  if (!process.env.SMTP_USER || process.env.SMTP_USER === "your-email@gmail.com") {
    console.log("[Email skipped] SMTP credentials not set in .env");
    return;
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const assessmentLink = `${siteUrl}/admin/assessments/${assessmentId}`;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || "Good Bathroom Renos <noreply@gbath.com>",
      to: process.env.SMTP_USER, // sends to admin email
      subject: `New Assessment Submitted: ${customerName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #E8621A;">Good Bathroom Renos</h2>
          <p>A new bathroom assessment report has been submitted by <strong>${salespersonName}</strong> for client <strong>${customerName}</strong>.</p>
          <p><a href="${assessmentLink}" style="background-color: #E8621A; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block;">View Assessment Report</a></p>
        </div>
      `,
    });
    console.log("Assessment notification email sent.");
  } catch (err) {
    console.error("Failed to send email:", err);
  }
}
