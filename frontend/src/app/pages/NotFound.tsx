import { Link } from "react-router";
import { Stethoscope, Home, ArrowLeft, LogIn, UserPlus } from "lucide-react";
import { Button } from "../components/ui/Button";

export function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center">
      {/* Visual Header */}
      <div className="mb-8">
        <div className="bg-primary/10 p-6 rounded-full inline-block animate-pulse">
          <Stethoscope className="w-16 h-16 text-primary" />
        </div>
      </div>

      <h1 className="text-9xl font-extrabold text-primary mb-4 tracking-tighter">
        404
      </h1>
      <h2 className="text-3xl font-bold text-foreground mb-4">
        Page Not Found
      </h2>
      <p className="text-muted-foreground text-lg mb-10 max-w-md mx-auto">
        It seems the page you are looking for has been moved or doesn't exist.
      </p>

      {/* Primary Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
        <Link to="/signin" className="flex-1">
          <Button className="w-full h-12 gap-2 text-base shadow-lg shadow-primary/20">
            <LogIn className="w-5 h-5" />
            Sign In
          </Button>
        </Link>
        <Link to="/signup" className="flex-1">
          <Button
            variant="outline"
            className="w-full h-12 gap-2 text-base border-primary/20 hover:bg-primary/5"
          >
            <UserPlus className="w-5 h-5 text-primary" />
            Sign Up
          </Button>
        </Link>
      </div>

      {/* Decorative Go Back link */}
      <div className="mt-12 group">
        <Link
          to="/"
          className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
        >
          <Home className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
          Return to Home
        </Link>
      </div>

      {/* Subtle Background Elements */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <footer className="mt-20 text-sm text-muted-foreground border-t border-border pt-8 w-full max-w-xs">
        © 2026 Smart VoiceCare. Built for India.
      </footer>
    </div>
  );
}
