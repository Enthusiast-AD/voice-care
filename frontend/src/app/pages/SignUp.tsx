import { useState } from "react";
import { Link } from "react-router";
import {
  Stethoscope,
  CheckCircle,
  BarChart3,
  Bell,
  UserPlus,
  ArrowRight,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

export default function SignUp() {
  const [formData, setFormData] = useState({
    hospitalName: "",
    adminName: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic here
    console.log("Sign up with:", formData);
  };

  const updateFormData = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Side: Form */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-12 bg-white overflow-y-auto">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8 w-fit">
            <div className="bg-primary p-1.5 rounded-lg shadow-sm shadow-primary/20">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <span className="font-semibold text-xl text-primary">
              Smart VoiceCare Agent Hub
            </span>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight text-primary">
            Register your institution
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Join the digital healthcare revolution. Empowering clinics to
            hospitals of all sizes.
          </p>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <Label htmlFor="hospitalName">Hospital / Clinic Name</Label>
              <Input
                id="hospitalName"
                placeholder="Apollo Hospitals / City Care Clinic"
                required
                value={formData.hospitalName}
                onChange={(e) => updateFormData("hospitalName", e.target.value)}
                className="h-11 shadow-sm focus:ring-primary/20"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="adminName">Admin Full Name</Label>
              <Input
                id="adminName"
                placeholder="Dr. Rajesh Kumar"
                required
                value={formData.adminName}
                onChange={(e) => updateFormData("adminName", e.target.value)}
                className="h-11 shadow-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Hospital Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="info@yourhospital.com"
                required
                value={formData.email}
                onChange={(e) => updateFormData("email", e.target.value)}
                className="h-11 shadow-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Create Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Min. 8 characters"
                required
                value={formData.password}
                onChange={(e) => updateFormData("password", e.target.value)}
                className="h-11 shadow-sm"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-base font-semibold shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] hover:shadow-primary/30 mt-4"
            >
              Get Started for Free
            </Button>
          </form>

          <p className="mt-10 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="font-semibold leading-6 text-primary hover:text-primary/80"
            >
              Sign in to your dashboard
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side: Content Area */}
      <div className="hidden lg:flex lg:flex-1 relative bg-primary overflow-hidden">
        {/* Background Visual Enhancements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-full h-full bg-white rounded-full blur-[180px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute top-3/4 left-1/2 w-64 h-64 border border-white/20 rounded-full animate-pulse" />
        </div>

        <div className="relative z-10 flex flex-col justify-center items-center w-full p-16 text-white text-center sm:text-left">
          <div className="max-w-xl">
            <h3 className="text-4xl font-extrabold mb-10 leading-[1.2]">
              The #1 Choice for Modern{" "}
              <span className="text-accent underline decoration-accent/40 underline-offset-4">
                Patient Engagement
              </span>
              .
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-12">
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all group">
                <div className="mb-4 bg-accent p-3 w-fit rounded-xl group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-bold text-lg mb-2">Detailed Analytics</h4>
                <p className="text-white/60 text-sm leading-relaxed">
                  Gain data-driven insights from every AI-patient conversation.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all group">
                <div className="mb-4 bg-accent p-3 w-fit rounded-xl group-hover:scale-110 transition-transform">
                  <Bell className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-bold text-lg mb-2">
                  Automated Notifications
                </h4>
                <p className="text-white/60 text-sm leading-relaxed">
                  Instantly receive alerts for patients showing high risk signs.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all group">
                <div className="mb-4 bg-accent p-3 w-fit rounded-xl group-hover:scale-110 transition-transform">
                  <UserPlus className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-bold text-lg mb-2">
                  Patient Records Integration
                </h4>
                <p className="text-white/60 text-sm leading-relaxed">
                  Seamlessly sync data with existing hospital record systems.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all group">
                <div className="mb-4 bg-accent p-3 w-fit rounded-xl group-hover:scale-110 transition-transform">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-bold text-lg mb-2">HIPAA Compliant</h4>
                <p className="text-white/60 text-sm leading-relaxed">
                  Privacy and safety of your patient's data is our top priority.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
