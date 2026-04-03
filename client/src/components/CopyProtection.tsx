import { useEffect } from "react";

/**
 * CopyProtection component — prevents casual copying/scraping of the Skin AI app.
 * - Disables right-click context menu
 * - Blocks common dev-tools keyboard shortcuts (F12, Ctrl+Shift+I/J/C, Ctrl+U)
 * - Disables text selection via CSS on body
 * - Disables drag on images
 * - Blocks copy/paste of page content
 * - Blocks print screen attempts
 */
export default function CopyProtection() {
  useEffect(() => {
    // Block right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Block dev-tools shortcuts and print
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === "F12") {
        e.preventDefault();
        return false;
      }
      // Ctrl+Shift+I (Inspect), Ctrl+Shift+J (Console), Ctrl+Shift+C (Element picker)
      if (e.ctrlKey && e.shiftKey && ["I", "i", "J", "j", "C", "c"].includes(e.key)) {
        e.preventDefault();
        return false;
      }
      // Ctrl+U (View Source)
      if (e.ctrlKey && (e.key === "u" || e.key === "U")) {
        e.preventDefault();
        return false;
      }
      // Ctrl+S (Save page)
      if (e.ctrlKey && (e.key === "s" || e.key === "S") && !e.shiftKey) {
        e.preventDefault();
        return false;
      }
      // Ctrl+P (Print)
      if (e.ctrlKey && (e.key === "p" || e.key === "P")) {
        e.preventDefault();
        return false;
      }
      // Cmd+Option+I (Mac Inspect), Cmd+Option+J (Mac Console)
      if (e.metaKey && e.altKey && ["i", "I", "j", "J"].includes(e.key)) {
        e.preventDefault();
        return false;
      }
      // Cmd+S (Mac Save)
      if (e.metaKey && (e.key === "s" || e.key === "S")) {
        e.preventDefault();
        return false;
      }
      // Cmd+P (Mac Print)
      if (e.metaKey && (e.key === "p" || e.key === "P")) {
        e.preventDefault();
        return false;
      }
      // PrintScreen
      if (e.key === "PrintScreen") {
        e.preventDefault();
        return false;
      }
    };

    // Block copy
    const handleCopy = (e: ClipboardEvent) => {
      // Allow copy in input/textarea fields
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
      e.preventDefault();
    };

    // Disable image dragging
    const handleDragStart = (e: DragEvent) => {
      if (e.target instanceof HTMLImageElement) {
        e.preventDefault();
      }
    };

    // Add CSS to disable text selection on body
    document.body.style.userSelect = "none";
    document.body.style.webkitUserSelect = "none";
    (document.body.style as any).msUserSelect = "none";
    (document.body.style as any).MozUserSelect = "none";

    // Allow text selection in form inputs
    const style = document.createElement("style");
    style.id = "copy-protection-styles";
    style.textContent = `
      input, textarea, [contenteditable="true"] {
        -webkit-user-select: text !important;
        user-select: text !important;
      }
      @media print {
        body { display: none !important; }
      }
    `;
    document.head.appendChild(style);

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("dragstart", handleDragStart);
    document.addEventListener("copy", handleCopy);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("dragstart", handleDragStart);
      document.removeEventListener("copy", handleCopy);
      document.body.style.userSelect = "";
      document.body.style.webkitUserSelect = "";
      const existingStyle = document.getElementById("copy-protection-styles");
      if (existingStyle) existingStyle.remove();
    };
  }, []);

  return null;
}

/**
 * Watermark overlay for report pages — renders a repeating diagonal
 * "RadiantilyK" text across the page to discourage screenshots.
 */
export function ReportWatermark() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none"
      aria-hidden="true"
      style={{ userSelect: "none", WebkitUserSelect: "none" }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 200px,
            rgba(180, 160, 210, 0.04) 200px,
            rgba(180, 160, 210, 0.04) 201px
          )`,
        }}
      />
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="absolute whitespace-nowrap text-[14px] font-light tracking-[0.3em] uppercase"
          style={{
            color: "rgba(160, 140, 200, 0.06)",
            transform: "rotate(-35deg)",
            top: `${i * 120 - 100}px`,
            left: "-200px",
            width: "300%",
            userSelect: "none",
            WebkitUserSelect: "none",
          }}
        >
          {"RadiantilyK Skin AI  •  RadiantilyK Skin AI  •  RadiantilyK Skin AI  •  RadiantilyK Skin AI  •  RadiantilyK Skin AI  •  "}
        </div>
      ))}
    </div>
  );
}
