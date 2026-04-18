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
import StaffRewards from "./pages/StaffRewards";
import StaffAppointments from "./pages/StaffAppointments";
import ClientRewards from "./pages/ClientRewards";
import ClientBook from "./pages/ClientBook";
import ClientProfile from "./pages/ClientProfile";
import ClientHome from "./pages/ClientHome";
import ClientChat from "./pages/ClientChat";
import ClientShop from "./pages/ClientShop";
import MobileTabBar from "./components/MobileTabBar";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/analyze" component={Analyze} />
      <Route path="/report/:id" component={Report} />
      <Route path="/history" component={History} />
      <Route path="/compare" component={Compare} />
      {/* Public client-facing routes (no login required) */}
      <Route path="/client" component={ClientHome} />
      <Route path="/client/landing" component={ClientLanding} />
      <Route path="/client/start" component={ClientAnalyze} />
      <Route path="/client/report/:id" component={ClientReport} />
      <Route path="/client/rewards" component={ClientRewards} />
      <Route path="/client/book" component={ClientBook} />
      <Route path="/client/profile" component={ClientProfile} />
      <Route path="/client/chat" component={ClientChat} />
      <Route path="/client/shop" component={ClientShop} />
      <Route path="/client/home" component={ClientHome} />
      {/* Client app routes (standalone domain) */}
      <Route path="/home" component={ClientHome} />
      <Route path="/rewards" component={ClientRewards} />
      <Route path="/book" component={ClientBook} />
      <Route path="/profile" component={ClientProfile} />
      <Route path="/chat" component={ClientChat} />
      <Route path="/shop" component={ClientShop} />
      <Route path="/start" component={ClientAnalyze} />
      <Route path="/scar-consultation" component={ScarConsultation} />
      <Route path="/scar-treatment" component={ScarTreatment} />
      {/* Staff-facing dashboard (no auth gate for now) */}
      <Route path="/leads" component={LeadDashboard} />
      {/* Admin-only staff management */}
      <Route path="/staff" component={StaffManagement} />
      {/* Staff consultation guide */}
      <Route path="/guide" component={StaffGuide} />
      {/* Staff rewards & appointments management */}
      <Route path="/rewards-admin" component={StaffRewards} />
      <Route path="/appointments" component={StaffAppointments} />
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
          <MobileTabBar />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
