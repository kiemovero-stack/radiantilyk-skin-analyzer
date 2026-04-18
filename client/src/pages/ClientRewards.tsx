/**
 * ClientRewards — RepeatMD-style loyalty rewards program.
 *
 * Tiers: Glow (0-499), Radiant (500-1499), Luminous (1500-2999), Icon (3000+)
 * Earn: treatments, referrals, check-ins, product purchases, social shares, skin analysis
 * Redeem: discounts on treatments and products
 */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gift, Star, Crown, Sparkles, ChevronRight, Trophy,
  Share2, Users, ShoppingBag, Camera, CalendarCheck,
  ArrowRight, CheckCircle2, Lock, Gem,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/YXDmLVYUnds4E9JxEbde2D/IMG_2517_3c23507d.PNG";

const C = {
  gold: "#B8964A",
  goldLight: "#C4A882",
  ivory: "#FAF7F2",
  charcoal: "#2C2C2C",
  charcoalLight: "#4A4A4A",
};

/* ── Tier definitions ── */
const TIERS = [
  {
    name: "Glow",
    minPoints: 0,
    maxPoints: 499,
    icon: Star,
    color: "#C4A882",
    gradient: "from-[#C4A882] to-[#D4C4A8]",
    perks: ["5% off all treatments", "Birthday bonus (100 pts)", "Member-only promotions"],
  },
  {
    name: "Radiant",
    minPoints: 500,
    maxPoints: 1499,
    icon: Sparkles,
    color: "#B8964A",
    gradient: "from-[#B8964A] to-[#D4B86A]",
    perks: ["10% off all treatments", "Birthday bonus (250 pts)", "Priority booking", "Free product samples"],
  },
  {
    name: "Luminous",
    minPoints: 1500,
    maxPoints: 2999,
    icon: Crown,
    color: "#9B7A3A",
    gradient: "from-[#9B7A3A] to-[#B8964A]",
    perks: ["15% off all treatments", "Birthday bonus (500 pts)", "VIP booking priority", "Exclusive event invites", "Free skincare gift quarterly"],
  },
  {
    name: "Icon",
    minPoints: 3000,
    maxPoints: Infinity,
    icon: Gem,
    color: "#7A5F2A",
    gradient: "from-[#7A5F2A] to-[#9B7A3A]",
    perks: ["20% off all treatments", "Birthday bonus (1000 pts)", "Concierge booking", "Annual luxury gift box", "Complimentary monthly facial", "First access to new treatments"],
  },
];

/* ── Ways to earn ── */
const EARN_ACTIONS = [
  { icon: CalendarCheck, label: "Complete a Treatment", points: "1 pt per $1 spent", description: "Earn points on every treatment you book" },
  { icon: Camera, label: "Skin Analysis", points: "+50 pts", description: "Take your AI skin analysis" },
  { icon: Users, label: "Refer a Friend", points: "+500 pts", description: "When your friend completes their first treatment" },
  { icon: ShoppingBag, label: "Product Purchase", points: "1 pt per $1", description: "Shop skincare at rkaskin.co" },
  { icon: Share2, label: "Social Share", points: "+25 pts", description: "Share your results on social media" },
  { icon: Star, label: "Leave a Review", points: "+100 pts", description: "Post a Google or Yelp review" },
];

/* ── Redemption rewards ── */
const REWARDS = [
  { name: "$10 Off Treatment", points: 200, category: "Treatment" },
  { name: "$25 Off Treatment", points: 450, category: "Treatment" },
  { name: "$50 Off Treatment", points: 850, category: "Treatment" },
  { name: "$100 Off Treatment", points: 1600, category: "Treatment" },
  { name: "Free HydraFacial", points: 2500, category: "Treatment" },
  { name: "$15 Product Credit", points: 300, category: "Product" },
  { name: "$30 Product Credit", points: 550, category: "Product" },
  { name: "Free Lip Treatment", points: 400, category: "Product" },
  { name: "Luxury Gift Set", points: 3000, category: "Exclusive" },
  { name: "VIP Spa Day", points: 5000, category: "Exclusive" },
];

export default function ClientRewards() {
  const [email, setEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [memberData, setMemberData] = useState<{
    points: number;
    tier: string;
    history: { action: string; points: number; date: string }[];
  } | null>(null);
  const [activeTab, setActiveTab] = useState<"earn" | "redeem" | "tiers">("earn");
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is already logged in via localStorage
  useEffect(() => {
    const savedEmail = localStorage.getItem("rka_rewards_email");
    if (savedEmail) {
      setEmail(savedEmail);
      loadMemberData(savedEmail);
    }
  }, []);

  async function loadMemberData(memberEmail: string) {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/rewards/member?email=${encodeURIComponent(memberEmail)}`);
      if (res.ok) {
        const data = await res.json();
        setMemberData(data);
        setIsLoggedIn(true);
        localStorage.setItem("rka_rewards_email", memberEmail);
      } else if (res.status === 404) {
        // New member — auto-enroll
        const enrollRes = await fetch("/api/rewards/enroll", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: memberEmail }),
        });
        if (enrollRes.ok) {
          const data = await enrollRes.json();
          setMemberData(data);
          setIsLoggedIn(true);
          localStorage.setItem("rka_rewards_email", memberEmail);
        }
      }
    } catch (err) {
      console.error("Failed to load rewards:", err);
    } finally {
      setIsLoading(false);
    }
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) loadMemberData(email.trim().toLowerCase());
  }

  function handleLogout() {
    setIsLoggedIn(false);
    setMemberData(null);
    setEmail("");
    localStorage.removeItem("rka_rewards_email");
  }

  const currentPoints = memberData?.points ?? 0;
  const currentTier = TIERS.find(
    (t) => currentPoints >= t.minPoints && currentPoints <= t.maxPoints
  ) || TIERS[0];
  const nextTier = TIERS[TIERS.indexOf(currentTier) + 1];
  const progressToNext = nextTier
    ? ((currentPoints - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100
    : 100;

  return (
    <div
      className="min-h-screen pb-24"
      style={{ background: C.ivory, fontFamily: "'Inter', sans-serif" }}
    >
      {/* Header */}
      <div
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${C.charcoal} 0%, ${C.charcoalLight} 100%)`,
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 30% 50%, ${C.gold}40 0%, transparent 50%), radial-gradient(circle at 70% 80%, ${C.gold}20 0%, transparent 40%)`,
            }}
          />
        </div>

        <div className="relative px-5 pt-12 pb-8">
          {/* Logo and title */}
          <div className="flex items-center gap-3 mb-6">
            <img src={LOGO_URL} alt="RadiantilyK" className="w-10 h-10 rounded-full" />
            <div>
              <h1
                className="text-xl tracking-wider"
                style={{ fontFamily: "'Cormorant Garamond', serif", color: C.gold, fontWeight: 500 }}
              >
                REWARDS
              </h1>
              <p className="text-xs text-white/60 tracking-wide">RadiantilyK Aesthetic</p>
            </div>
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="ml-auto text-xs text-white/40 hover:text-white/70 transition-colors"
              >
                Sign Out
              </button>
            )}
          </div>

          {!isLoggedIn ? (
            /* ── Login/Enroll Form ── */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h2
                className="text-2xl mb-2"
                style={{ fontFamily: "'Cormorant Garamond', serif", color: "white", fontWeight: 400 }}
              >
                Join Our Rewards Program
              </h2>
              <p className="text-white/60 text-sm mb-6">
                Earn points on every visit. Unlock exclusive perks.
              </p>
              <form onSubmit={handleLogin} className="flex gap-2 max-w-sm mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 px-4 py-3 rounded-lg text-sm bg-white/10 text-white placeholder-white/40 border border-white/10 focus:border-[#B8964A] focus:outline-none transition-colors"
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3 rounded-lg text-sm font-medium tracking-wider uppercase"
                  style={{ background: C.gold, color: "white" }}
                >
                  {isLoading ? "..." : "Join"}
                </Button>
              </form>
            </motion.div>
          ) : (
            /* ── Points & Tier Display ── */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-center mb-4">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <currentTier.icon className="w-5 h-5" style={{ color: currentTier.color }} />
                  <span
                    className="text-sm font-medium tracking-widest uppercase"
                    style={{ color: currentTier.color }}
                  >
                    {currentTier.name} Member
                  </span>
                </div>
                <div
                  className="text-5xl font-light tracking-tight"
                  style={{ fontFamily: "'Cormorant Garamond', serif", color: "white" }}
                >
                  {currentPoints.toLocaleString()}
                </div>
                <p className="text-white/50 text-xs tracking-wider uppercase mt-1">Points Balance</p>
              </div>

              {/* Progress to next tier */}
              {nextTier && (
                <div className="max-w-xs mx-auto">
                  <div className="flex justify-between text-xs text-white/40 mb-1">
                    <span>{currentTier.name}</span>
                    <span>{nextTier.name}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${currentTier.color}, ${nextTier.color})` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(progressToNext, 100)}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                  <p className="text-center text-xs text-white/40 mt-1">
                    {nextTier.minPoints - currentPoints} pts to {nextTier.name}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Tab Selector */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b" style={{ borderColor: C.gold + "15" }}>
        <div className="flex max-w-lg mx-auto">
          {(["earn", "redeem", "tiers"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 py-3 text-xs font-medium tracking-widest uppercase transition-colors relative"
              style={{ color: activeTab === tab ? C.gold : C.charcoalLight + "80" }}
            >
              {tab === "earn" ? "Earn Points" : tab === "redeem" ? "Redeem" : "Tiers & Perks"}
              {activeTab === tab && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full"
                  style={{ background: C.gold }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-5 py-6 max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === "earn" && (
            <motion.div
              key="earn"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-3"
            >
              <h3
                className="text-lg mb-4"
                style={{ fontFamily: "'Cormorant Garamond', serif", color: C.charcoal, fontWeight: 500 }}
              >
                Ways to Earn
              </h3>
              {EARN_ACTIONS.map((action, i) => (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white border"
                  style={{ borderColor: C.gold + "15" }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: C.gold + "15" }}
                  >
                    <action.icon className="w-5 h-5" style={{ color: C.gold }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium" style={{ color: C.charcoal }}>
                      {action.label}
                    </p>
                    <p className="text-xs" style={{ color: C.charcoalLight + "90" }}>
                      {action.description}
                    </p>
                  </div>
                  <span
                    className="text-xs font-semibold tracking-wide whitespace-nowrap px-2 py-1 rounded-full"
                    style={{ background: C.gold + "15", color: C.gold }}
                  >
                    {action.points}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === "redeem" && (
            <motion.div
              key="redeem"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-3"
            >
              <h3
                className="text-lg mb-4"
                style={{ fontFamily: "'Cormorant Garamond', serif", color: C.charcoal, fontWeight: 500 }}
              >
                Redeem Your Points
              </h3>
              {REWARDS.map((reward, i) => {
                const canRedeem = isLoggedIn && currentPoints >= reward.points;
                return (
                  <motion.div
                    key={reward.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white border"
                    style={{
                      borderColor: canRedeem ? C.gold + "40" : C.gold + "10",
                      opacity: canRedeem ? 1 : 0.6,
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: canRedeem ? C.gold + "20" : "#f3f4f6" }}
                    >
                      {canRedeem ? (
                        <Gift className="w-5 h-5" style={{ color: C.gold }} />
                      ) : (
                        <Lock className="w-5 h-5 text-gray-300" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium" style={{ color: C.charcoal }}>
                        {reward.name}
                      </p>
                      <p className="text-xs" style={{ color: C.charcoalLight + "70" }}>
                        {reward.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className="text-xs font-semibold"
                        style={{ color: canRedeem ? C.gold : "#9CA3AF" }}
                      >
                        {reward.points.toLocaleString()} pts
                      </span>
                      {canRedeem && (
                        <button
                          className="block text-[10px] font-medium tracking-wider uppercase mt-0.5 hover:underline"
                          style={{ color: C.gold }}
                          onClick={() => {
                            // TODO: implement redemption API
                            alert(`Redeeming: ${reward.name}\nPlease show this to staff at your next visit.`);
                          }}
                        >
                          Redeem
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {activeTab === "tiers" && (
            <motion.div
              key="tiers"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <h3
                className="text-lg mb-4"
                style={{ fontFamily: "'Cormorant Garamond', serif", color: C.charcoal, fontWeight: 500 }}
              >
                Membership Tiers
              </h3>
              {TIERS.map((tier, i) => {
                const isCurrent = currentTier.name === tier.name && isLoggedIn;
                return (
                  <motion.div
                    key={tier.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="rounded-xl overflow-hidden border"
                    style={{
                      borderColor: isCurrent ? tier.color + "60" : C.gold + "15",
                      background: isCurrent ? tier.color + "08" : "white",
                    }}
                  >
                    <div className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ background: `linear-gradient(135deg, ${tier.color}30, ${tier.color}10)` }}
                        >
                          <tier.icon className="w-5 h-5" style={{ color: tier.color }} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4
                              className="text-base font-medium"
                              style={{ fontFamily: "'Cormorant Garamond', serif", color: C.charcoal }}
                            >
                              {tier.name}
                            </h4>
                            {isCurrent && (
                              <span
                                className="text-[10px] font-medium tracking-wider uppercase px-2 py-0.5 rounded-full"
                                style={{ background: tier.color + "20", color: tier.color }}
                              >
                                Current
                              </span>
                            )}
                          </div>
                          <p className="text-xs" style={{ color: C.charcoalLight + "80" }}>
                            {tier.maxPoints === Infinity
                              ? `${tier.minPoints.toLocaleString()}+ points`
                              : `${tier.minPoints.toLocaleString()} – ${tier.maxPoints.toLocaleString()} points`}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-1.5 pl-1">
                        {tier.perks.map((perk) => (
                          <div key={perk} className="flex items-start gap-2">
                            <CheckCircle2
                              className="w-3.5 h-3.5 mt-0.5 flex-shrink-0"
                              style={{ color: tier.color }}
                            />
                            <span className="text-xs" style={{ color: C.charcoalLight }}>
                              {perk}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
