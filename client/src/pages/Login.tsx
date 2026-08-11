/**
 * Login — email/password + Google OAuth.
 */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { useAuth } from "../store/AuthContext";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { ROUTES } from "../lib/constants";
import GoogleIcon from "../components/ui/GoogleIcon";

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      setError("Email yoki parol noto'g'ri");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/15">
            <span className="text-xl font-bold text-amber-400">K</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-zinc-100">
            KnowFlow
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Knowledge base uchun qaytib keling
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6"
        >
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ali@example.com"
                leftIcon={<Mail className="h-4 w-4" />}
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                Parol
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                leftIcon={<Lock className="h-4 w-4" />}
                required
              />
            </div>
          </div>

          <Button type="submit" className="mt-6 w-full" isLoading={loading}>
            Kirish
          </Button>

          <div className="my-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-zinc-800" />
            <span className="text-xs text-zinc-600">yoki</span>
            <div className="h-px flex-1 bg-zinc-800" />
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={loginWithGoogle}
          >
            <GoogleIcon className="h-4 w-4" />
            Google bilan davom etish
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Hisobingiz yo'qmi?{" "}
          <Link
            to={ROUTES.REGISTER}
            className="font-medium text-amber-400 hover:text-amber-300"
          >
            Ro'yxatdan o'tish
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;