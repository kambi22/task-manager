import { useState } from "react";
import { useUsers } from "../hooks/useUsers";
import { createUser } from "../api/userApi";
import { PageHeader } from "../components/layout/PageHeader";
import { Avatar } from "../components/ui/Avatar";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { UserPlus, Mail, Shield } from "lucide-react";
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
    <div className="animate-fade-in">
      <PageHeader
        title="Team"
        subtitle={`${users.length} team members`}
        actions={
          <Button onClick={() => setShowForm(true)}>
            <UserPlus size={16} />
            Add Member
          </Button>
        }
      />

      {/* Team grid */}
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
