/**
 * ClientProfile — Client account & profile hub.
 * Shows wallet balance, rewards, past analyses, quick links to all features.
 */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User, FileText, Gift, CreditCard, Settings,
  ChevronRight, ExternalLink, LogOut, Star,
  Camera, Wallet, MessageCircle, ShoppingBag,
  CalendarDays, Shield, Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { clientPath } from "@/lib/clientPaths";

const CHERRY_URL = "https://pay.withcherry.com/radiantilyk-aesthetic-llc";

const C = {
  gold: "#B8964A",
  goldLight: "#C4A882",
  ivory: "#FAF7F2",
  charcoal: "#2C2C2C",
  charcoalLight: "#4A4A4A",
};

interface AnalysisSummary {
  id: number;
  skinHealthScore: number;
  createdAt: string;
  status: string;
}

export default function ClientProfile() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [analyses, setAnalyses] = useState<AnalysisSummary[]>([]);
  const [rewardsPoints, setRewardsPoints] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("rka_rewards_email");
    if (savedEmail) {
      setEmail(savedEmail);
      setIsLoggedIn(true);
      loadProfile(savedEmail);
    }
  }, []);

  async function loadProfile(memberEmail: string) {
    setIsLoading(true);
    try {
      const [analysesRes, rewardsRes, walletRes] = await Promise.allSettled([
        fetch(`/api/client/analyses?email=${encodeURIComponent(memberEmail)}`),
        fetch(`/api/rewards/member?email=${encodeURIComponent(memberEmail)}`),
        fetch(`/api/wallet/balance?userId=${encodeURIComponent(memberEmail)}`),
      ]);

      if (analysesRes.status === "fulfilled" && analysesRes.value.ok) {
        const data = await analysesRes.value.json();
        setAnalyses(data.analyses || []);
      }
      if (rewardsRes.status === "fulfilled" && rewardsRes.value.ok) {
        const data = await rewardsRes.value.json();
        setRewardsPoints(data.points || 0);
      }
      if (walletRes.status === "fulfilled" && walletRes.value.ok) {
        const data = await walletRes.value.json();
        setWalletBalance(data.balance || 0);
      }
    } catch (err) {
      console.error("Failed to load profile:", err);
    } finally {
      setIsLoading(false);
    }
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) {
      const normalizedEmail = email.trim().toLowerCase();
      localStorage.setItem("rka_rewards_email", normalizedEmail);
      setIsLoggedIn(true);
      loadProfile(normalizedEmail);
    }
  }

  function handleLogout() {
    setIsLoggedIn(false);
    setEmail("");
    setAnalyses([]);
    setRewardsPoints(0);
    setWalletBalance(0);
    localStorage.removeItem("rka_rewards_email");
  }

  const quickActions = [
    {
      icon: CalendarDays,
      label: "Book",
      action: () => setLocation(clientPath("/book")),
    },
    {
      icon: MessageCircle,
      label: "AI Chat",
      action: () => setLocation(clientPath("/chat")),
    },
    {
      icon: ShoppingBag,
      label: "Shop",
      action: () => setLocation(clientPath("/shop")),
    },
    {
      icon: Camera,
      label: "Analyze",
      action: () => setLocation(clientPath("/start")),
    },
  ];

  const menuItems = [
    {
      icon: Wallet,
      label: "My Wallet",
      description: `$${walletBalance.toFixed(2)} balance`,
      badge: walletBalance > 0 ? `$${walletBalance.toFixed(0)}` : undefined,
      action: () => {
        // Could navigate to wallet detail page
      },
    },
    {
      icon: Gift,
      label: "Rewards Program",
      description: `${rewardsPoints.toLocaleString()} points`,
      action: () => setLocation(clientPath("/rewards")),
    },
    {
      icon: FileText,
      label: "My Skin Reports",
      description: `${analyses.length} analysis${analyses.length !== 1 ? "es" : ""}`,
      action: () => {
        if (analyses.length > 0) {
          setLocation(clientPath(`/report/${analyses[0].id}`));
        }
      },
    },
    {
      icon: CreditCard,
      label: "Cherry Financing",
      description: "Apply for 0% APR financing",
      href: CHERRY_URL,
    },
    {
      icon: Shield,
      label: "Privacy & Security",
      description: "HIPAA compliant • PCI secure",
    },
  ];

  return (
    <div className="min-h-screen pb-24" style={{ background: C.ivory }}>
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
              backgroundImage: `radial-gradient(circle at 50% 30%, ${C.gold}30 0%, transparent 50%)`,
            }}
          />
        </div>

        <div className="relative px-5 pt-12 pb-8 text-center">
          <div
            className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center border-2"
            style={{ borderColor: C.gold + "40", background: C.gold + "15" }}
          >
            <User className="w-7 h-7" style={{ color: C.gold }} />
          </div>

          {!isLoggedIn ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1
                className="text-2xl mb-2"
                style={{ fontFamily: "'Cormorant Garamond', serif", color: "white", fontWeight: 400 }}
              >
                Your Account
              </h1>
              <p className="text-white/60 text-sm mb-5">
                Sign in to view your wallet, reports, and rewards
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
                  {isLoading ? "..." : "Sign In"}
                </Button>
              </form>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1
                className="text-xl mb-1"
                style={{ fontFamily: "'Cormorant Garamond', serif", color: "white", fontWeight: 400 }}
              >
                Welcome Back
              </h1>
              <p className="text-white/50 text-sm">{email}</p>
            </motion.div>
          )}
        </div>
      </div>

      {isLoggedIn && (
        <div className="px-5 py-6 max-w-lg mx-auto space-y-5">
          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-3 gap-3"
          >
            <div
              className="text-center p-3 rounded-xl bg-white border"
              style={{ borderColor: C.gold + "15" }}
            >
              <p
                className="text-2xl font-light"
                style={{ fontFamily: "'Cormorant Garamond', serif", color: C.gold }}
              >
                ${walletBalance.toFixed(0)}
              </p>
              <p className="text-[10px] tracking-wider uppercase" style={{ color: C.charcoalLight + "70" }}>
                Wallet
              </p>
            </div>
            <div
              className="text-center p-3 rounded-xl bg-white border"
              style={{ borderColor: C.gold + "15" }}
            >
              <p
                className="text-2xl font-light"
                style={{ fontFamily: "'Cormorant Garamond', serif", color: C.gold }}
              >
                {rewardsPoints.toLocaleString()}
              </p>
              <p className="text-[10px] tracking-wider uppercase" style={{ color: C.charcoalLight + "70" }}>
                Points
              </p>
            </div>
            <div
              className="text-center p-3 rounded-xl bg-white border"
              style={{ borderColor: C.gold + "15" }}
            >
              <p
                className="text-2xl font-light"
                style={{ fontFamily: "'Cormorant Garamond', serif", color: C.gold }}
              >
                {analyses.length > 0 ? analyses[0].skinHealthScore || "—" : "—"}
              </p>
              <p className="text-[10px] tracking-wider uppercase" style={{ color: C.charcoalLight + "70" }}>
                Skin Score
              </p>
            </div>
          </motion.div>

          {/* Wallet Top-Up Banner */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-4 rounded-xl border"
            style={{
              background: `linear-gradient(135deg, ${C.gold}08 0%, ${C.gold}15 100%)`,
              borderColor: C.gold + "25",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: C.charcoal }}>
                  Add funds, get bonus
                </p>
                <p className="text-xs mt-0.5" style={{ color: C.charcoalLight + "80" }}>
                  Add $1,000 → Get $1,100 in credits
                </p>
              </div>
              <Button
                size="sm"
                className="rounded-full px-4 text-xs"
                style={{ background: C.gold, color: "white" }}
                onClick={() => {
                  // Trigger wallet add funds
                  fetch("/api/wallet/add-funds", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ amount: 500, userId: email }),
                  })
                    .then((r) => r.json())
                    .then((data) => {
                      if (data.checkoutUrl) {
                        window.open(data.checkoutUrl, "_blank");
                      }
                    })
                    .catch(console.error);
                }}
              >
                <Plus className="w-3 h-3 mr-1" /> Add Funds
              </Button>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="grid grid-cols-4 gap-3"
          >
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={action.action}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white border hover:border-[#B8964A30] transition-colors"
                style={{ borderColor: C.gold + "12" }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: C.gold + "12" }}
                >
                  <action.icon className="w-5 h-5" style={{ color: C.gold }} />
                </div>
                <span className="text-[10px] font-medium tracking-wider" style={{ color: C.charcoal }}>
                  {action.label}
                </span>
              </button>
            ))}
          </motion.div>

          {/* Menu Items */}
          <div className="space-y-2">
            {menuItems.map((item, i) => {
              const content = (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white border cursor-pointer hover:border-[#B8964A30] transition-colors"
                  style={{ borderColor: C.gold + "12" }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: C.gold + "12" }}
                  >
                    <item.icon className="w-5 h-5" style={{ color: C.gold }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium" style={{ color: C.charcoal }}>
                      {item.label}
                    </p>
                    <p className="text-xs" style={{ color: C.charcoalLight + "70" }}>
                      {item.description}
                    </p>
                  </div>
                  {item.href ? (
                    <ExternalLink className="w-4 h-4" style={{ color: C.gold + "60" }} />
                  ) : (
                    <ChevronRight className="w-4 h-4" style={{ color: C.gold + "60" }} />
                  )}
                </motion.div>
              );

              if (item.href) {
                return (
                  <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer">
                    {content}
                  </a>
                );
              }
              return (
                <div key={item.label} onClick={item.action}>
                  {content}
                </div>
              );
            })}
          </div>

          {/* Sign Out */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="pt-4"
          >
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 mx-auto text-sm"
              style={{ color: C.charcoalLight + "60" }}
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </motion.div>

          {/* Compliance Footer */}
          <div className="text-center pt-2 pb-4">
            <p className="text-[10px]" style={{ color: C.charcoalLight + "40" }}>
              HIPAA Compliant • PCI DSS Secure • 256-bit Encryption
            </p>
            <p className="text-[10px] mt-1" style={{ color: C.charcoalLight + "30" }}>
              RadiantilyK Aesthetic © 2025
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
