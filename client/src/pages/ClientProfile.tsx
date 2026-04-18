/**
 * ClientProfile — Client account page.
 * Shows past analyses, rewards summary, financing links, and settings.
 */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User, FileText, Gift, CreditCard, Settings,
  ChevronRight, ExternalLink, LogOut, Star,
  Camera, History, Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { clientPath } from "@/lib/clientPaths";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663441068939/YXDmLVYUnds4E9JxEbde2D/IMG_2517_3c23507d.PNG";
const AESTHETIC_RECORD_URL = "https://rkaemr.click/portal";
const CHERRY_URL = "https://pay.withcherry.com/radiantilyk-aesthetic-llc";
const SHOP_URL = "https://rkaskin.co";

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
      // Load analyses
      const res = await fetch(`/api/client/analyses?email=${encodeURIComponent(memberEmail)}`);
      if (res.ok) {
        const data = await res.json();
        setAnalyses(data.analyses || []);
      }
      // Load rewards
      const rewardsRes = await fetch(`/api/rewards/member?email=${encodeURIComponent(memberEmail)}`);
      if (rewardsRes.ok) {
        const data = await rewardsRes.json();
        setRewardsPoints(data.points || 0);
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
    localStorage.removeItem("rka_rewards_email");
  }

  const menuItems = [
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
      icon: Gift,
      label: "Rewards Program",
      description: `${rewardsPoints.toLocaleString()} points`,
      action: () => setLocation(clientPath("/rewards")),
    },
    {
      icon: Camera,
      label: "New Skin Analysis",
      description: "Get your AI skin assessment",
      action: () => setLocation(clientPath("/start")),
    },
    {
      icon: CreditCard,
      label: "Cherry Financing",
      description: "Apply for 0% APR financing",
      href: CHERRY_URL,
    },
    {
      icon: History,
      label: "Patient Portal",
      description: "Aesthetic Record",
      href: AESTHETIC_RECORD_URL,
    },
    {
      icon: Star,
      label: "Shop Products",
      description: "Browse skincare at rkaskin.co",
      href: SHOP_URL,
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
                Sign in to view your reports and rewards
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

      {/* Menu Items */}
      <div className="px-5 py-6 max-w-lg mx-auto space-y-3">
        {isLoggedIn && (
          <>
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-3 gap-3 mb-6"
            >
              <div
                className="text-center p-3 rounded-xl bg-white border"
                style={{ borderColor: C.gold + "15" }}
              >
                <p
                  className="text-2xl font-light"
                  style={{ fontFamily: "'Cormorant Garamond', serif", color: C.gold }}
                >
                  {analyses.length}
                </p>
                <p className="text-[10px] tracking-wider uppercase" style={{ color: C.charcoalLight + "70" }}>
                  Analyses
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
                  {analyses.length > 0
                    ? analyses[0].skinHealthScore || "—"
                    : "—"}
                </p>
                <p className="text-[10px] tracking-wider uppercase" style={{ color: C.charcoalLight + "70" }}>
                  Skin Score
                </p>
              </div>
            </motion.div>

            {/* Menu */}
            {menuItems.map((item, i) => {
              const content = (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
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

            {/* Recent Analyses */}
            {analyses.length > 0 && (
              <div className="mt-6">
                <h3
                  className="text-lg mb-3"
                  style={{ fontFamily: "'Cormorant Garamond', serif", color: C.charcoal, fontWeight: 500 }}
                >
                  Recent Analyses
                </h3>
                <div className="space-y-2">
                  {analyses.slice(0, 3).map((analysis) => (
                    <div
                      key={analysis.id}
                      onClick={() => setLocation(clientPath(`/report/${analysis.id}`))}
                      className="flex items-center gap-3 p-3 rounded-lg bg-white border cursor-pointer hover:border-[#B8964A30] transition-colors"
                      style={{ borderColor: C.gold + "10" }}
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium"
                        style={{ background: C.gold + "15", color: C.gold }}
                      >
                        {analysis.skinHealthScore || "—"}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium" style={{ color: C.charcoal }}>
                          Skin Analysis #{analysis.id}
                        </p>
                        <p className="text-[10px]" style={{ color: C.charcoalLight + "60" }}>
                          {new Date(analysis.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4" style={{ color: C.gold + "40" }} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sign Out */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full p-4 mt-4 rounded-xl border hover:bg-red-50/50 transition-colors"
              style={{ borderColor: "#fee2e2" }}
            >
              <LogOut className="w-4 h-4 text-red-400" />
              <span className="text-sm text-red-400">Sign Out</span>
            </button>
          </>
        )}

        {/* Privacy note */}
        <div className="flex items-start gap-2 mt-6 px-2">
          <Shield className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: C.charcoalLight + "40" }} />
          <p className="text-[10px]" style={{ color: C.charcoalLight + "50" }}>
            Your data is protected and never shared with third parties.
            We comply with HIPAA privacy standards.
          </p>
        </div>
      </div>
    </div>
  );
}
