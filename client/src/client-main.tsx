/**
 * Client-only entry point — lightweight, no tRPC, no auth.
 * Served on the standalone client domain.
 */
import { createRoot } from "react-dom/client";
import ClientApp from "./ClientApp";
import "./index.css";

createRoot(document.getElementById("root")!).render(<ClientApp />);
