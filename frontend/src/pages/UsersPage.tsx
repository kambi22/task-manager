import { useState } from "react";
import { useUsers } from "../hooks/useUsers";
import { updateUser, deleteUser } from "../api/userApi";
import { PageHeader } from "../components/layout/PageHeader";
import { Avatar } from "../components/ui/Avatar";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import {
  UserCog,
  Pencil,
  Trash2,
  Shield,
  Mail,
  Calendar,
  Search,
  AlertTriangle,
  Users,
} from "lucide-react";
import type { User, Role } from "../types";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";

export default function UsersPage() {
  const { user: currentUser, refreshUser } = useAuth();
  const { users, loading, refresh } = useUsers();
  const [searchQuery, setSearchQuery] = useState("");

  // Edit modal state
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    role: "USER" as Role,
    isTeamMember: false,
  });
  const [editSubmitting, setEditSubmitting] = useState(false);

  // Delete confirmation state
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openEdit = (user: User) => {
    setEditingUser(user);
    setEditData({
      name: user.name,
      email: user.email,
      role: user.role,
      isTeamMember: user.isTeamMember,
    });
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setEditSubmitting(true);
    try {
      await updateUser(editingUser.id, {
        name: editData.name,
        role: editData.role,
        isTeamMember: editData.isTeamMember,
      });
      toast.success("User updated successfully");
      if (editingUser.id === currentUser?.id) {
        await refreshUser();
      }
      setEditingUser(null);
      refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to update user");
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingUser) return;

    setDeleteSubmitting(true);
    try {
      await deleteUser(deletingUser.id);
      toast.success("User deleted successfully");
      setDeletingUser(null);
      refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete user");
    } finally {
      setDeleteSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="User Management"
        subtitle={`${users.length} registered users`}
      />

      {/* Search bar */}
      <div className="relative max-w-md">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
        />
        <input
          type="text"
          placeholder="Search by name, email, or role..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-sm text-white placeholder-slate-500 outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/50"
        />
      </div>

      {/* Users table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-700/30">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  User
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Role & Status
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Joined
                </th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="skeleton w-9 h-9 rounded-full" />
                        <div className="skeleton w-28 h-4 rounded" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="skeleton w-40 h-4 rounded" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="skeleton w-16 h-5 rounded-full" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="skeleton w-24 h-4 rounded" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="skeleton w-20 h-4 rounded float-right" />
                    </td>
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <UserCog
                      size={40}
                      className="mx-auto text-slate-600 mb-3"
                    />
                    <p className="text-sm text-slate-400">
                      {searchQuery
                        ? "No users match your search"
                        : "No users registered yet"}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={user.name} size="sm" />
                        <span className="text-sm font-medium text-slate-200">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Mail size={13} />
                        <span className="text-sm">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider ${
                            user.role === "ADMIN"
                              ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/20"
                              : "bg-slate-500/15 text-slate-400 border border-slate-700/20"
                          }`}
                        >
                          <Shield size={10} />
                          {user.role}
                        </span>
                        {user.isTeamMember && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                            <Users size={10} />
                            Team
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Calendar size={13} />
                        <span className="text-sm">
                          {formatDate(user.createdAt)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 transition-opacity">
                        <button
                          onClick={() => openEdit(user)}
                          className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-all cursor-pointer"
                          title="Edit user"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => setDeletingUser(user)}
                          className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-all cursor-pointer"
                          title="Delete user"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal */}
      <Modal
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        title="Edit User"
        size="sm"
      >
        <form onSubmit={handleEdit} className="space-y-4">
          <Input
            label="Name"
            placeholder="Enter name"
            value={editData.name}
            onChange={(e) =>
              setEditData((prev) => ({ ...prev, name: e.target.value }))
            }
            autoFocus
          />
          <Input
            label="Email (Not Editable)"
            type="email"
            placeholder="Email address"
            value={editData.email}
            disabled={true}
            className="opacity-60 cursor-not-allowed bg-slate-800/30"
          />
          <Select
            label="Role"
            options={[
              { value: "USER", label: "User" },
              { value: "ADMIN", label: "Admin" },
            ]}
            value={editData.role}
            onChange={(e) =>
              setEditData((prev) => ({
                ...prev,
                role: e.target.value as Role,
              }))
            }
          />
          <Select
            label="Team Membership Status"
            options={[
              { value: "false", label: "Not in Team" },
              { value: "true", label: "Team Member" },
            ]}
            value={editData.isTeamMember ? "true" : "false"}
            onChange={(e) =>
              setEditData((prev) => ({
                ...prev,
                isTeamMember: e.target.value === "true",
              }))
            }
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700/50">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setEditingUser(null)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={editSubmitting}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingUser}
        onClose={() => setDeletingUser(null)}
        title="Delete User"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
            <AlertTriangle size={20} className="text-rose-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-rose-300 font-medium">
                This action cannot be undone
              </p>
              <p className="text-xs text-rose-300/70 mt-1">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-rose-200">
                  {deletingUser?.name}
                </span>
                ? All their task assignments will be unassigned.
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => setDeletingUser(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={deleteSubmitting}
            >
              Delete User
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
