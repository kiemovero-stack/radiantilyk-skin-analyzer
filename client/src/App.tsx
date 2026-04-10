import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import CopyProtection from "./components/CopyProtection";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Analyze from "./pages/Analyze";
import Report from "./pages/Report";
import History from "./pages/History";
import Compare from "./pages/Compare";
import ClientLanding from "./pages/ClientLanding";
import ClientAnalyze from "./pages/ClientAnalyze";
import ClientReport from "./pages/ClientReport";
import ScarConsultation from "./pages/ScarConsultation";
import ScarTreatment from "./pages/ScarTreatment";
import LeadDashboard from "./pages/LeadDashboard";
import StaffManagement from "./pages/StaffManagement";
import StaffGuide from "./pages/StaffGuide";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/analyze" component={Analyze} />
      <Route path="/report/:id" component={Report} />
      <Route path="/history" component={History} />
      <Route path="/compare" component={Compare} />
      {/* Public client-facing routes (no login required) */}
      <Route path="/client" component={ClientLanding} />
      <Route path="/client/start" component={ClientAnalyze} />
      <Route path="/client/report/:id" component={ClientReport} />
      <Route path="/scar-consultation" component={ScarConsultation} />
      <Route path="/scar-treatment" component={ScarTreatment} />
      {/* Staff-facing dashboard (no auth gate for now) */}
      <Route path="/leads" component={LeadDashboard} />
      {/* Admin-only staff management */}
      <Route path="/staff" component={StaffManagement} />
      {/* Staff consultation guide */}
      <Route path="/guide" component={StaffGuide} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <CopyProtection />
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
