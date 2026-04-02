import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router";
import { useAuth } from "../../contex/AuthContex";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

// --- LEAFLET IMPORTS ---
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// --- LUCIDE ICONS ---
import {
  Camera, Globe, Mail, Save, Download, Search, Clock, CreditCard,
  CheckCircle2
} from "lucide-react";

// Fix for Leaflet default marker icons in React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;


// Helper to handle map panning
function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}


export default function UserLayout() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);
  const debounceRef = useRef(null);

  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: 28.6139, lng: 77.2090 });
  const [timeLeft, setTimeLeft] = useState("");

  // Suggestion State
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Key from your .env
  const LOCATION_IQ_KEY = import.meta.env.VITE_LOCATION_IQ_KEY;

  // Sync User Data from Auth Context
  useEffect(() => {
    if (!user) return;
    if (user.formattedAddress) setAddress(user.formattedAddress);
    if (user.latitude && user.longitude) {
      setCoordinates({
        lat: parseFloat(user.latitude),
        lng: parseFloat(user.longitude)
      });
    }
  }, [user]);

  // Payment Success Handshake
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    if (query.get("payment_success") === "true") {
      const syncUpgrade = async () => {
        const loadingToast = toast.loading("Verifying Protocol Upgrade...");
        try {
          await refreshUser();
          toast.success("SYSTEM UPGRADED TO GOLD ACCESS", { id: loadingToast });
          navigate('/profile', { replace: true });
        } catch {
          toast.error("Handshake failed. Refresh manually.", { id: loadingToast });
        }
      };
      syncUpgrade();
    }
  }, [location.search, refreshUser, navigate]);

  // Plan Expiry Timer logic
  useEffect(() => {
    if (user?.planExpiry && user?.planType !== 'FREE') {
      const updateTimer = () => {
        const diff = new Date(user.planExpiry).getTime() - Date.now();
        if (diff <= 0) {
          setTimeLeft("EXPIRED");
          return;
        }
        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        const pad = (n) => String(n).padStart(2, '0');
        setTimeLeft(`${pad(h)}h ${pad(m)}m ${pad(s)}s`);
      };
      const interval = setInterval(updateTimer, 1000);
      updateTimer();
      return () => clearInterval(interval);
    } else {
      setTimeLeft("PERMANENT");
    }
  }, [user?.planExpiry, user?.planType]);

  // --- LOCATION LOGIC ---

  const updateAddressFromCoords = async (lat, lng) => {
    try {
      const url = `https://us1.locationiq.com/v1/reverse.php?key=${LOCATION_IQ_KEY}&lat=${lat}&lon=${lng}&format=json`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.display_name) setAddress(data.display_name);
    } catch (err) {
      console.error("Reverse Geocode failed", err);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setAddress(value);

    if (value.length > 2) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(async () => {
        try {
          const url = `https://us1.locationiq.com/v1/autocomplete.php?key=${LOCATION_IQ_KEY}&q=${value}&format=json`;
          const res = await fetch(url);
          const data = await res.json();
          if (Array.isArray(data)) {
            setSuggestions(data);
            setShowSuggestions(true);
          }
        } catch (err) {
          console.error("Autocomplete error", err);
        }
      }, 400);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (sug) => {
    const newCoords = { lat: parseFloat(sug.lat), lng: parseFloat(sug.lon) };
    setCoordinates(newCoords);
    setAddress(sug.display_name);
    setSuggestions([]);
    setShowSuggestions(false);
    toast.success("Target Locked.");
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }

    const loadingToast = toast.loading("Fetching current location...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        const newCoords = { lat, lng };

        setCoordinates(newCoords);              // move map
        await updateAddressFromCoords(lat, lng); // update input

        toast.success("Current location loaded", { id: loadingToast });
      },
      (error) => {
        toast.error("Permission denied", { id: loadingToast });
        console.error(error);
      }
    );
  };

  const handleSaveConfiguration = async () => {
    const loadingToast = toast.loading("Syncing profile protocol...");
    try {
      // Ensure the payload matches your backend DTO exactly
      const payload = {
        ...user,
        formattedAddress: address, // This matches the "formatted_address" field in your Hibernate logs
        latitude: coordinates.lat,
        longitude: coordinates.lng
      };

      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/v1/users/${user.id}`, payload);
      toast.success("DATABASE SYNCED.", { id: loadingToast });
      if (refreshUser) await refreshUser();
    } catch (err) {
      toast.error("Sync failed. Check connection.", { id: loadingToast });
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    const uploadToast = toast.loading("Uploading visual data...");
    try {
      const token = localStorage.getItem("accessToken");
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/users/${user.id}/upload-image`, formData, {
        headers: { ...(token && { 'Authorization': `Bearer ${token}` }) }
      });
      toast.success("Identity visual updated.", { id: uploadToast });
      if (refreshUser) await refreshUser();
    } catch (error) {
      toast.error("Upload failed.", { id: uploadToast });
    }
  };

  const handleDownloadProfile = async () => {
    const downloadPromise = async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/users/${user.id}/download`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `Dossier_${user?.name?.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    };
    toast.promise(downloadPromise(), { loading: 'Generating PDF...', success: 'Dossier exported.', error: 'Generation failed.' });
  };

  const isAdmin = user?.roles?.some(r => r.name === "ROLE_ADMIN");

  return (
    <>
      <Toaster />

      <style dangerouslySetInnerHTML={{
        __html: `
        .leaflet-container { z-index: 0 !important; cursor: crosshair !important; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      ` }} />

      <div className="fixed inset-0 bg-slate-950 text-white p-4 md:p-8 overflow-y-scroll mt-15 no-scrollbar">

        {/* Header UI */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-2 border-red-600 pb-6 mb-8 gap-4">
          <div>
            <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
              {user?.name?.split(' ')[0] || "USER"} <span className="text-red-600 underline decoration-4">PROFILE</span>
            </h2>
            <div className="mt-4 flex items-center gap-2 px-4 py-1.5 border bg-green-500/10 border-green-500/20 text-green-500 w-fit">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Identity Verified</span>
            </div>
          </div>
          <Button onClick={handleDownloadProfile} className="bg-red-600 hover:bg-red-700 text-white font-black italic uppercase h-14 px-8 rounded-none skew-x-[-12deg]">
            <Download className="mr-2 h-5 w-5" /> Export [PDF]
          </Button>
        </div>

        <div className="grid grid-cols-12 gap-6 pb-32">
          {/* Sidebar */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <Card className="bg-slate-900 border-slate-800 p-6 text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-red-600 group-hover:w-2 transition-all"></div>
              <div className="relative inline-block">
                <Avatar className="w-48 h-48 border-4 border-slate-800">
                  <AvatarImage src={user?.image} />
                  <AvatarFallback className="text-4xl bg-slate-800">{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-2 right-2 p-3 bg-red-600 border-2 border-slate-900">
                  <Camera className="h-5 w-5 text-white" />
                </button>
              </div>
              <h3 className="mt-4 text-2xl font-black uppercase italic tracking-tight">{user?.name}</h3>
              <p className="font-mono text-slate-400 text-sm flex items-center justify-center gap-2"><Mail className="h-3 w-3" /> {user?.email}</p>
            </Card>

            <Card className="bg-slate-900 border-slate-800 p-6">
              <div className="flex items-center justify-between mb-4 font-black uppercase italic text-red-500">
                <h4>System Access</h4>
                <CreditCard className="h-5 w-5 text-slate-500" />
              </div>
              <div className="bg-slate-950 p-4 border border-slate-800 space-y-4">
                <div className="flex justify-between border-b border-slate-900 pb-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Protocol</span>
                  <span className="text-sm font-black uppercase italic">{user?.planType || "FREE"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Time Remaining</span>
                  <span className={`text-sm font-black flex items-center gap-1 ${timeLeft === "EXPIRED" ? "text-red-600 animate-pulse" : "text-green-500"}`}>
                    <Clock className="h-3 w-3" /> {timeLeft}
                  </span>
                </div>
              </div>
              <Button onClick={() => navigate('/plans')} className="w-full mt-6 bg-red-600 text-white border-2 border-red-600 hover:bg-transparent hover:text-red-600 font-black uppercase italic text-[11px] h-11 rounded-none transition-all duration-300">
                Upgrade Protocol
              </Button>
              {isAdmin && (
                <Button onClick={() => navigate('/admin/users')} className="w-full mt-3 bg-blue-500 text-white border-2 border-blue-500 hover:bg-transparent hover:text-blue-500 font-black uppercase italic text-[11px] h-11 rounded-none transition-all duration-300">
                  Admin Panel
                </Button>
              )}
            </Card>
          </div>

          {/* Map & Geospatial Tracking */}
          <Card className="col-span-12 lg:col-span-8 bg-slate-900 border-slate-800">
            <CardHeader className="border-b border-slate-800 italic uppercase font-black text-xl flex items-center gap-2">
              <Globe className="h-5 w-5 text-red-600" /> Geospatial Tracking
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Input with Custom Autocomplete */}
              <div className="flex flex-col sm:flex-row gap-2 relative">
                <div className="relative flex-1">
                  <Input
                    className="bg-slate-950 border-slate-800 text-white font-mono h-12 w-full focus:ring-red-600"
                    placeholder="SEARCH ADDRESS..."
                    value={address}
                    onChange={handleInputChange}
                    onFocus={() => address.length > 2 && setShowSuggestions(true)}
                  />

                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 w-full bg-slate-900 border border-red-600/50 mt-1 z-[2000] max-h-60 overflow-y-auto shadow-2xl">
                      {suggestions.map((sug, idx) => (
                        <div
                          key={idx}
                          className="p-3 hover:bg-red-600/20 cursor-pointer border-b border-slate-800 text-[11px] font-mono text-slate-300 hover:text-white"
                          onClick={() => handleSelectSuggestion(sug)}
                        >
                          {sug.display_name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 🔥 NEW BUTTON */}
                <Button
                  onClick={handleUseCurrentLocation}
                  className="h-12 px-4 rounded-none border border-slate-700 bg-slate-800 hover:bg-red-600 hover:text-white transition-all"
                >
                  📍
                </Button>

                {/* existing search button */}
                <Button className="h-12 bg-slate-800 px-6 shrink-0 rounded-none border border-slate-700">
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              {/* Map Engine */}
              <div className="w-full h-[300px] sm:h-[400px] bg-slate-950 border border-slate-800 relative z-0">
                <MapContainer
                  center={coordinates}
                  zoom={15}
                  style={{ height: '100%', width: '100%' }}
                  zoomControl={false}
                >
                  <ChangeView center={coordinates} />
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; OpenStreetMap'
                  />
                  <Marker
                    position={coordinates}
                    draggable={true}
                    eventHandlers={{
                      dragend: (e) => {
                        const marker = e.target;
                        const position = marker.getLatLng();
                        const newCoords = { lat: position.lat, lng: position.lng };
                        setCoordinates(newCoords);
                        updateAddressFromCoords(position.lat, position.lng);
                      },
                    }}
                  />
                </MapContainer>

                <div className="absolute bottom-4 left-4 p-3 bg-slate-900/90 border border-red-600/50 text-[10px] font-black uppercase text-red-500 font-mono z-[1000]">
                  LAT: {coordinates.lat.toFixed(6)} | LNG: {coordinates.lng.toFixed(6)}
                </div>
              </div>
            </CardContent>

            <CardFooter className="bg-slate-950/50 p-4 border-t border-slate-800 flex justify-end">
              <Button onClick={handleSaveConfiguration} className="bg-white text-black font-black uppercase px-12 h-12 hover:bg-red-600 hover:text-white transition-all rounded-none">
                <Save className="mr-2 h-4 w-4" /> Save Configuration
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}