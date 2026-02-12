import { Link } from "wouter";
import { Moon } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 text-white relative overflow-hidden">
      {/* Stars Background */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="stars"></div>
      </div>
      
      <div className="glass-card p-12 rounded-3xl text-center max-w-md mx-4 relative z-10 box-glow">
        <div className="mb-6 flex justify-center">
          <Moon className="w-20 h-20 text-primary drop-shadow-[0_0_20px_rgba(255,215,0,0.5)]" />
        </div>
        
        <h1 className="text-6xl font-display font-bold text-white mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">
          The page you are looking for seems to be lost in the night.
        </p>

        <Link href="/" className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-sm font-bold text-slate-900 shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:scale-105 active:scale-95">
          Return Home
        </Link>
      </div>
    </div>
  );
}
