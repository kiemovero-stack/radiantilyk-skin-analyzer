/**
 * ClientHome — Revenue Engine Home Screen
 *
 * Sections (top → bottom):
 * 1. Personalized greeting + due-for-treatment nudge
 * 2. Next appointment / "Book Again" quick action
 * 3. AI-recommended treatments (based on last analysis)
 * 4. Rewards balance + tier progress
 * 5. Flash deals with countdown timer
 * 6. Spin-to-win button
 * 7. Quick actions grid
 */
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays, Gift, Camera, ShoppingBag, Sparkles, Clock,
  ChevronRight, Star, Zap, ArrowRight, Timer, Flame,
  MessageCircle, Wallet, Trophy, PartyPopper,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { clientPath } from "@/lib/clientPaths";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/YXDmLVYUnds4E9JxEbde2D/IMG_2517_3c23507d.PNG";

const C = {
  gold: "#B8964A",
  goldLight: "#C4A882",
  ivory: "#FAF7F2",
  charcoal: "#2C2C2C",
  charcoalLight: "#4A4A4A",
  rose: "#E8D5C4",
  success: "#22C55E",
  urgent: "#EF4444",
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

interface FlashDeal {
  id: number;
  title: string;
  description: string;
  discountPercent: number | null;
  discountAmount: number | null;
  originalPrice: number | null;
  endsAt: string;
  currentRedemptions: number;
  maxRedemptions: number | null;
}

interface NextAppointment {
  id: number;
  appointmentDate: string;
  startTime: string;
  staffName: string;
  service: string | null;
}

interface SkinSummary {
  score: number | null;
  topConditions: string[];
  recommendedTreatments: string[];
  lastAnalysisDate: string | null;
  daysSinceAnalysis: number | null;
}

// Spin-to-win wheel prizes
const WHEEL_PRIZES = [
  "50 Bonus Points", "10% Off Next Visit", "Free Lip Balm",
  "100 Bonus Points", "5% Off Products", "Free Consultation",
  "25 Bonus Points", "15% Off Facial",
];

export default function ClientHome() {
  const [, setLocation] = useLocation();
  const [clientName, setClientName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [rewardsPoints, setRewardsPoints] = useState(0);
  const [rewardsTier, setRewardsTier] = useState("Glow");
  const [nextAppt, setNextAppt] = useState<NextAppointment | null>(null);
  const [flashDeals, setFlashDeals] = useState<FlashDeal[]>([]);
  const [skinSummary, setSkinSummary] = useState<SkinSummary | null>(null);
  const [showSpinWheel, setShowSpinWheel] = useState(false);
  const [spinResult, setSpinResult] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("rka_rewards_email");
    const savedName = localStorage.getItem("rka_client_name");
    if (savedEmail) {
      setEmail(savedEmail);
      setClientName(savedName || "");
      setIsLoggedIn(true);
      loadHomeData(savedEmail);
    }
    loadFlashDeals();
  }, []);

  async function loadHomeData(memberEmail: string) {
    try {
      // Load rewards
      const rewardsRes = await fetch(`/api/rewards/member?email=${encodeURIComponent(memberEmail)}`);
      if (rewardsRes.ok) {
        const data = await rewardsRes.json();
        setRewardsPoints(data.points || 0);
        setRewardsTier(data.tier || "Glow");
      }

      // Load next appointment
      try {
        const apptRes = await fetch(`/api/booking/my-appointments?email=${encodeURIComponent(memberEmail)}`);
        if (apptRes.ok) {
          const data = await apptRes.json();
          if (data.upcoming && data.upcoming.length > 0) {
            setNextAppt(data.upcoming[0]);
          }
        }
      } catch {}

      // Load skin summary from latest analysis
      try {
        const skinRes = await fetch(`/api/client/analyses?email=${encodeURIComponent(memberEmail)}`);
        if (skinRes.ok) {
          const data = await skinRes.json();
          if (data.analyses && data.analyses.length > 0) {
            const latest = data.analyses[0];
            const daysSince = latest.createdAt
              ? Math.floor((Date.now() - new Date(latest.createdAt).getTime()) / (1000 * 60 * 60 * 24))
              : null;
            setSkinSummary({
              score: latest.skinHealthScore,
              topConditions: [],
              recommendedTreatments: [],
              lastAnalysisDate: latest.createdAt,
              daysSinceAnalysis: daysSince,
            });
          }
        }
      } catch {}
    } catch (err) {
      console.error("Failed to load home data:", err);
    }
  }

  async function loadFlashDeals() {
    try {
      const res = await fetch("/api/flash-deals/active");
      if (res.ok) {
        const data = await res.json();
        setFlashDeals(data.deals || []);
      }
    } catch {}
  }

  function handleSpin() {
    if (isSpinning) return;
    setIsSpinning(true);
    setSpinResult(null);
    setTimeout(() => {
      const prize = WHEEL_PRIZES[Math.floor(Math.random() * WHEEL_PRIZES.length)];
      setSpinResult(prize);
      setIsSpinning(false);
    }, 2500);
  }

  const firstName = clientName ? clientName.split(" ")[0] : "there";

  // Determine treatment nudge
  const treatmentNudge = skinSummary?.daysSinceAnalysis && skinSummary.daysSinceAnalysis > 60
    ? `It's been ${skinSummary.daysSinceAnalysis} days since your last check-in`
    : null;

  return (
    <div className="min-h-screen pb-24" style={{ background: C.ivory }}>
      {/* ── Header / Greeting ── */}
      <div
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${C.charcoal} 0%, ${C.charcoalLight} 100%)`,
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle at 50% 30%, ${C.gold}30 0%, transparent 50%)` }} />
        </div>

        <div className="relative px-5 pt-12 pb-6">
          <div className="flex items-center justify-between mb-4">
            <img src={LOGO_URL} alt="RKA" className="h-8 object-contain" />
            <button
              onClick={() => setLocation(clientPath("/profile"))}
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: C.gold + "20", border: `1px solid ${C.gold}30` }}
            >
              <span className="text-sm font-medium" style={{ color: C.gold }}>
                {firstName.charAt(0).toUpperCase()}
              </span>
            </button>
          </div>

          {isLoggedIn ? (
            <motion.div initial="hidden" animate="visible" variants={fadeUp}>
              <h1
                className="text-2xl mb-1"
                style={{ fontFamily: "'Cormorant Garamond', serif", color: "white", fontWeight: 400 }}
              >
                Hi {firstName} ✨
              </h1>
              {treatmentNudge ? (
                <p className="text-sm" style={{ color: C.gold }}>
                  {treatmentNudge}
                </p>
              ) : (
                <p className="text-sm text-white/50">Welcome back to Radiantilyk</p>
              )}
            </motion.div>
          ) : (
            <motion.div initial="hidden" animate="visible" variants={fadeUp}>
              <h1
                className="text-2xl mb-1"
                style={{ fontFamily: "'Cormorant Garamond', serif", color: "white", fontWeight: 400 }}
              >
                Welcome to Radiantilyk ✨
              </h1>
              <p className="text-sm text-white/50">Your personalized beauty hub</p>
              <Button
                onClick={() => setLocation(clientPath("/book"))}
                className="mt-3 text-sm font-medium tracking-wider"
                style={{ background: C.gold, color: "white" }}
              >
                Book Your First Visit
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      <div className="px-5 py-5 max-w-lg mx-auto space-y-5">
        {/* ── Next Appointment ── */}
        {nextAppt && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="p-4 rounded-2xl bg-white border"
            style={{ borderColor: C.gold + "20" }}
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: C.gold + "12" }}>
                <CalendarDays className="w-5 h-5" style={{ color: C.gold }} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium tracking-wider uppercase" style={{ color: C.gold }}>
                  Next Appointment
                </p>
                <p className="text-sm font-medium" style={{ color: C.charcoal }}>
                  {new Date(nextAppt.appointmentDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} at {nextAppt.startTime}
                </p>
                <p className="text-xs" style={{ color: C.charcoalLight + "80" }}>
                  with {nextAppt.staffName}{nextAppt.service ? ` — ${nextAppt.service}` : ""}
                </p>
              </div>
              <ChevronRight className="w-4 h-4" style={{ color: C.gold + "60" }} />
            </div>
          </motion.div>
        )}

        {/* ── Quick Rebook (if no upcoming appt) ── */}
        {!nextAppt && isLoggedIn && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            onClick={() => setLocation(clientPath("/book"))}
            className="p-4 rounded-2xl bg-white border cursor-pointer hover:shadow-md transition-shadow"
            style={{ borderColor: C.gold + "20" }}
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})` }}>
                <CalendarDays className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: C.charcoal }}>
                  Book Your Next Visit
                </p>
                <p className="text-xs" style={{ color: C.charcoalLight + "80" }}>
                  1-2 taps to schedule — quick and easy
                </p>
              </div>
              <ArrowRight className="w-4 h-4" style={{ color: C.gold }} />
            </div>
          </motion.div>
        )}

        {/* ── Skin Score Card ── */}
        {skinSummary && skinSummary.score && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="p-4 rounded-2xl bg-white border"
            style={{ borderColor: C.gold + "20" }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium tracking-wider uppercase" style={{ color: C.gold }}>
                Your Skin Score
              </p>
              <button
                onClick={() => setLocation(clientPath("/start"))}
                className="text-xs font-medium flex items-center gap-1"
                style={{ color: C.gold }}
              >
                Re-analyze <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  background: `conic-gradient(${C.gold} ${skinSummary.score}%, ${C.gold}15 ${skinSummary.score}%)`,
                }}
              >
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                  <span className="text-lg font-bold" style={{ color: C.charcoal }}>
                    {skinSummary.score}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: C.charcoal }}>
                  {skinSummary.score >= 80 ? "Excellent" : skinSummary.score >= 60 ? "Good" : skinSummary.score >= 40 ? "Fair" : "Needs Attention"}
                </p>
                <p className="text-xs" style={{ color: C.charcoalLight + "80" }}>
                  {skinSummary.daysSinceAnalysis !== null
                    ? `Analyzed ${skinSummary.daysSinceAnalysis} days ago`
                    : "Recent analysis"}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Rewards Balance ── */}
        {isLoggedIn && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            onClick={() => setLocation(clientPath("/rewards"))}
            className="p-4 rounded-2xl bg-white border cursor-pointer hover:shadow-md transition-shadow"
            style={{ borderColor: C.gold + "20" }}
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: C.gold + "12" }}>
                <Trophy className="w-5 h-5" style={{ color: C.gold }} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium" style={{ color: C.charcoal }}>
                    {rewardsPoints.toLocaleString()} Points
                  </p>
                  <span
                    className="text-[10px] font-medium tracking-wider uppercase px-2 py-0.5 rounded-full"
                    style={{ background: C.gold + "15", color: C.gold }}
                  >
                    {rewardsTier}
                  </span>
                </div>
                <p className="text-xs" style={{ color: C.charcoalLight + "80" }}>
                  Tap to view rewards and redeem
                </p>
              </div>
              <ChevronRight className="w-4 h-4" style={{ color: C.gold + "60" }} />
            </div>
          </motion.div>
        )}

        {/* ── Flash Deals ── */}
        {flashDeals.length > 0 && (
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <div className="flex items-center gap-2 mb-3">
              <Flame className="w-4 h-4" style={{ color: C.urgent }} />
              <p className="text-xs font-medium tracking-wider uppercase" style={{ color: C.urgent }}>
                Flash Deals
              </p>
            </div>
            <div className="space-y-3">
              {flashDeals.map((deal) => (
                <FlashDealCard key={deal.id} deal={deal} onBook={() => setLocation(clientPath("/book"))} />
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Quick Actions Grid ── */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <p className="text-xs font-medium tracking-wider uppercase mb-3" style={{ color: C.charcoalLight + "80" }}>
            Quick Actions
          </p>
          <div className="grid grid-cols-4 gap-3">
            {[
              { icon: Camera, label: "Analyze", path: "/start", color: "#8B5CF6" },
              { icon: CalendarDays, label: "Book", path: "/book", color: C.gold },
              { icon: ShoppingBag, label: "Shop", path: "/shop", color: "#EC4899" },
              { icon: MessageCircle, label: "Chat AI", path: "/chat", color: "#3B82F6" },
            ].map((action) => (
              <button
                key={action.label}
                onClick={() => setLocation(clientPath(action.path))}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white border hover:shadow-md transition-shadow"
                style={{ borderColor: C.gold + "12" }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: action.color + "12" }}
                >
                  <action.icon className="w-5 h-5" style={{ color: action.color }} />
                </div>
                <span className="text-[10px] font-medium" style={{ color: C.charcoal }}>
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── Spin to Win ── */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="p-4 rounded-2xl border overflow-hidden relative"
          style={{
            background: `linear-gradient(135deg, ${C.charcoal}, ${C.charcoalLight})`,
            borderColor: C.gold + "30",
          }}
        >
          <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
            <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle, ${C.gold} 0%, transparent 70%)` }} />
          </div>
          <div className="relative flex items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: C.gold + "20" }}>
              <PartyPopper className="w-6 h-6" style={{ color: C.gold }} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">Spin to Win!</p>
              <p className="text-xs text-white/50">Try your luck for rewards and discounts</p>
            </div>
            <Button
              onClick={() => setShowSpinWheel(true)}
              size="sm"
              className="text-xs font-medium"
              style={{ background: C.gold, color: "white" }}
            >
              Spin
            </Button>
          </div>
        </motion.div>

        {/* ── AI Concierge Teaser ── */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          onClick={() => setLocation(clientPath("/chat"))}
          className="p-4 rounded-2xl bg-white border cursor-pointer hover:shadow-md transition-shadow"
          style={{ borderColor: C.gold + "20" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "#3B82F612" }}>
              <MessageCircle className="w-5 h-5" style={{ color: "#3B82F6" }} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium" style={{ color: C.charcoal }}>
                Ask our AI Concierge
              </p>
              <p className="text-xs" style={{ color: C.charcoalLight + "80" }}>
                "What should I get for my jawline?"
              </p>
            </div>
            <ArrowRight className="w-4 h-4" style={{ color: "#3B82F6" }} />
          </div>
        </motion.div>

        {/* ── Urgency / Social Proof ── */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="flex items-center gap-2 px-4 py-3 rounded-xl"
          style={{ background: C.gold + "08", border: `1px solid ${C.gold}15` }}
        >
          <Clock className="w-4 h-4 flex-shrink-0" style={{ color: C.gold }} />
          <p className="text-xs" style={{ color: C.charcoalLight }}>
            <span className="font-medium">Only 3 spots left</span> this weekend — book now before they fill up
          </p>
        </motion.div>
      </div>

      {/* ── Spin Wheel Modal ── */}
      <AnimatePresence>
        {showSpinWheel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => { if (!isSpinning) setShowSpinWheel(false); }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 mx-5 max-w-sm w-full text-center"
            >
              <PartyPopper className="w-10 h-10 mx-auto mb-3" style={{ color: C.gold }} />
              <h3
                className="text-xl mb-2"
                style={{ fontFamily: "'Cormorant Garamond', serif", color: C.charcoal }}
              >
                Spin to Win!
              </h3>
              <p className="text-sm mb-6" style={{ color: C.charcoalLight + "80" }}>
                Tap the button to spin and win a prize
              </p>

              {/* Simplified visual wheel */}
              <div
                className="w-48 h-48 rounded-full mx-auto mb-6 flex items-center justify-center relative overflow-hidden"
                style={{
                  background: `conic-gradient(
                    ${C.gold} 0deg 45deg,
                    ${C.charcoal} 45deg 90deg,
                    ${C.gold}90 90deg 135deg,
                    ${C.charcoal}90 135deg 180deg,
                    ${C.gold} 180deg 225deg,
                    ${C.charcoal} 225deg 270deg,
                    ${C.gold}90 270deg 315deg,
                    ${C.charcoal}90 315deg 360deg
                  )`,
                  animation: isSpinning ? "spin 0.3s linear infinite" : "none",
                }}
              >
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg z-10">
                  <Sparkles className="w-6 h-6" style={{ color: C.gold }} />
                </div>
              </div>

              {spinResult ? (
                <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
                  <p className="text-lg font-bold mb-1" style={{ color: C.gold }}>
                    You won: {spinResult}!
                  </p>
                  <p className="text-xs mb-4" style={{ color: C.charcoalLight + "80" }}>
                    Book your next visit to redeem
                  </p>
                  <Button
                    onClick={() => {
                      setShowSpinWheel(false);
                      setLocation(clientPath("/book"));
                    }}
                    className="w-full"
                    style={{ background: C.gold, color: "white" }}
                  >
                    Book Now to Redeem
                  </Button>
                </motion.div>
              ) : (
                <Button
                  onClick={handleSpin}
                  disabled={isSpinning}
                  className="w-full text-base"
                  style={{ background: C.gold, color: "white" }}
                >
                  {isSpinning ? "Spinning..." : "Spin the Wheel!"}
                </Button>
              )}

              {!isSpinning && !spinResult && (
                <button
                  onClick={() => setShowSpinWheel(false)}
                  className="mt-3 text-xs"
                  style={{ color: C.charcoalLight + "60" }}
                >
                  Maybe later
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spin animation keyframes */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

/* ── Flash Deal Card ── */
function FlashDealCard({ deal, onBook }: { deal: FlashDeal; onBook: () => void }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    function update() {
      const end = new Date(deal.endsAt).getTime();
      const now = Date.now();
      const diff = end - now;
      if (diff <= 0) {
        setTimeLeft("Expired");
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${hours}h ${mins}m ${secs}s`);
    }
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [deal.endsAt]);

  const spotsLeft = deal.maxRedemptions ? deal.maxRedemptions - deal.currentRedemptions : null;

  return (
    <div
      className="p-4 rounded-2xl bg-white border cursor-pointer hover:shadow-md transition-shadow"
      style={{ borderColor: "#EF444430" }}
      onClick={onBook}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-sm font-semibold" style={{ color: C.charcoal }}>
            {deal.title}
          </p>
          {deal.description && (
            <p className="text-xs mt-0.5" style={{ color: C.charcoalLight + "80" }}>
              {deal.description}
            </p>
          )}
        </div>
        {deal.discountPercent && (
          <span
            className="text-xs font-bold px-2 py-1 rounded-lg"
            style={{ background: "#EF444415", color: "#EF4444" }}
          >
            {deal.discountPercent}% OFF
          </span>
        )}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Timer className="w-3.5 h-3.5" style={{ color: "#EF4444" }} />
          <span className="text-xs font-medium" style={{ color: "#EF4444" }}>
            {timeLeft}
          </span>
        </div>
        {spotsLeft !== null && spotsLeft <= 5 && (
          <span className="text-xs font-medium" style={{ color: "#EF4444" }}>
            Only {spotsLeft} left!
          </span>
        )}
      </div>
    </div>
  );
}
