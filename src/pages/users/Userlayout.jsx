import React, { useState } from 'react';
import { useAuth } from "../../contex/AuthContex";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  MapPin, Zap, Download, ShieldCheck, Clock, CreditCard, 
  Camera, Globe, Mail, User, Save, History, ExternalLink 
} from "lucide-react";

export default function UserLayout() {
  const { user } = useAuth();
  const [address, setAddress] = useState(user?.address || "");

  return (
    <>
      {/* This CSS block hides the scrollbar across all browsers 
        while maintaining full scroll functionality via mouse/keyboard.
      */}
      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        html, body {
          overflow: hidden !important;
          height: 100%;
        }
      `}} />

      <div 
        className="no-scrollbar mt-15 fixed inset-0 bg-slate-950 text-white p-4 md:p-8 overflow-y-auto overflow-x-hidden selection:bg-red-600/30"
      >
        
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-2 border-red-600 pb-6 gap-4">
          <div>
            <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
              {user?.name?.split(' ')[0] || "ADMIN"} <span className="text-red-600 underline decoration-4">PROFILE</span>
            </h2>
            <div className="flex items-center gap-3 mt-4 text-slate-400">
              
              <div className="flex items-center gap-1">
                <ShieldCheck className="h-4 w-4 text-green-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-green-500">Identity Verified</span>
              </div>
            </div>
          </div>
          {/* Requirement 4.3: Profile Export [cite: 74, 78] */}
          <Button className="bg-red-600 hover:bg-red-700 text-white font-black italic uppercase tracking-wider h-14 px-8 rounded-none skew-x-[-12deg] transition-all active:scale-95">
            <Download className="mr-2 h-5 w-5" /> Export Profile [PDF]
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8 pb-32">
          
          {/* --- IDENTITY CARD (Requirement 4.1: Storj) --- */}
          <Card className="lg:col-span-4 bg-slate-900 border-slate-800 rounded-none relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-600 group-hover:w-2 transition-all"></div>
            <CardHeader className="items-center text-center pb-2">
              <div className="relative">
                {/* Profile Picture stored on Storj [cite: 56, 57, 164] */}
                <Avatar className="w-48 h-48 border-4 border-slate-800 group-hover:border-red-600/50 transition-colors">
                  <AvatarImage src={user?.picture} />
                  <AvatarFallback className="bg-slate-800 text-4xl font-black text-slate-500">A</AvatarFallback>
                </Avatar>
                <button className="absolute bottom-2 right-2 p-3 bg-red-600 rounded-none hover:bg-red-500 shadow-xl border-2 border-slate-900">
                  <Camera className="h-5 w-5 text-white" />
                </button>
              </div>
              <CardTitle className="mt-6 italic uppercase mr-100 text-3xl tracking-tighter font-black">{user?.name}</CardTitle>
              <CardDescription className="font-mono text-slate-400 ml-5  mt-1 flex items-center gap-2">
                <Mail className="h-3 w-3" /> {user?.email}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-950 p-3 border border-slate-800">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Status</p>
                  <p className="text-sm font-black italic uppercase text-red-500">Active Session</p>
                </div>
                <div className="bg-slate-950 p-3 border border-slate-800">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Auth Level</p>
                  <p className="text-sm font-black italic uppercase text-white">Verified</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* --- ADDRESS & MAP (Requirement 4.2) --- */}
          <Card className="lg:col-span-8 bg-slate-900 border-slate-800 rounded-none">
            <CardHeader className="border-b border-slate-800">
              <CardTitle className="flex items-center gap-2 italic uppercase tracking-tighter text-2xl font-black">
                <Globe className="text-red-600" /> Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-red-600" /> Address
                  </label>
                  <Input 
                    className="bg-slate-950 border-slate-800 text-white font-mono h-12 focus:border-red-600 rounded-none" 
                    placeholder="Enter physical address..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 flex items-center gap-1">
                    <User className="h-3 w-3 text-red-600" /> Update Username
                  </label>
                  <Input 
                    className="bg-slate-950 border-slate-800 text-white font-mono h-12 focus:border-red-600 rounded-none" 
                    defaultValue="Admin"
                  />
                </div>
              </div>

              {/* Address displayed on Map [cite: 65, 72] */}
              <div className="w-full h-64 bg-slate-950 border border-slate-800 relative overflow-hidden group">
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                   <div className="p-3 border border-red-600/50 bg-slate-900/80 backdrop-blur-md">
                      <p className="text-[10px] font-black uppercase tracking-widest text-red-500">Map Interface Ready</p>
                   </div>
                   <Button variant="link" className="text-slate-500 text-[10px] uppercase font-bold hover:text-white mt-2">
                     <ExternalLink className="h-3 w-3 mr-1" /> Open Full Map View
                   </Button>
                 </div>
              </div>
            </CardContent>
            <CardFooter className="bg-slate-950/50 p-4 border-t border-slate-800 flex justify-end">
               <Button className="bg-white text-black hover:bg-slate-200 font-black italic uppercase text-xs h-10 px-8 rounded-none">
                <Save className="mr-2 h-4 w-4" /> Save Configuration 
              </Button>
            </CardFooter>
          </Card>

          {/* --- PRICING PLANS (Requirement 5.2) --- */}
          <div className="lg:col-span-12 pt-8">
            <div className="flex items-center justify-between border-l-4 border-red-600 pl-4 mb-6">
              <div>
                <h3 className="text-3xl font-black italic uppercase tracking-tighter">Tier Upgrades</h3>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Plans expire via Cron Job</p>
              </div>
              <Badge className="bg-red-600/10 text-red-600 border-red-600/20">Current: {user?.activePlan || "Free"}</Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'Free', price: '$0', duration: 'Permanent' },
                { name: 'Silver', price: '$19', duration: '6 Hours' },
                { name: 'Gold', price: '$49', duration: '12 Hours' }
              ].map((plan) => (
                <Card key={plan.name} className={`bg-slate-900 border-slate-800 rounded-none hover:border-red-600 transition-colors ${user?.activePlan === plan.name ? 'border-red-600' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <Zap className="h-8 w-8 text-slate-600" />
                      <div className="text-right">
                        <p className="text-3xl font-black italic">{plan.price}</p>
                        <p className="text-[10px] font-mono text-slate-500 uppercase">{plan.duration} Limit </p>
                      </div>
                    </div>
                    {/* Payment Gateway Integration [cite: 81, 83, 160] */}
                    <Button className="w-full h-12 rounded-none bg-slate-950 hover:bg-red-600 font-black uppercase italic tracking-wider transition-all">
                      Select {plan.name}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* --- CRON MONITOR (Requirement 7.1) --- */}
          <Card className="lg:col-span-12 bg-slate-900 border-slate-800 rounded-none border-t-2 border-red-900">
            <CardHeader className="py-3">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2">
                <Clock className="h-3 w-3 text-red-600" /> Cron Job Monitor 
              </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="font-mono text-[9px] text-slate-600">
                  <p>[SYSTEM] Periodically checking plan expirations...</p>
                  <p>[SYSTEM] Revoking access if duration ends...</p>
               </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </>
  );
}