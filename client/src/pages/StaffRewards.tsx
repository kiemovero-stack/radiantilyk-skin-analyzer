/**
 * StaffRewards — Staff-facing rewards management page.
 * View all members, search, award/adjust points, view history.
 */
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gift, Search, Plus, Minus, History, Users, Crown,
  ChevronRight, RefreshCw, X, ArrowLeft, Star,
} from "lucide-react";
import { useLocation } from "wouter";

interface Member {
  id: number;
  email: string;
  name: string | null;
  points: number;
  lifetimePoints: number;
  tier: string;
  createdAt: string;
}

interface Transaction {
  action: string;
  points: number;
  type: string;
  description: string;
  date: string;
}

const TIER_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Glow: { bg: "#FFF7ED", text: "#C2410C", border: "#FDBA74" },
  Radiant: { bg: "#F0F9FF", text: "#0369A1", border: "#7DD3FC" },
  Luminous: { bg: "#FEFCE8", text: "#A16207", border: "#FDE047" },
  Icon: { bg: "#FDF2F8", text: "#BE185D", border: "#F9A8D4" },
};

export default function StaffRewards() {
  const [, setLocation] = useLocation();
  const [members, setMembers] = useState<Member[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [memberHistory, setMemberHistory] = useState<Transaction[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [showAwardModal, setShowAwardModal] = useState(false);
  const [awardEmail, setAwardEmail] = useState("");
  const [awardPoints, setAwardPoints] = useState("");
  const [awardAction, setAwardAction] = useState("Staff Award");
  const [awardDescription, setAwardDescription] = useState("");
  const [awardLoading, setAwardLoading] = useState(false);
  const [awardError, setAwardError] = useState("");
  const [awardSuccess, setAwardSuccess] = useState("");

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: "25" });
      if (search) params.set("search", search);
      const res = await fetch(`/api/rewards/admin/members?${params}`);
      const data = await res.json();
      setMembers(data.members || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch {
      console.error("Failed to fetch members");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchMembers(); }, [fetchMembers]);

  const fetchMemberHistory = async (email: string) => {
    setHistoryLoading(true);
    try {
      const res = await fetch(`/api/rewards/admin/member/${encodeURIComponent(email)}/history`);
      const data = await res.json();
      setMemberHistory(data.history || []);
    } catch {
      console.error("Failed to fetch history");
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleAward = async () => {
    setAwardError("");
    setAwardSuccess("");
    if (!awardEmail || !awardPoints) {
      setAwardError("Email and points are required");
      return;
    }
    setAwardLoading(true);
    try {
      const res = await fetch("/api/rewards/admin/award", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: awardEmail,
          points: parseInt(awardPoints),
          action: awardAction,
          description: awardDescription,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAwardError(data.error || "Failed to award points");
      } else {
        setAwardSuccess(`${parseInt(awardPoints) > 0 ? "Awarded" : "Deducted"} ${Math.abs(parseInt(awardPoints))} points to ${data.name || data.email}. New balance: ${data.points}`);
        setAwardEmail("");
        setAwardPoints("");
        setAwardAction("Staff Award");
        setAwardDescription("");
        fetchMembers();
      }
    } catch {
      setAwardError("Network error");
    } finally {
      setAwardLoading(false);
    }
  };

  const tierColor = (tier: string) => TIER_COLORS[tier] || TIER_COLORS.Glow;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setLocation("/")} className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <Gift className="w-6 h-6 text-amber-600" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Rewards Management</h1>
              <p className="text-sm text-gray-500">{total} members enrolled</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAwardModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Award Points
            </button>
            <button
              onClick={fetchMembers}
              className="p-2 hover:bg-gray-100 rounded-lg"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-sm"
          />
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {["Glow", "Radiant", "Luminous", "Icon"].map((tier) => {
            const count = members.filter((m) => m.tier === tier).length;
            const tc = tierColor(tier);
            return (
              <div key={tier} className="bg-white rounded-xl p-4 border" style={{ borderColor: tc.border + "60" }}>
                <div className="flex items-center gap-2 mb-1">
                  <Crown className="w-4 h-4" style={{ color: tc.text }} />
                  <span className="text-sm font-medium" style={{ color: tc.text }}>{tier}</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{count}</p>
              </div>
            );
          })}
        </div>

        {/* Members List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="w-6 h-6 text-gray-400 animate-spin" />
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No members found</p>
            <p className="text-sm text-gray-400 mt-1">Members enroll through the client rewards page</p>
          </div>
        ) : (
          <div className="space-y-2">
            {members.map((member) => {
              const tc = tierColor(member.tier);
              return (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl border border-gray-200 p-4 hover:border-amber-300 transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedMember(member);
                    fetchMemberHistory(member.email);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{ background: tc.bg, color: tc.text, border: `2px solid ${tc.border}` }}
                      >
                        {(member.name || member.email).charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{member.name || "—"}</p>
                        <p className="text-sm text-gray-500">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{member.points.toLocaleString()} pts</p>
                        <div className="flex items-center gap-1">
                          <span
                            className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{ background: tc.bg, color: tc.text, border: `1px solid ${tc.border}` }}
                          >
                            {member.tier}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-300" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-3 py-2 text-sm bg-white border rounded-lg disabled:opacity-50 hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-3 py-2 text-sm bg-white border rounded-lg disabled:opacity-50 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Member Detail Drawer */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex justify-end"
            onClick={() => setSelectedMember(null)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-md bg-white h-full overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between z-10">
                <h2 className="text-lg font-semibold">Member Details</h2>
                <button onClick={() => setSelectedMember(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 space-y-6">
                {/* Member Info */}
                <div className="text-center">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3"
                    style={{
                      background: tierColor(selectedMember.tier).bg,
                      color: tierColor(selectedMember.tier).text,
                      border: `3px solid ${tierColor(selectedMember.tier).border}`,
                    }}
                  >
                    {(selectedMember.name || selectedMember.email).charAt(0).toUpperCase()}
                  </div>
                  <h3 className="text-lg font-semibold">{selectedMember.name || "—"}</h3>
                  <p className="text-sm text-gray-500">{selectedMember.email}</p>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <span
                      className="text-xs px-3 py-1 rounded-full font-medium"
                      style={{
                        background: tierColor(selectedMember.tier).bg,
                        color: tierColor(selectedMember.tier).text,
                        border: `1px solid ${tierColor(selectedMember.tier).border}`,
                      }}
                    >
                      {selectedMember.tier}
                    </span>
                  </div>
                </div>

                {/* Points Summary */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-amber-50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-amber-700">{selectedMember.points.toLocaleString()}</p>
                    <p className="text-xs text-amber-600 mt-1">Available Points</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-purple-700">{selectedMember.lifetimePoints.toLocaleString()}</p>
                    <p className="text-xs text-purple-600 mt-1">Lifetime Points</p>
                  </div>
                </div>

                {/* Quick Award */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Quick Award / Adjust</h4>
                  <div className="flex gap-2">
                    {[50, 100, 250, 500].map((pts) => (
                      <button
                        key={pts}
                        onClick={async () => {
                          await fetch("/api/rewards/admin/award", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              email: selectedMember.email,
                              points: pts,
                              action: "Staff Quick Award",
                              description: `+${pts} points awarded by staff`,
                            }),
                          });
                          fetchMembers();
                          fetchMemberHistory(selectedMember.email);
                          setSelectedMember({ ...selectedMember, points: selectedMember.points + pts });
                        }}
                        className="flex-1 py-2 text-xs font-medium bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                      >
                        +{pts}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-2">
                    {[-50, -100, -250].map((pts) => (
                      <button
                        key={pts}
                        onClick={async () => {
                          if (selectedMember.points < Math.abs(pts)) return;
                          await fetch("/api/rewards/admin/award", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              email: selectedMember.email,
                              points: pts,
                              action: "Staff Adjustment",
                              description: `${pts} points adjusted by staff`,
                            }),
                          });
                          fetchMembers();
                          fetchMemberHistory(selectedMember.email);
                          setSelectedMember({ ...selectedMember, points: selectedMember.points + pts });
                        }}
                        className="flex-1 py-2 text-xs font-medium bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
                        disabled={selectedMember.points < Math.abs(pts)}
                      >
                        {pts}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Transaction History */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <History className="w-4 h-4" />
                    Transaction History
                  </h4>
                  {historyLoading ? (
                    <div className="flex justify-center py-8">
                      <RefreshCw className="w-5 h-5 text-gray-400 animate-spin" />
                    </div>
                  ) : memberHistory.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-4">No transactions yet</p>
                  ) : (
                    <div className="space-y-2">
                      {memberHistory.map((tx, i) => (
                        <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{tx.action}</p>
                            <p className="text-xs text-gray-500">{tx.description}</p>
                            <p className="text-xs text-gray-400">{new Date(tx.date).toLocaleDateString()}</p>
                          </div>
                          <span className={`text-sm font-semibold ${tx.points > 0 ? "text-green-600" : "text-red-600"}`}>
                            {tx.points > 0 ? "+" : ""}{tx.points}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <p className="text-xs text-gray-400 text-center">
                  Member since {new Date(selectedMember.createdAt).toLocaleDateString()}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Award Points Modal */}
      <AnimatePresence>
        {showAwardModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAwardModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Award / Adjust Points</h3>
                <button onClick={() => setShowAwardModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client Email</label>
                  <input
                    type="email"
                    value={awardEmail}
                    onChange={(e) => setAwardEmail(e.target.value)}
                    placeholder="client@example.com"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/30 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Points (negative to deduct)</label>
                  <input
                    type="number"
                    value={awardPoints}
                    onChange={(e) => setAwardPoints(e.target.value)}
                    placeholder="100"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/30 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                  <select
                    value={awardAction}
                    onChange={(e) => setAwardAction(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/30 text-sm"
                  >
                    <option value="Staff Award">Staff Award</option>
                    <option value="Treatment Completed">Treatment Completed</option>
                    <option value="Product Purchase">Product Purchase</option>
                    <option value="Referral Bonus">Referral Bonus</option>
                    <option value="Birthday Bonus">Birthday Bonus</option>
                    <option value="Loyalty Bonus">Loyalty Bonus</option>
                    <option value="Promotion">Promotion</option>
                    <option value="Correction">Correction / Adjustment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Note (optional)</label>
                  <input
                    type="text"
                    value={awardDescription}
                    onChange={(e) => setAwardDescription(e.target.value)}
                    placeholder="e.g., Botox treatment 40 units"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/30 text-sm"
                  />
                </div>

                {awardError && <p className="text-sm text-red-600 bg-red-50 p-2 rounded-lg">{awardError}</p>}
                {awardSuccess && <p className="text-sm text-green-600 bg-green-50 p-2 rounded-lg">{awardSuccess}</p>}

                <button
                  onClick={handleAward}
                  disabled={awardLoading}
                  className="w-full py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors disabled:opacity-50"
                >
                  {awardLoading ? "Processing..." : "Submit"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
