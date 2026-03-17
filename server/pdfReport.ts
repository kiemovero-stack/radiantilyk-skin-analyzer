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
        margins: { top: 50, bottom: 60, left: 50, right: 50 },
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

      const LEFT = 50;
      const pageWidth = doc.page.width - 100;
      const primaryColor = "#6C3FA0";
      const darkColor = "#1a1a2e";
      const mutedColor = "#6b7280";
      const accentGreen = "#059669";
      const accentAmber = "#d97706";
      const accentRed = "#dc2626";
      const lightBg = "#f8f7fc";

      const severityColors: Record<Severity, string> = {
        mild: accentGreen,
        moderate: accentAmber,
        severe: accentRed,
      };

      // ─── Helper functions ───
      const checkPageSpace = (needed: number) => {
        if (doc.y + needed > doc.page.height - 80) {
          doc.addPage();
        }
      };

      const drawLine = (y?: number) => {
        const lineY = y ?? doc.y;
        doc
          .strokeColor("#e5e7eb")
          .lineWidth(0.5)
          .moveTo(LEFT, lineY)
          .lineTo(LEFT + pageWidth, lineY)
          .stroke();
      };

      const sectionTitle = (num: string, title: string) => {
        checkPageSpace(60);
        doc.moveDown(1.2);
        doc
          .font("Helvetica")
          .fontSize(9)
          .fillColor(primaryColor)
          .text(`SECTION ${num}`, LEFT);
        doc
          .font("Helvetica-Bold")
          .fontSize(16)
          .fillColor(darkColor)
          .text(title, LEFT);
        doc.moveDown(0.3);
        drawLine();
        doc.moveDown(0.6);
      };

      /**
       * Fixed bullet point — renders bullet and text side by side
       * without using `continued: true`.
       */
      const bulletPoint = (text: string, indent = 0) => {
        checkPageSpace(18);
        const bulletX = LEFT + 5 + indent;
        const textX = bulletX + 12;
        const textWidth = pageWidth - indent - 17;
        const startY = doc.y;

        // Measure text height first so we can advance correctly
        doc.font("Helvetica").fontSize(10);
        const textHeight = doc.heightOfString(text, {
          width: textWidth,
        });

        doc
          .font("Helvetica")
          .fontSize(10)
          .fillColor(mutedColor)
          .text("\u2022", bulletX, startY, { width: 12, lineBreak: false });

        doc
          .font("Helvetica")
          .fontSize(10)
          .fillColor(darkColor)
          .text(text, textX, startY, { width: textWidth });

        // Ensure doc.y is past the text
        const endY = startY + Math.max(textHeight, 14);
        if (doc.y < endY) {
          doc.y = endY;
        }
      };

      // ─── Cover / Header ───
      doc.rect(0, 0, doc.page.width, 130).fill(primaryColor);

      doc
        .font("Helvetica-Bold")
        .fontSize(24)
        .fillColor("#ffffff")
        .text("AI Skin Analysis Report", LEFT, 35, { width: pageWidth });

      doc
        .font("Helvetica")
        .fontSize(11)
        .fillColor("#e0d4f0")
        .text("Powered by RadiantilyK Advanced Skin Diagnostics", LEFT, 68, {
          width: pageWidth,
        });

      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor("#d0c4e0")
        .text("rkaskin.co", LEFT, 88, { width: pageWidth });

      // Patient info bar
      doc.rect(0, 130, doc.page.width, 50).fill(lightBg);

      doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .fillColor(darkColor)
        .text(`${patient.firstName} ${patient.lastName}`, LEFT, 142);

      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor(mutedColor)
        .text(
          `Email: ${patient.email}  |  DOB: ${patient.dob}  |  Analysis Date: ${patient.analysisDate}`,
          LEFT,
          158
        );

      doc.y = 200;

      // ═══════════════════════════════════════════════════════════════
      // Section 1: Skin Health Score
      // ═══════════════════════════════════════════════════════════════
      sectionTitle("01", "Skin Health Score");

      const scoreColor =
        report.skinHealthScore >= 80
          ? accentGreen
          : report.skinHealthScore >= 60
            ? accentAmber
            : accentRed;

      // Score number
      const scoreY = doc.y;
      doc
        .font("Helvetica-Bold")
        .fontSize(40)
        .fillColor(scoreColor)
        .text(`${report.skinHealthScore}`, LEFT, scoreY, {
          width: pageWidth,
        });

      // "/ 100" positioned to the right of the score number
      doc
        .font("Helvetica")
        .fontSize(14)
        .fillColor(mutedColor)
        .text("/ 100", LEFT + 85, scoreY + 16);

      doc.moveDown(0.5);

      // Skin type info
      doc
        .font("Helvetica-Bold")
        .fontSize(9)
        .fillColor(primaryColor)
        .text(
          `${report.skinType}  \u2022  ${report.skinTone}  \u2022  Fitzpatrick Type ${report.fitzpatrickType}`,
          LEFT
        );

      doc.moveDown(0.5);
      doc
        .font("Helvetica")
        .fontSize(10)
        .fillColor(darkColor)
        .text(report.scoreJustification, LEFT, doc.y, { width: pageWidth });

      // Positive findings
      if (report.positiveFindings && report.positiveFindings.length > 0) {
        doc.moveDown(0.7);
        checkPageSpace(40);
        doc
          .font("Helvetica-Bold")
          .fontSize(10)
          .fillColor(accentGreen)
          .text("Positive Findings:", LEFT);
        doc.moveDown(0.3);
        for (const finding of report.positiveFindings) {
          bulletPoint(finding);
        }
      }

      // ═══════════════════════════════════════════════════════════════
      // Section 2: Advanced Skin Analysis
      // ═══════════════════════════════════════════════════════════════
      sectionTitle("02", "Advanced Skin Analysis");

      for (const condition of report.conditions) {
        checkPageSpace(80);
        const sevColor = severityColors[condition.severity] || mutedColor;

        // Condition name on its own line
        doc
          .font("Helvetica-Bold")
          .fontSize(11)
          .fillColor(darkColor)
          .text(condition.name, LEFT, doc.y, { width: pageWidth });

        // Severity badge on next line
        doc
          .font("Helvetica-Bold")
          .fontSize(8)
          .fillColor(sevColor)
          .text(condition.severity.toUpperCase(), LEFT + 5);

        doc
          .font("Helvetica")
          .fontSize(9)
          .fillColor(mutedColor)
          .text(`Area: ${condition.area}`, LEFT + 5);

        doc.moveDown(0.1);
        doc
          .font("Helvetica")
          .fontSize(10)
          .fillColor(darkColor)
          .text(condition.description, LEFT + 5, doc.y, {
            width: pageWidth - 10,
          });

        doc.moveDown(0.2);
        doc
          .font("Helvetica-Oblique")
          .fontSize(9)
          .fillColor(primaryColor)
          .text(`Cellular Insight: ${condition.cellularInsight}`, LEFT + 5, doc.y, {
            width: pageWidth - 10,
          });

        doc.moveDown(0.6);
      }

      // ═══════════════════════════════════════════════════════════════
      // Section 3: Missed Conditions
      // ═══════════════════════════════════════════════════════════════
      if (report.missedConditions && report.missedConditions.length > 0) {
        sectionTitle("03", "Missed Conditions Identified");

        for (const condition of report.missedConditions) {
          checkPageSpace(60);
          const sevColor = severityColors[condition.severity] || mutedColor;

          doc
            .font("Helvetica-Bold")
            .fontSize(11)
            .fillColor(darkColor)
            .text(condition.name, LEFT, doc.y, { width: pageWidth });

          doc
            .font("Helvetica-Bold")
            .fontSize(8)
            .fillColor(sevColor)
            .text(condition.severity.toUpperCase(), LEFT + 5);

          if (condition.area) {
            doc
              .font("Helvetica")
              .fontSize(9)
              .fillColor(mutedColor)
              .text(`Area: ${condition.area}`, LEFT + 5);
          }

          doc.moveDown(0.1);
          doc
            .font("Helvetica")
            .fontSize(10)
            .fillColor(darkColor)
            .text(condition.description, LEFT + 5, doc.y, {
              width: pageWidth - 10,
            });

          if (condition.cellularInsight) {
            doc.moveDown(0.2);
            doc
              .font("Helvetica-Oblique")
              .fontSize(9)
              .fillColor(primaryColor)
              .text(`Cellular Insight: ${condition.cellularInsight}`, LEFT + 5, doc.y, {
                width: pageWidth - 10,
              });
          }

          doc.moveDown(0.6);
        }
      }

      // ═══════════════════════════════════════════════════════════════
      // Section 4: Top 2 Facial Treatments
      // ═══════════════════════════════════════════════════════════════
      sectionTitle("04", "Recommended Facial Treatments");

      for (const facial of report.facialTreatments) {
        checkPageSpace(70);

        // Name on its own line
        doc
          .font("Helvetica-Bold")
          .fontSize(11)
          .fillColor(darkColor)
          .text(facial.name, LEFT, doc.y, { width: pageWidth });

        // Price on next line
        if (facial.price) {
          doc
            .font("Helvetica-Bold")
            .fontSize(10)
            .fillColor(primaryColor)
            .text(facial.price, LEFT + 5);
        }

        doc.moveDown(0.2);
        doc
          .font("Helvetica")
          .fontSize(10)
          .fillColor(darkColor)
          .text(facial.reason, LEFT + 5, doc.y, { width: pageWidth - 10 });

        if (facial.targetConditions && facial.targetConditions.length > 0) {
          doc.moveDown(0.2);
          doc
            .font("Helvetica")
            .fontSize(9)
            .fillColor(mutedColor)
            .text(`Targets: ${facial.targetConditions.join(", ")}`, LEFT + 5, doc.y, {
              width: pageWidth - 10,
            });
        }

        if (facial.benefits && facial.benefits.length > 0) {
          doc.moveDown(0.2);
          doc
            .font("Helvetica")
            .fontSize(9)
            .fillColor(accentGreen)
            .text(`Benefits: ${facial.benefits.join(", ")}`, LEFT + 5, doc.y, {
              width: pageWidth - 10,
            });
        }

        doc.moveDown(0.7);
      }

      // ═══════════════════════════════════════════════════════════════
      // Section 5: Top 4 Skin Procedures
      // ═══════════════════════════════════════════════════════════════
      sectionTitle("05", "Recommended Skin Procedures");

      for (const proc of report.skinProcedures) {
        checkPageSpace(70);

        // Priority + Name on its own line
        doc
          .font("Helvetica-Bold")
          .fontSize(11)
          .fillColor(darkColor)
          .text(`#${proc.priority} ${proc.name}`, LEFT, doc.y, {
            width: pageWidth,
          });

        // Price on next line
        if (proc.price) {
          doc
            .font("Helvetica-Bold")
            .fontSize(10)
            .fillColor(primaryColor)
            .text(proc.price, LEFT + 5);
        }

        doc.moveDown(0.2);
        doc
          .font("Helvetica")
          .fontSize(10)
          .fillColor(darkColor)
          .text(proc.reason, LEFT + 5, doc.y, { width: pageWidth - 10 });

        if (proc.targetConditions && proc.targetConditions.length > 0) {
          doc.moveDown(0.2);
          doc
            .font("Helvetica")
            .fontSize(9)
            .fillColor(mutedColor)
            .text(`Targets: ${proc.targetConditions.join(", ")}`, LEFT + 5, doc.y, {
              width: pageWidth - 10,
            });
        }

        doc.moveDown(0.2);
        doc
          .font("Helvetica-Oblique")
          .fontSize(9)
          .fillColor(accentGreen)
          .text(`Expected: ${proc.expectedResults}`, LEFT + 5, doc.y, {
            width: pageWidth - 10,
          });

        doc.moveDown(0.7);
      }

      // ═══════════════════════════════════════════════════════════════
      // Section 6: Skincare Products (from rkaskin.co)
      // ═══════════════════════════════════════════════════════════════
      sectionTitle("06", "Recommended Skincare Products");

      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor(mutedColor)
        .text("Available at rkaskin.co", LEFT);
      doc.moveDown(0.4);

      for (const product of report.skincareProducts) {
        checkPageSpace(60);

        // Product name
        doc
          .font("Helvetica-Bold")
          .fontSize(11)
          .fillColor(darkColor)
          .text(product.name, LEFT, doc.y, { width: pageWidth });

        // SKU + Price + Type line
        const metaParts: string[] = [];
        if (product.sku) metaParts.push(product.sku);
        if (product.price) metaParts.push(product.price);
        if (product.type) metaParts.push(product.type);

        if (metaParts.length > 0) {
          doc
            .font("Helvetica-Bold")
            .fontSize(9)
            .fillColor(primaryColor)
            .text(metaParts.join("  |  "), LEFT + 5);
        }

        doc.moveDown(0.1);
        doc
          .font("Helvetica")
          .fontSize(10)
          .fillColor(darkColor)
          .text(product.purpose, LEFT + 5, doc.y, { width: pageWidth - 10 });

        if (product.keyIngredients && product.keyIngredients.length > 0) {
          doc.moveDown(0.2);
          doc
            .font("Helvetica")
            .fontSize(9)
            .fillColor(mutedColor)
            .text(
              `Key Ingredients: ${product.keyIngredients.join(", ")}`,
              LEFT + 5,
              doc.y,
              { width: pageWidth - 10 }
            );
        }

        if (product.targetConditions && product.targetConditions.length > 0) {
          doc.moveDown(0.1);
          doc
            .font("Helvetica")
            .fontSize(9)
            .fillColor(accentAmber)
            .text(
              `For: ${product.targetConditions.join(", ")}`,
              LEFT + 5,
              doc.y,
              { width: pageWidth - 10 }
            );
        }

        doc.moveDown(0.7);
      }

      // ═══════════════════════════════════════════════════════════════
      // Section 7: Next-Level Insights
      // ═══════════════════════════════════════════════════════════════
      sectionTitle("07", "Next-Level Insights");

      if (report.predictiveInsights && report.predictiveInsights.length > 0) {
        doc
          .font("Helvetica-Bold")
          .fontSize(10)
          .fillColor(darkColor)
          .text("Predictive Insights", LEFT);
        doc.moveDown(0.3);

        for (const insight of report.predictiveInsights) {
          checkPageSpace(40);

          // Title on its own line
          doc
            .font("Helvetica-Bold")
            .fontSize(10)
            .fillColor(primaryColor)
            .text(insight.title, LEFT + 5, doc.y, { width: pageWidth - 10 });

          // Timeframe on next line
          doc
            .font("Helvetica")
            .fontSize(9)
            .fillColor(mutedColor)
            .text(`Timeframe: ${insight.timeframe}`, LEFT + 5);

          doc.moveDown(0.1);
          doc
            .font("Helvetica")
            .fontSize(10)
            .fillColor(darkColor)
            .text(insight.description, LEFT + 5, doc.y, {
              width: pageWidth - 10,
            });
          doc.moveDown(0.5);
        }
      }

      if (report.skinTrajectory) {
        checkPageSpace(50);
        doc.moveDown(0.3);
        doc
          .font("Helvetica-Bold")
          .fontSize(10)
          .fillColor(darkColor)
          .text("Skin Trajectory", LEFT);
        doc.moveDown(0.2);
        doc
          .font("Helvetica")
          .fontSize(10)
          .fillColor(darkColor)
          .text(report.skinTrajectory, LEFT + 5, doc.y, {
            width: pageWidth - 10,
          });
        doc.moveDown(0.5);
      }

      if (report.cellularAnalysis) {
        checkPageSpace(50);
        doc
          .font("Helvetica-Bold")
          .fontSize(10)
          .fillColor(darkColor)
          .text("Cellular Analysis", LEFT);
        doc.moveDown(0.2);
        doc
          .font("Helvetica")
          .fontSize(10)
          .fillColor(darkColor)
          .text(report.cellularAnalysis, LEFT + 5, doc.y, {
            width: pageWidth - 10,
          });
        doc.moveDown(0.5);
      }

      // ═══════════════════════════════════════════════════════════════
      // Section 8: Optimization Roadmap
      // ═══════════════════════════════════════════════════════════════
      sectionTitle("08", "Skin Optimization Roadmap");

      for (const phase of report.roadmap) {
        checkPageSpace(100);

        // Phase header with colored background
        const phaseHeaderY = doc.y;
        doc.rect(LEFT, phaseHeaderY, pageWidth, 22).fill(lightBg);

        doc
          .font("Helvetica-Bold")
          .fontSize(11)
          .fillColor(primaryColor)
          .text(
            `Phase ${phase.phase}: ${phase.title}`,
            LEFT + 8,
            phaseHeaderY + 5,
            { width: pageWidth - 16 }
          );

        doc.y = phaseHeaderY + 28;

        doc
          .font("Helvetica")
          .fontSize(9)
          .fillColor(mutedColor)
          .text(`Duration: ${phase.duration}`, LEFT + 5);

        doc.moveDown(0.3);

        // Goals
        doc
          .font("Helvetica-Bold")
          .fontSize(9)
          .fillColor(darkColor)
          .text("Goals:", LEFT + 5);
        doc.moveDown(0.1);
        for (const goal of phase.goals) {
          bulletPoint(goal, 10);
        }

        doc.moveDown(0.3);

        // Treatments
        doc
          .font("Helvetica-Bold")
          .fontSize(9)
          .fillColor(darkColor)
          .text("Treatments:", LEFT + 5);
        doc.moveDown(0.1);
        for (const treatment of phase.treatments) {
          bulletPoint(treatment, 10);
        }

        doc.moveDown(0.3);
        doc
          .font("Helvetica-Oblique")
          .fontSize(9)
          .fillColor(accentGreen)
          .text(`Expected Outcome: ${phase.expectedOutcome}`, LEFT + 5, doc.y, {
            width: pageWidth - 10,
          });

        doc.moveDown(0.8);
      }

      // ═══════════════════════════════════════════════════════════════
      // Summary
      // ═══════════════════════════════════════════════════════════════
      checkPageSpace(80);
      doc.moveDown(0.5);
      drawLine();
      doc.moveDown(0.5);
      doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .fillColor(darkColor)
        .text("Summary", LEFT);
      doc.moveDown(0.3);
      doc
        .font("Helvetica")
        .fontSize(10)
        .fillColor(darkColor)
        .text(report.summary, LEFT, doc.y, { width: pageWidth });

      // ═══════════════════════════════════════════════════════════════
      // Disclaimer
      // ═══════════════════════════════════════════════════════════════
      checkPageSpace(80);
      doc.moveDown(1);
      drawLine();
      doc.moveDown(0.5);
      doc
        .font("Helvetica-Bold")
        .fontSize(9)
        .fillColor(mutedColor)
        .text("MEDICAL DISCLAIMER", LEFT);
      doc.moveDown(0.2);
      doc
        .font("Helvetica")
        .fontSize(8)
        .fillColor(mutedColor)
        .text(report.disclaimer, LEFT, doc.y, { width: pageWidth });

      // ═══════════════════════════════════════════════════════════════
      // Footer
      // ═══════════════════════════════════════════════════════════════
      doc.moveDown(1);
      doc
        .font("Helvetica")
        .fontSize(8)
        .fillColor(mutedColor)
        .text(
          "\u00A9 RadiantilyK AI Skin Analyzer  |  rkaskin.co  |  This report is confidential and intended for the named patient only.",
          LEFT,
          doc.y,
          { width: pageWidth, align: "center" }
        );

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
