/**
 * Questionnaire & Consent Form PDF Download Routes.
 *
 * Public endpoints:
 *   GET /api/questionnaires/peptide-therapy   — Download Peptide Therapy Intake Questionnaire PDF
 *   GET /api/questionnaires/hrt               — Download HRT Intake Questionnaire PDF
 *   GET /api/questionnaires/list              — List all available questionnaires
 */
import type { Express, Request, Response } from "express";
import { generatePeptideTherapyQuestionnaire } from "./questionnaires/peptideTherapyQuestionnaire";
import { generateHRTQuestionnaire } from "./questionnaires/hrtQuestionnaire";

export function registerQuestionnaireRoutes(app: Express) {
  // List available questionnaires
  app.get("/api/questionnaires/list", (_req: Request, res: Response) => {
    res.json({
      questionnaires: [
        {
          id: "peptide-therapy",
          title: "Peptide Therapy Intake Questionnaire & Informed Consent",
          description: "Comprehensive intake form for peptide therapy including BPC-157, GHK-Cu, Thymosin Alpha-1, and CJC-1295/Ipamorelin",
          downloadUrl: "/api/questionnaires/peptide-therapy",
          pages: 6,
        },
        {
          id: "hrt",
          title: "Hormone Replacement Therapy Intake Questionnaire & Informed Consent",
          description: "Comprehensive intake form for hormone replacement therapy including bioidentical HRT, testosterone optimization, and thyroid management",
          downloadUrl: "/api/questionnaires/hrt",
          pages: 7,
        },
      ],
    });
  });

  // Download Peptide Therapy Questionnaire PDF
  app.get("/api/questionnaires/peptide-therapy", async (req: Request, res: Response) => {
    try {
      const patientName = req.query.name as string | undefined;
      const patientDob = req.query.dob as string | undefined;
      const pdfBuffer = await generatePeptideTherapyQuestionnaire(patientName, patientDob);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", 'attachment; filename="RadiantilyK_Peptide_Therapy_Intake.pdf"');
      res.setHeader("Content-Length", pdfBuffer.length);
      res.send(pdfBuffer);
    } catch (err) {
      console.error("Error generating peptide therapy questionnaire:", err);
      res.status(500).json({ error: "Failed to generate questionnaire" });
    }
  });

  // Download HRT Questionnaire PDF
  app.get("/api/questionnaires/hrt", async (req: Request, res: Response) => {
    try {
      const patientName = req.query.name as string | undefined;
      const patientDob = req.query.dob as string | undefined;
      const pdfBuffer = await generateHRTQuestionnaire(patientName, patientDob);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", 'attachment; filename="RadiantilyK_HRT_Intake.pdf"');
      res.setHeader("Content-Length", pdfBuffer.length);
      res.send(pdfBuffer);
    } catch (err) {
      console.error("Error generating HRT questionnaire:", err);
      res.status(500).json({ error: "Failed to generate questionnaire" });
    }
  });
}
