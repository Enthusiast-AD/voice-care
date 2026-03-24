import { Link } from "react-router";
import {
  Phone,
  Heart,
  Languages,
  BarChart3,
  Bell,
  Calendar,
  ArrowRight,
  CheckCircle,
  Stethoscope,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-sm z-50 border-b border-border">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo and Brand */}
            <Link
              to="/"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="bg-primary p-2.5 rounded-lg">
                <Stethoscope className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="font-semibold text-xl text-primary">
                  Smart VoiceCare
                </div>
                <div className="text-xs text-muted-foreground">
                  AI Patient Engagement
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Features
              </a>
              <a
                href="#benefits"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Benefits
              </a>
              <a
                href="#impact"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Impact
              </a>
              <div className="flex items-center gap-3 ml-4">
                <Link
                  to="/dashboard"
                  className="text-primary hover:text-primary/80 transition-colors px-4 py-2"
                >
                  Doctor Login
                </Link>
                <Link
                  to="/admin"
                  className="bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Admin Panel
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-primary"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border bg-white">
              <div className="flex flex-col gap-4">
                <a
                  href="#features"
                  className="text-muted-foreground hover:text-primary transition-colors py-2"
                >
                  Features
                </a>
                <a
                  href="#benefits"
                  className="text-muted-foreground hover:text-primary transition-colors py-2"
                >
                  Benefits
                </a>
                <a
                  href="#impact"
                  className="text-muted-foreground hover:text-primary transition-colors py-2"
                >
                  Impact
                </a>
                <Link
                  to="/dashboard"
                  className="text-primary hover:text-primary/80 transition-colors py-2"
                >
                  Doctor Login
                </Link>
                <Link
                  to="/admin"
                  className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors text-center"
                >
                  Admin Panel
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/90 text-white pt-32 pb-24">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-2 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            <div className="space-y-8">
              {/* Heading */}
              <div>
                <h1 className="text-5xl md:text-6xl mb-6 leading-tight">
                  One Call.
                  <br />
                  One Conversation.
                  <br />
                  <span className="text-accent">A Life Saved.</span>
                </h1>
                <p className="text-xl md:text-2xl mb-4 text-white/90 leading-relaxed">
                  AI-powered multilingual voice assistant for post-discharge
                  patient care
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/dashboard"
                  className="bg-accent text-accent-foreground px-8 py-4 rounded-lg hover:bg-accent/90 transition-all hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2 group"
                >
                  <span className="font-medium">Explore Dashboard</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/admin"
                  className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg hover:bg-white/20 transition-all border border-white/30 flex items-center justify-center gap-2"
                >
                  <span className="font-medium">Admin Access</span>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/20">
                <div>
                  <div className="text-3xl font-semibold text-accent">
                    300M+
                  </div>
                  <div className="text-sm text-white/70">Patients Annually</div>
                </div>
                <div>
                  <div className="text-3xl font-semibold text-accent">12+</div>
                  <div className="text-sm text-white/70">Languages</div>
                </div>
                <div>
                  <div className="text-3xl font-semibold text-accent">24/7</div>
                  <div className="text-sm text-white/70">Monitoring</div>
                </div>
              </div>
            </div>

            {/* Hero Image/Illustration */}
            <div className="hidden md:flex justify-center items-center relative">
              <div className="relative">
                {/* Main Card */}
                <div className="bg-white/10 backdrop-blur-xl p-10 rounded-3xl border border-white/20 shadow-2xl">
                  <Phone className="w-40 h-40 text-accent mb-6 mx-auto" />
                  <div className="text-center space-y-3">
                    <p className="text-xl font-medium">Works on Any Phone</p>
                    <p className="text-sm text-white/70">
                      No app. No internet. No barriers.
                    </p>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-6 -right-6 bg-accent text-accent-foreground px-4 py-2 rounded-lg shadow-lg text-sm font-medium">
                  AI Powered
                </div>
                <div className="absolute -bottom-6 -left-6 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg border border-white/30 text-sm">
                  Multilingual Support
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
              fill="#f5f9f8"
            />
          </svg>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-20 bg-background" id="features">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl mb-6 text-primary">
              The Silent Crisis After Discharge
            </h2>
            <p className="text-xl text-muted-foreground">
              Every year, millions of patients are discharged from Indian
              hospitals. The moment they leave, structured medical support
              vanishes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-card p-8 rounded-xl shadow-lg border border-border">
              <div className="text-5xl mb-4 text-primary">15-25%</div>
              <p className="text-muted-foreground">
                of cardiac and surgical patients experience avoidable
                post-discharge complications
              </p>
            </div>
            <div className="bg-card p-8 rounded-xl shadow-lg border border-border">
              <div className="text-5xl mb-4 text-primary">1:1445</div>
              <p className="text-muted-foreground">
                Doctor to patient ratio in India vs WHO-recommended 1:1000
              </p>
            </div>
            <div className="bg-card p-8 rounded-xl shadow-lg border border-border">
              <div className="text-5xl mb-4 text-primary">300M+</div>
              <p className="text-muted-foreground">
                Hospital outpatient visits annually in India
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4 text-primary">How It Works</h2>
            <p className="text-xl text-muted-foreground">
              Proactive AI-powered voice calls in the patient's language
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-card p-8 rounded-xl shadow-md">
              <Phone className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl mb-3 text-primary">
                Automated Voice Calls
              </h3>
              <p className="text-muted-foreground">
                Scheduled follow-up calls on Day 1, 3, 7, 14 post-discharge
              </p>
            </div>

            <div className="bg-card p-8 rounded-xl shadow-md">
              <Languages className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl mb-3 text-primary">
                Multilingual Support
              </h3>
              <p className="text-muted-foreground">
                Hindi, English + 10+ Indian regional languages via Bhashini AI
              </p>
            </div>

            <div className="bg-card p-8 rounded-xl shadow-md">
              <BarChart3 className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl mb-3 text-primary">AI Risk Scoring</h3>
              <p className="text-muted-foreground">
                Real-time classification: Low, Medium, High, Critical
              </p>
            </div>

            <div className="bg-card p-8 rounded-xl shadow-md">
              <Bell className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl mb-3 text-primary">Instant Alerts</h3>
              <p className="text-muted-foreground">
                SMS, WhatsApp, push notifications on High/Critical risk
                detection
              </p>
            </div>

            <div className="bg-card p-8 rounded-xl shadow-md">
              <Heart className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl mb-3 text-primary">Doctor Dashboard</h3>
              <p className="text-muted-foreground">
                Real-time patient monitoring ranked by risk level
              </p>
            </div>

            <div className="bg-card p-8 rounded-xl shadow-md">
              <Calendar className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl mb-3 text-primary">Smart Scheduling</h3>
              <p className="text-muted-foreground">
                Auto-generated follow-up schedules based on diagnosis
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-background" id="benefits">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="text-4xl mb-8 text-primary">
                Why Smart VoiceCare?
              </h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="mb-2">No App Required</h4>
                    <p className="text-muted-foreground">
                      Works on any basic mobile or landline phone
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="mb-2">No Internet Required</h4>
                    <p className="text-muted-foreground">
                      Standard phone call - reaches rural India
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="mb-2">No Literacy Required</h4>
                    <p className="text-muted-foreground">
                      Natural voice conversation in patient's language
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="mb-2">Zero Extra Workload</h4>
                    <p className="text-muted-foreground">
                      Doctors only alerted on High/Critical cases
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="mb-2">Proven ROI</h4>
                    <p className="text-muted-foreground">
                      One prevented readmission &gt; cost of 100+ AI calls
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card p-8 rounded-xl shadow-lg border border-border">
              <h3 className="text-2xl mb-6 text-primary">Impact Metrics</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">
                      Readmission Reduction
                    </span>
                    <span className="text-primary">20-40%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-accent w-[30%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">
                      Early Detection Rate
                    </span>
                    <span className="text-primary">85%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-accent w-[85%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">
                      Patient Satisfaction
                    </span>
                    <span className="text-primary">92%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-accent w-[92%]"></div>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-border">
                <div className="text-center">
                  <div className="text-3xl text-primary mb-2">₹5-10</div>
                  <p className="text-sm text-muted-foreground">
                    Cost per AI follow-up call
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-white" id="impact">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl mb-6">
            Ready to Transform Post-Discharge Care?
          </h2>
          <p className="text-xl mb-8 text-white/80 max-w-2xl mx-auto">
            Join leading hospitals across India in preventing avoidable
            complications
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/dashboard"
              className="bg-accent text-accent-foreground px-8 py-4 rounded-lg hover:bg-accent/90 transition-colors"
            >
              View Doctor Dashboard
            </Link>
            <Link
              to="/admin"
              className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg hover:bg-white/20 transition-colors border border-white/30"
            >
              Access Admin Panel
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-muted-foreground">
              © 2026 Smart VoiceCare. Built for India. Built for every language.
            </div>
            <div className="flex gap-6">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                About
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
