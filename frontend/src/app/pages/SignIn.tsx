import { useState } from "react";
import { useNavigate, Link } from "react-router";
import {
  Stethoscope,
  ArrowRight,
  User,
  ShieldCheck,
  Phone,
  Languages,
  Shield,
  CheckCircle,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { supabase } from "../../lib/supabase";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleDemoLogin = (role: "doctor" | "admin") => {
    if (role === "doctor") {
      setEmail("doctor@hospital.com");
      setPassword("doctor123");
    } else {
      setEmail("admin@hospital.com");
      setPassword("admin123");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (email === "admin@hospital.com" && password === "admin123") {
        navigate("/admin");
        return;
      }
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.session) {
        navigate("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Failed to sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Side: Form */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-white overflow-y-auto">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-10 w-fit">
            <div className="bg-primary p-1.5 rounded-lg">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <span className="font-semibold text-xl text-primary">
              Smart VoiceCare
            </span>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight text-primary">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to your doctor or admin account to manage patient care.
          </p>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {/* <button
                type="button"
                onClick={() => handleDemoLogin("doctor")}
                className="flex flex-col items-center justify-center p-3 border border-border rounded-xl hover:bg-primary/5 hover:border-primary transition-all group"
              >
                <User className="w-6 h-6 text-muted-foreground group-hover:text-primary mb-1" />
                <span className="text-xs font-medium text-muted-foreground group-hover:text-primary">
                  Demo Doctor
                </span>
              </button> */}
              {/* <button
                type="button"
                onClick={() => handleDemoLogin("admin")}
                className="flex flex-col items-center justify-center p-3 border border-border rounded-xl hover:bg-primary/5 hover:border-primary transition-all group"
              >
                <ShieldCheck className="w-6 h-6 text-muted-foreground group-hover:text-primary mb-1" />
                <span className="text-xs font-medium text-muted-foreground group-hover:text-primary">
                  Demo Admin
                </span>
              </button> */}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="doctor@hospital.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-primary hover:text-primary/80"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 shadow-sm"
              />
            </div>
            
            {error && (
              <div className="text-sm font-medium text-destructive">{error}</div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 text-base font-medium shadow-md hover:scale-[1.01] transition-all"
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="mt-10 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold leading-6 text-primary hover:text-primary/80"
            >
              Sign up for your hospital
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side: Content Area */}
      <div className="hidden lg:flex lg:flex-1 relative bg-primary overflow-hidden">
        {/* Abstract Background Patterns */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-accent rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-white rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-white">
          <div className="max-w-lg">
            <h3 className="text-4xl font-bold mb-8 leading-tight">
              Empowering healthcare with AI-driven conversations.
            </h3>

            <div className="space-y-8">
              <div className="flex gap-4 items-start">
                <div className="mt-1 bg-white/10 p-2 rounded-lg border border-white/20">
                  <Phone className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">
                    Automated Patient Follow-ups
                  </h4>
                  <p className="text-white/70">
                    Our AI assistant handles post-discharge calls so you can
                    focus on complex cases.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="mt-1 bg-white/10 p-2 rounded-lg border border-white/20">
                  <Languages className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">
                    Multilingual Patient Support
                  </h4>
                  <p className="text-white/70">
                    Breaking language barriers with support for 12+ Indian
                    regional languages.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="mt-1 bg-white/10 p-2 rounded-lg border border-white/20">
                  <Shield className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">
                    Enterprise-grade Security
                  </h4>
                  <p className="text-white/70">
                    HIPAA-compliant data handling to protect sensitive patient
                    information.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-16 pt-12 border-t border-white/10 flex items-center gap-4 text-sm text-white/50 italic">
              "Smart VoiceCare has improved our follow-up completion by 96%."
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
