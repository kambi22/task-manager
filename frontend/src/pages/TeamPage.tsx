import { useState, useEffect } from "react";
import { useUsers } from "../hooks/useUsers";
import { createUser } from "../api/userApi";
import { getExternalUsers, type ExternalUser } from "../api/externalApi";
import { PageHeader } from "../components/layout/PageHeader";
import { Avatar } from "../components/ui/Avatar";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { UserPlus, Mail, Shield, Globe, Building2, Download, RefreshCw, Layers } from "lucide-react";
import type { Role } from "../types";
import toast from "react-hot-toast";

export default function TeamPage() {
  const { users, loading, refresh } = useUsers();
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "USER" as Role,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // External API integration state (Section 7 requirement)
  const [externalUsers, setExternalUsers] = useState<ExternalUser[]>([]);
  const [loadingExternal, setLoadingExternal] = useState(false);
  const [externalError, setExternalError] = useState<string | null>(null);
  const [showExternal, setShowExternal] = useState(false);

  const fetchExternal = async () => {
    setLoadingExternal(true);
    setExternalError(null);
    try {
      const data = await getExternalUsers();
      setExternalUsers(data);
    } catch (err: any) {
      setExternalError(err.message || "Failed to load external users");
      toast.error(err.message || "External API fetch failed");
    } finally {
      setLoadingExternal(false);
    }
  };

  useEffect(() => {
    if (showExternal && externalUsers.length === 0) {
      fetchExternal();
    }
  }, [showExternal]);

  const handleImportExternal = async (extUser: ExternalUser) => {
    try {
      await createUser({
        name: extUser.name,
        email: extUser.email,
        role: "USER",
      });
      toast.success(`Imported ${extUser.name} successfully!`);
      refresh();
    } catch (err: any) {
      toast.error(err.message || "Import failed");
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email address";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await createUser(formData);
      toast.success("Team member added");
      setShowForm(false);
      setFormData({ name: "", email: "", role: "USER" });
      refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to add team member");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-8">
      <PageHeader
        title="Team Management"
        subtitle={`${users.length} active internal team members`}
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              onClick={() => setShowExternal((prev) => !prev)}
            >
              <Globe size={16} />
              {showExternal ? "Hide External API Users" : "Explore External Directory"}
            </Button>
            <Button onClick={() => setShowForm(true)}>
              <UserPlus size={16} />
              Add Member
            </Button>
          </div>
        }
      />

      {/* External API Integration Panel (Requirement Section 7) */}
      {showExternal && (
        <div className="glass-panel p-6 rounded-3xl animate-slide-up border border-indigo-500/30">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Globe className="text-indigo-400" size={18} />
                External User Integration (JSONPlaceholder API)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Demonstrates REST API fetching with 5s timeout & response transformation
              </p>
            </div>
            <button
              onClick={fetchExternal}
              disabled={loadingExternal}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-all flex items-center gap-1.5 text-xs cursor-pointer"
            >
              <RefreshCw size={14} className={loadingExternal ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          {loadingExternal ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 py-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-900/50 skeleton h-24" />
              ))}
            </div>
          ) : externalError ? (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
              {externalError}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
              {externalUsers.map((user) => {
                const isAlreadyTeam = users.some(
                  (u) => u.email.toLowerCase() === user.email.toLowerCase()
                );
                return (
                  <div
                    key={user.id}
                    className="p-3.5 rounded-2xl glass-card border border-white/10 flex flex-col justify-between hover:border-indigo-500/40 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-semibold text-indigo-300 truncate max-w-[130px]">
                          @{user.username}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                          External
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-200 truncate">{user.name}</h4>
                      <p className="text-[11px] text-slate-400 truncate flex items-center gap-1 mt-1">
                        <Mail size={10} /> {user.email}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                        <Building2 size={10} /> {user.companyName}
                      </p>
                    </div>

                    <button
                      onClick={() => handleImportExternal(user)}
                      disabled={isAlreadyTeam}
                      className={`
                        w-full mt-3 py-1.5 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1 transition-all
                        ${
                          isAlreadyTeam
                            ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                            : "bg-indigo-600/80 hover:bg-indigo-500 text-white cursor-pointer border border-indigo-400/30 shadow-sm"
                        }
                      `}
                    >
                      <Download size={12} />
                      {isAlreadyTeam ? "In Team" : "Import Member"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Internal Team grid */}
      <div>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Layers size={14} /> Internal Team Directory
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-children">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-slate-800/30 border border-slate-700/30 rounded-2xl p-5"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="skeleton w-14 h-14 rounded-full mb-3" />
                    <div className="skeleton w-24 h-4 mb-2" />
                    <div className="skeleton w-32 h-3 mb-3" />
                    <div className="skeleton w-16 h-5 rounded-full" />
                  </div>
                </div>
              ))
            : users.map((user) => (
                <div
                  key={user.id}
                  className="bg-slate-800/30 border border-slate-700/30 rounded-2xl p-5 hover:bg-white/[0.02] hover:border-slate-600/40 transition-all duration-200 group"
                >
                  <div className="flex flex-col items-center text-center">
                    <Avatar name={user.name} size="lg" className="mb-3" />
                    <h3 className="text-sm font-semibold text-slate-200">
                      {user.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1 text-slate-500">
                      <Mail size={12} />
                      <span className="text-xs truncate max-w-[180px]">
                        {user.email}
                      </span>
                    </div>
                    <div className="mt-3">
                      <span
                        className={`
                          inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider
                          ${
                            user.role === "ADMIN"
                              ? "bg-indigo-500/15 text-indigo-400"
                              : "bg-slate-500/15 text-slate-400"
                          }
                        `}
                      >
                        <Shield size={10} />
                        {user.role}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>

      {/* Add member modal */}
      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setErrors({});
        }}
        title="Add Team Member"
        size="sm"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            placeholder="Enter name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            error={errors.name}
            autoFocus
          />
          <Input
            label="Email"
            type="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            error={errors.email}
          />
          <Select
            label="Role"
            options={[
              { value: "USER", label: "User" },
              { value: "ADMIN", label: "Admin" },
            ]}
            value={formData.role}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                role: e.target.value as Role,
              }))
            }
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700/50">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={submitting}>
              Add Member
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
