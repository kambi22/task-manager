import { useState, useEffect } from "react";
import { useUsers } from "../hooks/useUsers";
import { createUser, addUsersToTeam, updateUser } from "../api/userApi";
import { getExternalUsers, type ExternalUser } from "../api/externalApi";
import { PageHeader } from "../components/layout/PageHeader";
import { Avatar } from "../components/ui/Avatar";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { Globe, Building2, Download, RefreshCw, Layers, Search, CheckSquare, Mail, UserX, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import { Tooltip } from "../components/ui/Tooltip";
import type { User } from "../types";

export default function TeamPage() {
  const { user: currentUser, refreshUser } = useAuth();
  const isAdmin = currentUser?.role === "ADMIN";
  // Query only users that are team members
  const { users, loading, refresh } = useUsers({ isTeamMember: true });
  // Query users that are NOT team members for the add member list
  const { users: nonTeamUsers, loading: loadingNonTeam, refresh: refreshNonTeam } = useUsers({ isTeamMember: false });

  const [showPicker, setShowPicker] = useState(false);
  const [pickerSearch, setPickerSearch] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Exclude member confirmation state
  const [excludingUser, setExcludingUser] = useState<User | null>(null);
  const [excludeSubmitting, setExcludeSubmitting] = useState(false);

  const handleExcludeMember = async () => {
    if (!excludingUser) return;
    setExcludeSubmitting(true);
    try {
      await updateUser(excludingUser.id, { isTeamMember: false });
      toast.success(`${excludingUser.name} excluded from team`);
      if (excludingUser.id === currentUser?.id) {
        await refreshUser();
      }
      setExcludingUser(null);
      refresh();
      refreshNonTeam();
    } catch (err: any) {
      toast.error(err.message || "Failed to exclude member");
    } finally {
      setExcludeSubmitting(false);
    }
  };

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
        isTeamMember: true, // External users imported directly into team
      });
      toast.success(`Imported ${extUser.name} successfully!`);
      refresh();
      refreshNonTeam();
    } catch (err: any) {
      toast.error(err.message || "Import failed");
    }
  };

  const handleToggleUser = (id: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const handleAddMembers = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUserIds.length === 0) {
      toast.error("Please select at least one user");
      return;
    }

    setSubmitting(true);
    try {
      await addUsersToTeam(selectedUserIds);
      toast.success(`${selectedUserIds.length} members added to team`);
      if (selectedUserIds.includes(currentUser?.id || "")) {
        await refreshUser();
      }
      setShowPicker(false);
      setSelectedUserIds([]);
      setPickerSearch("");
      refresh();
      refreshNonTeam();
    } catch (err: any) {
      toast.error(err.message || "Failed to add team members");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredNonTeam = nonTeamUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(pickerSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(pickerSearch.toLowerCase())
  );

  return (
    <div className="animate-fade-in space-y-8">
      <PageHeader
        title="Team Management"
        subtitle={`${users.length} active internal team members`}
        actions={
          isAdmin ? (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <Button
                variant="secondary"
                onClick={() => setShowExternal((prev) => !prev)}
                className="w-full sm:w-auto"
              >
                <Globe size={16} />
                {showExternal ? "Hide External API Users" : "Explore External Directory"}
              </Button>
              <Button onClick={() => setShowPicker(true)} className="w-full sm:w-auto">
                <CheckSquare size={16} />
                Add Member
              </Button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <Tooltip content="Only admin can access external directories">
                <Button variant="secondary" disabled className="w-full sm:w-auto">
                  <Globe size={16} />
                  Explore External Directory (Locked)
                </Button>
              </Tooltip>
              <Tooltip content="Only admin can add members to team">
                <Button disabled className="w-full sm:w-auto">
                  <CheckSquare size={16} />
                  Add Member (Locked)
                </Button>
              </Tooltip>
            </div>
          )
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
        {users.length === 0 ? (
          <div className="glass-panel p-8 text-center rounded-2xl border border-slate-800">
            <p className="text-sm text-slate-500">No active team members. Click "Add Member" to build your team!</p>
          </div>
        ) : (
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
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => setExcludingUser(user)}
                          className="mt-4 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 text-xs font-semibold border border-rose-500/20 hover:border-rose-500/40 transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <UserX size={12} />
                          Exclude Member
                        </button>
                      )}
                    </div>
                  </div>
                ))}
          </div>
        )}
      </div>

      {/* User Picker Modal */}
      <Modal
        isOpen={showPicker}
        onClose={() => {
          setShowPicker(false);
          setSelectedUserIds([]);
          setPickerSearch("");
        }}
        title="Add Team Members"
        size="sm"
      >
        <form onSubmit={handleAddMembers} className="space-y-4">
          <p className="text-xs text-slate-400">
            Select one or more signed up users to add to the internal team.
          </p>

          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search signed up users..."
              value={pickerSearch}
              onChange={(e) => setPickerSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-800/40 border border-slate-700/50 text-xs text-white placeholder-slate-500 outline-none focus:ring-1 focus:ring-blue-500/50"
            />
          </div>

          <div className="max-h-[250px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {loadingNonTeam ? (
              <div className="text-center py-6 text-xs text-slate-500">Loading registered users...</div>
            ) : filteredNonTeam.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-500">
                {pickerSearch ? "No matching users found" : "All registered users are already in the team"}
              </div>
            ) : (
              filteredNonTeam.map((u) => (
                <label
                  key={u.id}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer select-none
                    ${
                      selectedUserIds.includes(u.id)
                        ? "bg-blue-600/10 border-blue-500/50 text-white"
                        : "bg-slate-800/20 border-slate-700/30 hover:border-slate-600/50 text-slate-300"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar name={u.name} size="sm" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate text-slate-200">{u.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{u.email}</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedUserIds.includes(u.id)}
                    onChange={() => handleToggleUser(u.id)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-800/40 text-blue-600 focus:ring-blue-500 focus:ring-opacity-25"
                  />
                </label>
              ))
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700/50">
            <Button
              variant="secondary"
              type="button"
              onClick={() => {
                setShowPicker(false);
                setSelectedUserIds([]);
                setPickerSearch("");
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={submitting}
              disabled={selectedUserIds.length === 0}
            >
              Add Selected ({selectedUserIds.length})
            </Button>
          </div>
        </form>
      </Modal>

      {/* Exclude Confirmation Modal */}
      <Modal
        isOpen={!!excludingUser}
        onClose={() => setExcludingUser(null)}
        title="Exclude Team Member"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
            <AlertTriangle size={20} className="text-rose-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-rose-300 font-medium">
                Exclude from team
              </p>
              <p className="text-xs text-rose-300/70 mt-1">
                Are you sure you want to exclude{" "}
                <span className="font-semibold text-rose-200">
                  {excludingUser?.name}
                </span>{" "}
                from the team? They will be removed from the team directory, and all their currently assigned tasks will be unassigned.
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => setExcludingUser(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleExcludeMember}
              isLoading={excludeSubmitting}
            >
              Exclude Member
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
