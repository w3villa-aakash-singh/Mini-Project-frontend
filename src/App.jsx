import React, { useEffect } from 'react';
import { useNavigate } from "react-router";
import { Button } from '@/components/ui/button';
import { Shield, Zap, ArrowRight, CheckCircle2 } from "lucide-react";

function App() {
  const navigate = useNavigate();

  // Logic to check if user is logged in
  // In a real app, check your AuthContext or localStorage for a JWT
  const isLoggedIn = true;

  const handleGetStarted = () => {
    if (isLoggedIn) {
      // If logged in, go to Plan Status / Dashboard as per requirements [cite: 16, 50]
      navigate("/dashboard"); 
    } else {
      // If not, go to login [cite: 42]
      navigate("/login");
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-slate-950 text-white px-4 ">
      {/* Hero Section */}
      <div className="text-center max-w-3xl space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-500 text-sm font-medium mb-4">
          <Shield className="h-4 w-4" />
          Secure Plan Verification System
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic uppercase">
          Verify Your <span className="text-red-600">Access</span>
        </h1>
        
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
          Manage your profile with Storj decentralized storage, update your location via Google Maps, 
          and access premium features with our time-limited 1h, 6h, or 12h plans.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Button 
            size="lg" 
            className="bg-red-600 hover:bg-red-700 text-white h-14 px-8 text-lg font-bold transition-all hover:scale-105"
            onClick={handleGetStarted}
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            className="border-slate-700 text-slate-300 hover:bg-slate-900 h-14 px-8 text-lg"
            onClick={() => navigate("/about")}
          >
            Learn More
          </Button>
        </div>
      </div>

      {/* Quick Feature highlights from FRD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-6xl w-full text-left">
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-white/5">
          <CheckCircle2 className="text-red-500 mb-3" />
          <h3 className="font-bold text-lg">Social Merge</h3>
          <p className="text-slate-400 text-sm">Seamlessly link Google or Facebook to your existing account[cite: 11].</p>
        </div>
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-white/5">
          <Zap className="text-red-500 mb-3" />
          <h3 className="font-bold text-lg">Time-Limited Plans</h3>
          <p className="text-slate-400 text-sm">Automated cron jobs manage your 1h, 6h, or 12h access levels[cite: 100].</p>
        </div>
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-white/5">
          {/* <MapPin className="text-red-500 mb-3" /> */}
          <h3 className="font-bold text-lg">Smart Profiles</h3>
          <p className="text-slate-400 text-sm">Auto-suggest addresses and display your profile location on a map[cite: 65].</p>
        </div>
      </div>
    </div>
  );
}

export default App;