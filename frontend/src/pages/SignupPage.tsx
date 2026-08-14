import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Zap, User, Mail, Lock, Eye, EyeOff, UserPlus, Shield } from "lucide-react";
import toast from "react-hot-toast";

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "ADMIN" as "USER" | "ADMIN",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email address";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      toast.success("Account created successfully!");
      navigate("/", { replace: true });
    } catch (err: any) {
      toast.error(err.message || "Signup failed");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--bg-input)] border text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/40 ${
      errors[field]
        ? "border-rose-500/50 focus:border-rose-500"
        : "border-[var(--border-input)] focus:border-blue-500/50"
    }`;

  const inputClassWithPr = (field: string) =>
    `w-full pl-10 pr-11 py-3 rounded-xl bg-[var(--bg-input)] border text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/40 ${
      errors[field]
        ? "border-rose-500/50 focus:border-rose-500"
        : "border-[var(--border-input)] focus:border-blue-500/50"
    }`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] relative overflow-hidden transition-colors duration-300">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden" style={{ opacity: "var(--glow-opacity)" }}>
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/3 right-1/3 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md px-6 animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 shadow-lg shadow-blue-500/30 mb-4">
            <Zap size={28} className="text-white fill-white/20" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
            Create your account
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Join TaskFlow and start managing tasks
          </p>
        </div>

        {/* Signup form card */}
        <div className="bg-[var(--bg-glass)] backdrop-blur-xl border border-[var(--border-input)] rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className={inputClass("name")}
                  autoFocus
                />
              </div>
              {errors.name && (
                <p className="text-xs text-rose-400 mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider">
                Email
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className={inputClass("email")}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-rose-400 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  className={inputClassWithPr("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-rose-400 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider">
                Confirm Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                />
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repeat password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  className={inputClassWithPr("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors cursor-pointer"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-rose-400 mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Role selection */}
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider">
                Select Role (testing/development)
              </label>
              <div className="relative">
                <Shield
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                />
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      role: e.target.value as "USER" | "ADMIN",
                    }))
                  }
                  className="
                    w-full pl-10 pr-4 py-3 rounded-xl
                    bg-[var(--bg-input)] border border-[var(--border-input)]
                    text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none
                    transition-all duration-200 focus:ring-2 focus:ring-blue-500/40
                    appearance-none cursor-pointer
                    bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22/%3E%3C/svg%3E')]
                    bg-[position:right_14px_center] bg-no-repeat pr-10
                  "
                >
                  <option value="ADMIN" className="bg-[var(--bg-elevated)] text-[var(--text-primary)]">ADMIN (Default)</option>
                  <option value="USER" className="bg-[var(--bg-elevated)] text-[var(--text-primary)]">USER</option>
                </select>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus size={16} />
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 pt-6 border-t border-[var(--border-input)] text-center">
            <p className="text-sm text-[var(--text-muted)]">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-[var(--text-dimmed)] mt-6">
          TaskFlow &middot; Secure Authentication
        </p>
      </div>
    </div>
  );
}
