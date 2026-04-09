/**
 * Staff Management Page
 *
 * Admin-only page for managing team members. Allows inviting new staff,
 * changing roles, and removing members. Shows pending invitations vs active users.
 */
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Users,
  UserPlus,
  Shield,
  ShieldCheck,
  UserX,
  Mail,
  Clock,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  Trash2,
  ChevronDown,
  RefreshCw,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Types ─── */

interface StaffMember {
  id: number;
  name: string | null;
  email: string | null;
  role: "user" | "admin" | "staff";
  loginMethod: string | null;
  isPending: boolean;
  createdAt: string;
  lastSignedIn: string;
}

/* ─── Animation ─── */

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.06 } },
};

/* ─── Role Badge ─── */

function RoleBadge({ role }: { role: string }) {
  const config = {
    admin: { label: "Admin", bg: "bg-purple-50 border-purple-200", text: "text-purple-700", icon: ShieldCheck },
    staff: { label: "Staff", bg: "bg-blue-50 border-blue-200", text: "text-blue-700", icon: Shield },
    user: { label: "User", bg: "bg-gray-50 border-gray-200", text: "text-gray-600", icon: Users },
  }[role] || { label: role, bg: "bg-gray-50 border-gray-200", text: "text-gray-600", icon: Users };

  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border",
        config.bg,
        config.text
      )}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
}

/* ─── Status Badge ─── */

function StatusBadge({ isPending }: { isPending: boolean }) {
  return isPending ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-600 border border-amber-200">
      <Clock className="w-2.5 h-2.5" />
      Pending Invite
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-50 text-green-600 border border-green-200">
      <CheckCircle2 className="w-2.5 h-2.5" />
      Active
    </span>
  );
}

/* ─── Invite Modal ─── */

function InviteModal({
  open,
  onClose,
  onInvite,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  onInvite: (name: string, email: string, role: "staff" | "admin") => void;
  loading: boolean;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"staff" | "admin">("staff");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim()) {
      onInvite(name.trim(), email.trim(), role);
    }
  };

  useEffect(() => {
    if (!open) {
      setName("");
      setEmail("");
      setRole("staff");
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Invite Team Member</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jane Smith"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. jane@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setRole("staff")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all",
                  role === "staff"
                    ? "bg-blue-50 border-blue-300 text-blue-700 ring-2 ring-blue-200"
                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                )}
              >
                <Shield className="w-4 h-4" />
                Staff
              </button>
              <button
                type="button"
                onClick={() => setRole("admin")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all",
                  role === "admin"
                    ? "bg-purple-50 border-purple-300 text-purple-700 ring-2 ring-purple-200"
                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                )}
              >
                <ShieldCheck className="w-4 h-4" />
                Admin
              </button>
            </div>
            <p className="mt-1.5 text-xs text-gray-500">
              {role === "staff"
                ? "Staff can view analyses, leads, and contact clients."
                : "Admins can manage staff, change roles, and access all features."}
            </p>
          </div>

          <div className="pt-2 flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-xl"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              disabled={loading || !name.trim() || !email.trim()}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <UserPlus className="w-4 h-4 mr-2" />
              )}
              Send Invite
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

/* ─── Confirm Modal ─── */

function ConfirmModal({
  open,
  title,
  message,
  confirmLabel,
  confirmVariant = "danger",
  onConfirm,
  onCancel,
  loading,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  confirmVariant?: "danger" | "primary";
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden"
      >
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                confirmVariant === "danger" ? "bg-red-50" : "bg-blue-50"
              )}
            >
              <AlertTriangle
                className={cn("w-5 h-5", confirmVariant === "danger" ? "text-red-500" : "text-blue-500")}
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <p className="text-sm text-gray-600">{message}</p>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={onCancel} className="flex-1 rounded-xl" disabled={loading}>
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              className={cn(
                "flex-1 rounded-xl text-white",
                confirmVariant === "danger"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-600 hover:bg-blue-700"
              )}
              disabled={loading}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              {confirmLabel}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Staff Card ─── */

function StaffCard({
  member,
  isCurrentUser,
  onChangeRole,
  onRemove,
}: {
  member: StaffMember;
  isCurrentUser: boolean;
  onChangeRole: (id: number, newRole: "user" | "staff" | "admin") => void;
  onRemove: (id: number) => void;
}) {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const createdDate = new Date(member.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const lastActive = new Date(member.lastSignedIn).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <motion.div
      variants={fadeUp}
      className={cn(
        "relative bg-white rounded-xl border p-4 transition-all hover:shadow-md",
        isCurrentUser && "ring-2 ring-purple-200 border-purple-200",
        member.isPending && "border-dashed border-amber-300 bg-amber-50/30"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-gray-900 truncate">
              {member.name || "Unnamed"}
            </h3>
            {isCurrentUser && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-600 font-medium">
                You
              </span>
            )}
            <StatusBadge isPending={member.isPending} />
          </div>

          <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500">
            <Mail className="w-3 h-3" />
            <span className="truncate">{member.email || "No email"}</span>
          </div>

          <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-400">
            <span>Joined {createdDate}</span>
            {!member.isPending && <span>Last active {lastActive}</span>}
            {member.loginMethod && (
              <span className="capitalize">{member.loginMethod === "invited" ? "Invited" : member.loginMethod}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Role Badge + Dropdown */}
          <div className="relative">
            <button
              onClick={() => !isCurrentUser && setShowRoleMenu(!showRoleMenu)}
              disabled={isCurrentUser}
              className={cn(
                "flex items-center gap-1 transition-all",
                !isCurrentUser && "cursor-pointer hover:opacity-80"
              )}
            >
              <RoleBadge role={member.role} />
              {!isCurrentUser && <ChevronDown className="w-3 h-3 text-gray-400" />}
            </button>

            {showRoleMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowRoleMenu(false)} />
                <div className="absolute right-0 top-full mt-1 z-50 bg-white rounded-xl shadow-lg border py-1 min-w-[140px]">
                  {(["admin", "staff", "user"] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        onChangeRole(member.id, r);
                        setShowRoleMenu(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 transition-colors",
                        member.role === r && "bg-gray-50 font-medium"
                      )}
                    >
                      <RoleBadge role={r} />
                      {member.role === r && <CheckCircle2 className="w-3 h-3 text-green-500 ml-auto" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Remove Button */}
          {!isCurrentUser && (
            <button
              onClick={() => onRemove(member.id)}
              title={member.isPending ? "Delete invitation" : "Remove member"}
              className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-100 border border-red-200 transition-colors"
            >
              {member.isPending ? <Trash2 className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main Page ─── */

export default function StaffManagement() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInvite, setShowInvite] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: "remove" | "role";
    id: number;
    name: string;
    role?: string;
  } | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Get current user ID from the page context
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const fetchStaff = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/staff");
      if (!res.ok) {
        if (res.status === 403) {
          setError("Admin access required. Only administrators can manage staff.");
          return;
        }
        throw new Error("Failed to fetch staff");
      }
      const data = await res.json();
      setStaff(data.staff);
    } catch (err) {
      setError("Failed to load staff members. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch current user
  useEffect(() => {
    fetch("/api/trpc/getUser")
      .then((r) => r.json())
      .then((data) => {
        if (data?.result?.data?.json?.id) {
          setCurrentUserId(data.result.data.json.id);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const handleInvite = async (name: string, email: string, role: "staff" | "admin") => {
    setInviting(true);
    try {
      const res = await fetch("/api/staff/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        setToast({ message: data.error || "Failed to invite", type: "error" });
        return;
      }
      setToast({ message: `${name} invited as ${role}`, type: "success" });
      setShowInvite(false);
      fetchStaff();
    } catch {
      setToast({ message: "Failed to send invitation", type: "error" });
    } finally {
      setInviting(false);
    }
  };

  const handleChangeRole = async (id: number, newRole: string) => {
    const member = staff.find((s) => s.id === id);
    if (!member || member.role === newRole) return;
    setConfirmAction({ type: "role", id, name: member.name || "this member", role: newRole });
  };

  const handleRemove = async (id: number) => {
    const member = staff.find((s) => s.id === id);
    if (!member) return;
    setConfirmAction({
      type: "remove",
      id,
      name: member.name || member.email || "this member",
    });
  };

  const executeAction = async () => {
    if (!confirmAction) return;
    setActionLoading(true);
    try {
      if (confirmAction.type === "role") {
        const res = await fetch(`/api/staff/${confirmAction.id}/role`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: confirmAction.role }),
        });
        if (!res.ok) {
          const data = await res.json();
          setToast({ message: data.error || "Failed to update role", type: "error" });
          return;
        }
        setToast({ message: `${confirmAction.name} is now ${confirmAction.role}`, type: "success" });
      } else {
        const res = await fetch(`/api/staff/${confirmAction.id}`, { method: "DELETE" });
        if (!res.ok) {
          const data = await res.json();
          setToast({ message: data.error || "Failed to remove member", type: "error" });
          return;
        }
        setToast({ message: `${confirmAction.name} has been removed`, type: "success" });
      }
      fetchStaff();
    } catch {
      setToast({ message: "Action failed. Please try again.", type: "error" });
    } finally {
      setActionLoading(false);
      setConfirmAction(null);
    }
  };

  // Stats
  const admins = staff.filter((s) => s.role === "admin").length;
  const staffCount = staff.filter((s) => s.role === "staff").length;
  const pending = staff.filter((s) => s.isPending).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-6 h-6 text-purple-600" />
                Staff Management
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Invite team members, manage roles, and control access to the dashboard.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchStaff}
                disabled={loading}
                className="rounded-xl"
              >
                <RefreshCw className={cn("w-4 h-4 mr-1.5", loading && "animate-spin")} />
                Refresh
              </Button>
              <Button
                size="sm"
                onClick={() => setShowInvite(true)}
                className="rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                <UserPlus className="w-4 h-4 mr-1.5" />
                Invite Member
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div initial="hidden" animate="visible" variants={stagger} className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total Members", value: staff.length, color: "text-gray-900", bg: "bg-white" },
            { label: "Admins", value: admins, color: "text-purple-700", bg: "bg-purple-50" },
            { label: "Staff", value: staffCount, color: "text-blue-700", bg: "bg-blue-50" },
            { label: "Pending", value: pending, color: "text-amber-700", bg: "bg-amber-50" },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              className={cn("rounded-xl border p-3 text-center", stat.bg)}
            >
              <div className={cn("text-2xl font-bold", stat.color)}>{stat.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && !error && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          </div>
        )}

        {/* Staff List */}
        {!loading && !error && (
          <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-3">
            {staff.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No team members yet. Invite your first staff member to get started.</p>
              </div>
            ) : (
              staff.map((member) => (
                <StaffCard
                  key={member.id}
                  member={member}
                  isCurrentUser={member.id === currentUserId}
                  onChangeRole={handleChangeRole}
                  onRemove={handleRemove}
                />
              ))
            )}
          </motion.div>
        )}

        {/* Info Box */}
        {!loading && !error && (
          <div className="mt-8 bg-blue-50/50 border border-blue-100 rounded-xl p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-1">How invitations work</h4>
            <p className="text-xs text-blue-600 leading-relaxed">
              When you invite a team member, they are pre-created with their assigned role. When they sign in at{" "}
              <strong>rkaaiskin.com</strong> using Google with the same email, their account is automatically linked
              and they get immediate access with the correct permissions. Pending invitations can be deleted at any time.
            </p>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      <AnimatePresence>
        <InviteModal open={showInvite} onClose={() => setShowInvite(false)} onInvite={handleInvite} loading={inviting} />
      </AnimatePresence>

      {/* Confirm Modal */}
      <AnimatePresence>
        <ConfirmModal
          open={!!confirmAction}
          title={confirmAction?.type === "remove" ? "Remove Member" : "Change Role"}
          message={
            confirmAction?.type === "remove"
              ? `Are you sure you want to remove ${confirmAction.name}? They will lose access to the dashboard.`
              : `Change ${confirmAction?.name}'s role to ${confirmAction?.role}?`
          }
          confirmLabel={confirmAction?.type === "remove" ? "Remove" : "Change Role"}
          confirmVariant={confirmAction?.type === "remove" ? "danger" : "primary"}
          onConfirm={executeAction}
          onCancel={() => setConfirmAction(null)}
          loading={actionLoading}
        />
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={cn(
              "fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2",
              toast.type === "success"
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white"
            )}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <AlertTriangle className="w-4 h-4" />
            )}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
