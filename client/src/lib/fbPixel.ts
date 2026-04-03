/**
 * Facebook Pixel tracking utility.
 * Fires standard and custom events for conversion tracking.
 * Safe to call even if the Pixel is not configured — all calls are no-ops when fbq is unavailable.
 */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

function track(event: string, data?: Record<string, unknown>) {
  if (typeof window !== "undefined" && window.fbq) {
    if (data) {
      window.fbq("track", event, data);
    } else {
      window.fbq("track", event);
    }
  }
}

function trackCustom(event: string, data?: Record<string, unknown>) {
  if (typeof window !== "undefined" && window.fbq) {
    if (data) {
      window.fbq("trackCustom", event, data);
    } else {
      window.fbq("trackCustom", event);
    }
  }
}

/** Standard Meta events */
export const fbPixel = {
  /** Fires when the client landing page loads (already in base code) */
  pageView: () => track("PageView"),

  /** Fires when a user clicks "Get My Free Skin Analysis" or starts the flow */
  startAnalysis: () => trackCustom("StartAnalysis"),

  /** Fires when photos are uploaded and analysis begins */
  submitPhotos: () => trackCustom("SubmitPhotos"),

  /** Fires when the AI analysis completes and report is ready */
  completeAnalysis: (data?: { score?: number }) =>
    trackCustom("CompleteAnalysis", data),

  /** Fires when the user views their full report */
  viewReport: () => track("ViewContent", { content_type: "skin_report" }),

  /** Fires when the user clicks "Book Appointment" */
  bookAppointment: () => track("Schedule"),

  /** Fires when the user clicks the phone number */
  callClinic: () => track("Contact"),

  /** Fires when the user shares their report */
  shareReport: () => trackCustom("ShareReport"),

  /** Fires when the user clicks "Get Directions" */
  getDirections: () => trackCustom("GetDirections"),

  /** Lead event — fires when a client completes the full analysis flow */
  lead: (data?: { content_name?: string }) => track("Lead", data),
};
