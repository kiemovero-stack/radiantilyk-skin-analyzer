/**
 * Standalone Client App — served on the client-specific domain.
 *
 * Routes:
 *   /            → Landing page (was /client)
 *   /start       → Analyze flow (was /client/start)
 *   /report/:id  → Report page (was /client/report/:id)
 */
import { Toaster } from "sonner";
import { Route, Switch } from "wouter";
import CopyProtection from "./components/CopyProtection";
import ClientLanding from "./pages/ClientLanding";
import ClientAnalyze from "./pages/ClientAnalyze";
import ClientReport from "./pages/ClientReport";
import ScarTreatment from "./pages/ScarTreatment";

function ClientRouter() {
  return (
    <Switch>
      <Route path="/" component={ClientLanding} />
      <Route path="/start" component={ClientAnalyze} />
      <Route path="/report/:id" component={ClientReport} />
      <Route path="/scar-treatment" component={ScarTreatment} />
      {/* Backward compat: old /client paths redirect to new paths */}
      <Route path="/client">
        {() => {
          window.location.href = "/";
          return null;
        }}
      </Route>
      <Route path="/client/start">
        {() => {
          window.location.href = "/start";
          return null;
        }}
      </Route>
      <Route path="/client/report/:id">
        {(params: { id: string }) => {
          window.location.href = `/report/${params.id}`;
          return null;
        }}
      </Route>
      {/* 404 → redirect to landing */}
      <Route>
        {() => {
          // Use wouter navigate instead of window.location to avoid full reload
          window.history.replaceState(null, "", "/");
          return <ClientLanding />;
        }}
      </Route>
    </Switch>
  );
}

export default function ClientApp() {
  return (
    <>
      <CopyProtection />
      <Toaster
        theme="light"
        className="toaster group"
        style={
          {
            "--normal-bg": "var(--popover)",
            "--normal-text": "var(--popover-foreground)",
            "--normal-border": "var(--border)",
          } as React.CSSProperties
        }
      />
      <ClientRouter />
    </>
  );
}
