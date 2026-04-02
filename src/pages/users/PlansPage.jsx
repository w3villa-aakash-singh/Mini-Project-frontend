import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Crown, Zap, CheckCircle2, ArrowLeft } from "lucide-react";
import axios from 'axios';
import { useAuth } from "../../contex/AuthContex";
import { useNavigate, useLocation } from "react-router";
import toast from 'react-hot-toast';

const PLANS = [
  {
    id: 'SILVER',
    name: 'SILVER PROTOCOL',
    price: '$5',
    duration: '6 HOURS',
    icon: <Shield className="h-8 w-8 text-blue-400" />,
    features: ['Extended Data Access', 'Verified Badge', '6-Hour Session', 'Standard PDF Export']
  },
  {
    id: 'GOLD',
    name: 'GOLD PROTOCOL',
    price: '$10',
    duration: '12 HOURS',
    icon: <Crown className="h-8 w-8 text-yellow-500" />,
    features: ['Full Geospatial Access', 'Priority PDF Gen', '12-Hour Session', 'Global GPS Tracking']
  }
];

export default function PlansPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, refreshUser } = useAuth();

  // ✅ Detect return from Stripe
  useEffect(() => {
    const query = new URLSearchParams(location.search);

    // Example: ?success=true (set this in Stripe success URL)
    if (query.get("success") === "true") {
      const updateUser = async () => {
        await refreshUser();
        toast.success("Plan upgraded successfully 🚀");
      };

      updateUser();
    }
  }, [location.search]);

  const handleUpgrade = async (planName) => {
    const token = localStorage.getItem("accessToken"); 

    if (!token || token === "null") {
      toast.error("Please login to proceed.");
      return;
    }

    const loadingToast = toast.loading(`Initializing ${planName} Protocol...`);
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/payments/create-checkout-session`,
        { planName, userId: user.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      toast.error("Stripe Handshake Failed.", { id: loadingToast });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12 selection:bg-red-600/30">
      <div className="max-w-5xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-8 text-slate-400 uppercase font-black italic text-xs tracking-widest p-0 hover:bg-transparent hover:text-white transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Return to Profile
        </Button>

        <h1 className="text-6xl font-black italic uppercase tracking-tighter mb-2 leading-none">
          SYSTEM <span className="text-red-600 underline decoration-4">UPGRADES</span>
        </h1>

        <p className="text-slate-500 font-mono text-sm mb-12 uppercase tracking-widest">
          Select a clearance level to bypass restricted data firewalls.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {PLANS.map((plan) => (
            <Card key={plan.id} className="bg-slate-900 border-slate-800 rounded-none relative overflow-hidden group">
              
              <div className="absolute top-0 left-0 w-1 h-full bg-red-600 group-hover:w-2 transition-all"></div>

              <CardHeader className="border-b border-slate-800 p-8 flex flex-row justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black uppercase italic tracking-tight">{plan.name}</h2>
                  <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">
                    Term: {plan.duration}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-4xl font-black italic">{plan.price}</span>
                </div>
              </CardHeader>

              <CardContent className="p-8 space-y-4">
                {plan.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 text-slate-400 text-xs font-mono uppercase">
                    <CheckCircle2 className="h-4 w-4 text-red-600 shrink-0" /> {f}
                  </div>
                ))}
              </CardContent>

              <CardFooter className="p-8 pt-0">
                <Button 
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={user?.planType === plan.id}
                  className="w-full h-14 bg-white text-black font-black uppercase rounded-none hover:bg-red-600 hover:text-white transition-all shadow-[4px_4px_0_0_rgba(220,38,38,1)] active:translate-x-1 active:translate-y-1 active:shadow-none"
                >
                  {user?.planType === plan.id 
                    ? "CURRENT ACCESS" 
                    : <>Purchase Token <Zap className="ml-2 h-4 w-4 fill-current" /></>
                  }
                </Button>
              </CardFooter>

            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}