import PDFDocument from "pdfkit";
import type { SkinAnalysisReport, Severity } from "../shared/types";

interface PatientInfo {
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
  analysisDate: string;
}

/**
 * Generate a premium PDF report for a skin analysis.
 * Returns a Buffer containing the PDF bytes.
 */
export async function generateReportPdf(
  report: SkinAnalysisReport,
  patient: PatientInfo
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
        info: {
          Title: `Skin Analysis Report - ${patient.firstName} ${patient.lastName}`,
          Author: "RadiantilyK AI Skin Analyzer",
          Subject: "AI Skin Analysis Report",
        },
      });

      const chunks: Buffer[] = [];
      doc.on("data", (chunk: Buffer) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      const pageWidth = doc.page.width - 100; // margins
      const primaryColor = "#6C3FA0";
      const darkColor = "#1a1a2e";
      const mutedColor = "#6b7280";
      const accentGreen = "#059669";
      const accentAmber = "#d97706";
      const accentRed = "#dc2626";

      const severityColors: Record<Severity, string> = {
        mild: accentGreen,
        moderate: accentAmber,
        severe: accentRed,
      };

      // ─── Helper functions ───
      const checkPageSpace = (needed: number) => {
        if (doc.y + needed > doc.page.height - 70) {
          doc.addPage();
        }
      };

      const drawLine = (y: number) => {
        doc
          .strokeColor("#e5e7eb")
          .lineWidth(0.5)
          .moveTo(50, y)
          .lineTo(50 + pageWidth, y)
          .stroke();
      };

      const sectionTitle = (num: string, title: string) => {
        checkPageSpace(60);
        doc.moveDown(1);
        doc
          .font("Helvetica")
          .fontSize(9)
          .fillColor(primaryColor)
          .text(`SECTION ${num}`, { continued: false });
        doc
          .font("Helvetica-Bold")
          .fontSize(16)
          .fillColor(darkColor)
          .text(title);
        doc.moveDown(0.3);
        drawLine(doc.y);
        doc.moveDown(0.5);
      };

      const bulletPoint = (text: string, indent = 0) => {
        checkPageSpace(20);
        const x = 55 + indent;
        doc
          .font("Helvetica")
          .fontSize(10)
          .fillColor(mutedColor)
          .text("•", x, doc.y, { continued: true, width: 12 })
          .fillColor(darkColor)
          .text(` ${text}`, { width: pageWidth - indent - 15 });
      };

      // ─── Cover / Header ───
      doc
        .rect(0, 0, doc.page.width, 140)
        .fill(primaryColor);

      doc
        .font("Helvetica-Bold")
        .fontSize(24)
        .fillColor("#ffffff")
        .text("AI Skin Analysis Report", 50, 40, { width: pageWidth });

      doc
        .font("Helvetica")
        .fontSize(11)
        .fillColor("rgba(255,255,255,0.8)")
        .text("Powered by RadiantilyK Advanced Skin Diagnostics", 50, 72, {
          width: pageWidth,
        });

      // Patient info bar
      doc
        .rect(0, 140, doc.page.width, 55)
        .fill("#f3f0f9");

      doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .fillColor(darkColor)
        .text(
          `${patient.firstName} ${patient.lastName}`,
          50,
          152
        );

      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor(mutedColor)
        .text(
          `Email: ${patient.email}  |  DOB: ${patient.dob}  |  Analysis Date: ${patient.analysisDate}`,
          50,
          170
        );

      doc.y = 215;

      // ─── Section 1: Skin Health Score ───
      sectionTitle("01", "Skin Health Score");

      const scoreColor =
        report.skinHealthScore >= 80
          ? accentGreen
          : report.skinHealthScore >= 60
            ? accentAmber
            : accentRed;

      doc
        .font("Helvetica-Bold")
        .fontSize(42)
        .fillColor(scoreColor)
        .text(`${report.skinHealthScore}`, 50, doc.y, {
          continued: true,
          width: 80,
        });
      doc
        .font("Helvetica")
        .fontSize(14)
        .fillColor(mutedColor)
        .text(" / 100", { baseline: "alphabetic" });

      doc.moveDown(0.5);

      // Skin type badges
      doc
        .font("Helvetica-Bold")
        .fontSize(9)
        .fillColor(primaryColor)
        .text(
          `${report.skinType}  •  ${report.skinTone}  •  Fitzpatrick Type ${report.fitzpatrickType}`,
          50
        );

      doc.moveDown(0.5);
      doc
        .font("Helvetica")
        .fontSize(10)
        .fillColor(darkColor)
        .text(report.scoreJustification, 50, doc.y, { width: pageWidth });

      // Positive findings
      if (report.positiveFindings && report.positiveFindings.length > 0) {
        doc.moveDown(0.5);
        checkPageSpace(40);
        doc
          .font("Helvetica-Bold")
          .fontSize(10)
          .fillColor(accentGreen)
          .text("Positive Findings:");
        doc.moveDown(0.2);
        for (const finding of report.positiveFindings) {
          bulletPoint(finding);
        }
      }

      // ─── Section 2: Advanced Skin Analysis ───
      sectionTitle("02", "Advanced Skin Analysis");

      for (const condition of report.conditions) {
        checkPageSpace(70);
        const sevColor = severityColors[condition.severity] || mutedColor;

        doc
          .font("Helvetica-Bold")
          .fontSize(11)
          .fillColor(darkColor)
          .text(condition.name, 50, doc.y, { continued: true });
        doc
          .font("Helvetica")
          .fontSize(9)
          .fillColor(sevColor)
          .text(`  [${condition.severity.toUpperCase()}]`);

        doc
          .font("Helvetica")
          .fontSize(9)
          .fillColor(mutedColor)
          .text(`Area: ${condition.area}`, 55);

        doc
          .font("Helvetica")
          .fontSize(10)
          .fillColor(darkColor)
          .text(condition.description, 55, doc.y + 2, {
            width: pageWidth - 10,
          });

        doc.moveDown(0.2);
        doc
          .font("Helvetica-Oblique")
          .fontSize(9)
          .fillColor(primaryColor)
          .text(`Cellular Insight: ${condition.cellularInsight}`, 55, doc.y, {
            width: pageWidth - 10,
          });

        doc.moveDown(0.5);
      }

      // ─── Section 3: Missed Conditions ───
      if (report.missedConditions && report.missedConditions.length > 0) {
        sectionTitle("03", "Missed Conditions Identified");

        for (const condition of report.missedConditions) {
          checkPageSpace(60);
          const sevColor = severityColors[condition.severity] || mutedColor;

          doc
            .font("Helvetica-Bold")
            .fontSize(11)
            .fillColor(darkColor)
            .text(condition.name, 50, doc.y, { continued: true });
          doc
            .font("Helvetica")
            .fontSize(9)
            .fillColor(sevColor)
            .text(`  [${condition.severity.toUpperCase()}]`);

          doc
            .font("Helvetica")
            .fontSize(10)
            .fillColor(darkColor)
            .text(condition.description, 55, doc.y + 2, {
              width: pageWidth - 10,
            });

          doc.moveDown(0.5);
        }
      }

      // ─── Section 4: Top 2 Facial Treatments ───
      sectionTitle("04", "Recommended Facial Treatments");

      for (const facial of report.facialTreatments) {
        checkPageSpace(60);
        doc
          .font("Helvetica-Bold")
          .fontSize(11)
          .fillColor(darkColor)
          .text(facial.name, 50, doc.y, { continued: true });
        if (facial.price) {
          doc
            .font("Helvetica-Bold")
            .fontSize(10)
            .fillColor(primaryColor)
            .text(`  ${facial.price}`);
        } else {
          doc.text("");
        }

        doc
          .font("Helvetica")
          .fontSize(10)
          .fillColor(darkColor)
          .text(facial.reason, 55, doc.y + 2, { width: pageWidth - 10 });

        if (facial.benefits && facial.benefits.length > 0) {
          doc.moveDown(0.2);
          for (const b of facial.benefits) {
            bulletPoint(b, 5);
          }
        }
        doc.moveDown(0.5);
      }

      // ─── Section 5: Top 4 Skin Procedures ───
      sectionTitle("05", "Recommended Skin Procedures");

      for (const proc of report.skinProcedures) {
        checkPageSpace(70);
        doc
          .font("Helvetica-Bold")
          .fontSize(11)
          .fillColor(darkColor)
          .text(`#${proc.priority} ${proc.name}`, 50, doc.y, {
            continued: true,
          });
        if (proc.price) {
          doc
            .font("Helvetica-Bold")
            .fontSize(10)
            .fillColor(primaryColor)
            .text(`  ${proc.price}`);
        } else {
          doc.text("");
        }

        doc
          .font("Helvetica")
          .fontSize(10)
          .fillColor(darkColor)
          .text(proc.reason, 55, doc.y + 2, { width: pageWidth - 10 });

        doc.moveDown(0.2);
        doc
          .font("Helvetica-Oblique")
          .fontSize(9)
          .fillColor(accentGreen)
          .text(`Expected: ${proc.expectedResults}`, 55, doc.y, {
            width: pageWidth - 10,
          });

        doc.moveDown(0.5);
      }

      // ─── Section 6: Skincare Products ───
      sectionTitle("06", "Recommended Skincare Products");

      for (const product of report.skincareProducts) {
        checkPageSpace(50);
        doc
          .font("Helvetica-Bold")
          .fontSize(11)
          .fillColor(darkColor)
          .text(product.name, 50, doc.y, { continued: true });
        doc
          .font("Helvetica")
          .fontSize(9)
          .fillColor(mutedColor)
          .text(`  (${product.type})`);

        doc
          .font("Helvetica")
          .fontSize(10)
          .fillColor(darkColor)
          .text(product.purpose, 55, doc.y + 2, { width: pageWidth - 10 });

        if (product.keyIngredients && product.keyIngredients.length > 0) {
          doc.moveDown(0.2);
          doc
            .font("Helvetica")
            .fontSize(9)
            .fillColor(primaryColor)
            .text(
              `Key Ingredients: ${product.keyIngredients.join(", ")}`,
              55,
              doc.y,
              { width: pageWidth - 10 }
            );
        }
        doc.moveDown(0.5);
      }

      // ─── Section 7: Next-Level Insights ───
      sectionTitle("07", "Next-Level Insights");

      if (report.predictiveInsights && report.predictiveInsights.length > 0) {
        doc
          .font("Helvetica-Bold")
          .fontSize(10)
          .fillColor(darkColor)
          .text("Predictive Insights");
        doc.moveDown(0.3);

        for (const insight of report.predictiveInsights) {
          checkPageSpace(40);
          doc
            .font("Helvetica-Bold")
            .fontSize(10)
            .fillColor(primaryColor)
            .text(`${insight.title}`, 55, doc.y, { continued: true });
          doc
            .font("Helvetica")
            .fontSize(9)
            .fillColor(mutedColor)
            .text(`  (${insight.timeframe})`);
          doc
            .font("Helvetica")
            .fontSize(10)
            .fillColor(darkColor)
            .text(insight.description, 55, doc.y + 2, {
              width: pageWidth - 10,
            });
          doc.moveDown(0.4);
        }
      }

      if (report.skinTrajectory) {
        checkPageSpace(40);
        doc
          .font("Helvetica-Bold")
          .fontSize(10)
          .fillColor(darkColor)
          .text("Skin Trajectory");
        doc
          .font("Helvetica")
          .fontSize(10)
          .fillColor(darkColor)
          .text(report.skinTrajectory, 55, doc.y + 2, {
            width: pageWidth - 10,
          });
        doc.moveDown(0.5);
      }

      if (report.cellularAnalysis) {
        checkPageSpace(40);
        doc
          .font("Helvetica-Bold")
          .fontSize(10)
          .fillColor(darkColor)
          .text("Cellular Analysis");
        doc
          .font("Helvetica")
          .fontSize(10)
          .fillColor(darkColor)
          .text(report.cellularAnalysis, 55, doc.y + 2, {
            width: pageWidth - 10,
          });
        doc.moveDown(0.5);
      }

      // ─── Section 8: Optimization Roadmap ───
      sectionTitle("08", "Skin Optimization Roadmap");

      for (const phase of report.roadmap) {
        checkPageSpace(80);

        doc
          .font("Helvetica-Bold")
          .fontSize(12)
          .fillColor(primaryColor)
          .text(`Phase ${phase.phase}: ${phase.title}`, 50);

        doc
          .font("Helvetica")
          .fontSize(9)
          .fillColor(mutedColor)
          .text(`Duration: ${phase.duration}`, 55);

        doc.moveDown(0.3);
        doc
          .font("Helvetica-Bold")
          .fontSize(9)
          .fillColor(darkColor)
          .text("Goals:", 55);
        for (const goal of phase.goals) {
          bulletPoint(goal, 10);
        }

        doc.moveDown(0.2);
        doc
          .font("Helvetica-Bold")
          .fontSize(9)
          .fillColor(darkColor)
          .text("Treatments:", 55);
        for (const treatment of phase.treatments) {
          bulletPoint(treatment, 10);
        }

        doc.moveDown(0.2);
        doc
          .font("Helvetica-Oblique")
          .fontSize(9)
          .fillColor(accentGreen)
          .text(`Expected Outcome: ${phase.expectedOutcome}`, 55, doc.y, {
            width: pageWidth - 10,
          });

        doc.moveDown(0.7);
      }

      // ─── Summary ───
      checkPageSpace(60);
      doc.moveDown(0.5);
      drawLine(doc.y);
      doc.moveDown(0.5);
      doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .fillColor(darkColor)
        .text("Summary");
      doc.moveDown(0.3);
      doc
        .font("Helvetica")
        .fontSize(10)
        .fillColor(darkColor)
        .text(report.summary, 50, doc.y, { width: pageWidth });

      // ─── Disclaimer ───
      checkPageSpace(60);
      doc.moveDown(1);
      drawLine(doc.y);
      doc.moveDown(0.5);
      doc
        .font("Helvetica-Bold")
        .fontSize(9)
        .fillColor(mutedColor)
        .text("MEDICAL DISCLAIMER");
      doc.moveDown(0.2);
      doc
        .font("Helvetica")
        .fontSize(8)
        .fillColor(mutedColor)
        .text(report.disclaimer, 50, doc.y, { width: pageWidth });

      // ─── Footer ───
      doc.moveDown(1);
      doc
        .font("Helvetica")
        .fontSize(8)
        .fillColor(mutedColor)
        .text(
          "© RadiantilyK AI Skin Analyzer — This report is confidential and intended for the named patient only.",
          50,
          doc.y,
          { width: pageWidth, align: "center" }
        );

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
