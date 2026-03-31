import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router"; 
import { useAuth } from "../../contex/AuthContex";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { GoogleMap, LoadScript, Autocomplete, MarkerF } from '@react-google-maps/api';
import { 
  Camera, Globe, Mail, Save, Download, Search, Clock, CreditCard, 
  CheckCircle2, ShieldAlert, ArrowUpRight 
} from "lucide-react";

const libraries = ["places"];
const mapContainerStyle = { width: '100%', height: '100%' };

const darkMapStyles = [
  { elementType: "geometry", stylers: [{ color: "#0f172a" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#94a3b8" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0f172a" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#1e293b" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#020617" }] }
];

export default function UserLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const mapRef = useRef(null);

  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: 28.6139, lng: 77.2090 });
  const [autocomplete, setAutocomplete] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (user) {
      if (user.formattedAddress) setAddress(user.formattedAddress);
      if (user.latitude && user.longitude) {
        setCoordinates({
          lat: parseFloat(user.latitude),
          lng: parseFloat(user.longitude)
        });
      }
    }
  }, [user]);

  // --- COUNTDOWN PROTOCOL ---
  useEffect(() => {
    if (user?.planExpiry && user?.planType !== 'FREE') {
      const updateTimer = () => {
        const now = new Date().getTime();
        const expiry = new Date(user.planExpiry).getTime();
        const diff = expiry - now;

        if (diff <= 0) {
          setTimeLeft("EXPIRED");
          // Force reload to sync with backend cron job revocation
          window.location.reload();
          return;
        }

        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        const pad = (n) => n.toString().padStart(2, '0');
        setTimeLeft(`${pad(h)}h ${pad(m)}m ${pad(s)}s`);
      };

      const interval = setInterval(updateTimer, 1000);
      updateTimer();
      return () => clearInterval(interval);
    } else {
      setTimeLeft("PERMANENT");
    }
  }, [user?.planExpiry, user?.planType]);

  const updateAddressFromCoords = async (lat, lng) => {
    try {
      const geocoder = new window.google.maps.Geocoder();
      const latlng = { lat: parseFloat(lat), lng: parseFloat(lng) };
      geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === "OK" && results[0]) {
          setAddress(results[0].formatted_address);
        }
      });
    } catch (error) { console.error(error); }
  };

  const handleLocationUpdate = (lat, lng, isSelection = false) => {
    const newCoords = { lat, lng };
    setCoordinates(newCoords);
    if (mapRef.current) mapRef.current.panTo(newCoords);
    if (!isSelection) updateAddressFromCoords(lat, lng);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setAddress(place.formatted_address || place.name);
        handleLocationUpdate(lat, lng, true);
        toast.success("Coordinates pinpointed.");
      }
    }
  };

  const handleSaveConfiguration = async () => {
    const loadingToast = toast.loading("Syncing profile protocol...");
    try {
      const payload = { ...user, formattedAddress: address, latitude: coordinates.lat, longitude: coordinates.lng };
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/v1/users/${user.id}`, payload);
      toast.success("DATABASE SYNCED.", { id: loadingToast });
    } catch (error) { toast.error("Sync failed.", { id: loadingToast }); }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    const uploadToast = toast.loading("Uploading visual data...");
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/users/${user.id}/upload-image`, formData);
      toast.success("Identity visual updated.", { id: uploadToast });
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) { toast.error("Upload failed.", { id: uploadToast }); }
  };

  const handleDownloadProfile = async () => {
    const downloadPromise = async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/users/${user.id}/download`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Dossier_${user?.name?.replace(/\s+/g, '_')}.pdf`);
      document.body.appendChild(link); link.click(); link.remove();
      return response;
    };
    toast.promise(downloadPromise(), { loading: 'Generating PDF...', success: 'Dossier exported.', error: 'Generation failed.' });
  };
// console.log(user)
  return (
    <>
      <Toaster/>
      <style dangerouslySetInnerHTML={{ __html: `
        .pac-container { background-color: #0f172a !important; border: 1px solid #ef444455 !important; z-index: 9999 !important; border-radius: 0 !important; }
        .pac-item { color: #94a3b8 !important; border-top: 1px solid #1e293b !important; padding: 12px !important; }
        .pac-item-query { color: white !important; }
      `}} />

      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} libraries={libraries}>
        <div className="fixed inset-0 bg-slate-950 text-white p-4 md:p-8 overflow-hidden mt-15 ">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-2 border-red-600 pb-6 mb-8 gap-4">
            <div>
              <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
                {user?.name?.split(' ')[0] || "ADMIN"} <span className="text-red-600 underline decoration-4">PROFILE</span>
              </h2>
              <div className="mt-4 flex items-center gap-2 px-4 py-1.5 rounded-none border bg-green-500/10 border-green-500/20 text-green-500 w-fit">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Identity Verified</span>
              </div>
            </div>
            <Button onClick={handleDownloadProfile} className="bg-red-600 hover:bg-red-700 text-white font-black italic uppercase h-14 px-8 rounded-none skew-x-[-12deg]">
              <Download className="mr-2 h-5 w-5" /> Export [PDF]
            </Button>
          </div>

          <div className="grid grid-cols-12 gap-6 pb-32">
            <div className="col-span-12 lg:col-span-4 space-y-6">
              <Card className="bg-slate-900 border-slate-800 rounded-none p-6 text-center relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-red-600 group-hover:w-2 transition-all"></div>
                <div className="relative inline-block">
                  <Avatar className="w-48 h-48 border-4 ml-48 border-slate-800">
                    <AvatarImage src={user?.image} />
                    <AvatarFallback className="text-4xl bg-slate-800">{user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                  <button onClick={() => fileInputRef.current.click()} className="absolute bottom-2 right-2 p-3 bg-red-600 border-2 border-slate-900">
                    <Camera className="h-5 w-5 text-white" />
                  </button>
                </div>
                <h3 className="mt-4 text-2xl font-black uppercase italic tracking-tight">{user?.name}</h3>
                <p className="font-mono text-slate-400 text-sm flex items-center justify-center gap-2">
                  <Mail className="h-3 w-3" /> {user?.email}
                </p>
              </Card>

              <Card className="bg-slate-900 border-slate-800 rounded-none p-6 relative">
                <div className="flex items-center justify-between mb-4 font-black uppercase italic text-red-500">
                  <h4>System Access</h4>
                  <CreditCard className="h-5 w-5 text-slate-500" />
                </div>
                <div className="bg-slate-950 p-4 border border-slate-800 space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Protocol</span>
                    <span className="text-sm font-black text-white uppercase italic">{user?.planType || "FREE"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Time Remaining</span>
                    <span className={`text-sm font-black flex items-center gap-1 ${timeLeft === "EXPIRED" ? "text-red-600 animate-pulse" : "text-green-500"}`}>
                      <Clock className="h-3 w-3" /> {timeLeft}
                    </span>
                  </div>
                </div>
                <Button onClick={() => navigate('/plans')} className="w-full mt-6 bg-transparent border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-black uppercase italic text-[11px] h-11 rounded-none tracking-tighter transition-all">
                  Upgrade Protocol <ArrowUpRight className="ml-2 h-3 w-3" />
                </Button>
              </Card>
            </div>

            <Card className="col-span-12 lg:col-span-8 bg-slate-900 border-slate-800 rounded-none">
              <CardHeader className="border-b border-slate-800 italic uppercase font-black text-xl flex flex-row items-center gap-2">
                <Globe className="h-5 w-5 text-red-600" /> Geospatial Tracking
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="flex gap-2">
                  <Autocomplete onLoad={setAutocomplete} onPlaceChanged={onPlaceChanged} className="flex-grow">
                    <Input className="bg-slate-950 border-slate-800 text-white font-mono h-12 rounded-none" placeholder="SEARCH COORDINATES..." value={address} onChange={(e) => setAddress(e.target.value)} />
                  </Autocomplete>
                  <Button onClick={() => handleLocationUpdate(coordinates.lat, coordinates.lng)} className="h-12 bg-slate-800 rounded-none px-6"><Search className="h-4 w-4" /></Button>
                </div>
                <div className="w-full h-[400px] bg-slate-950 border border-slate-800 relative">
                  <GoogleMap onLoad={(map) => mapRef.current = map} mapContainerStyle={mapContainerStyle} center={coordinates} zoom={15} options={{ styles: darkMapStyles, disableDefaultUI: true, zoomControl: true }}>
                    <MarkerF position={coordinates} draggable={true} onDragEnd={(e) => handleLocationUpdate(e.latLng.lat(), e.latLng.lng())} />
                  </GoogleMap>
                  <div className="absolute bottom-4 left-4 p-3 bg-slate-900/90 border border-red-600/50 backdrop-blur-sm text-[10px] font-black uppercase text-red-500 font-mono">
                    LAT: {coordinates.lat.toFixed(6)} | LNG: {coordinates.lng.toFixed(6)}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-slate-950/50 p-4 border-t border-slate-800 flex justify-end">
                <Button onClick={handleSaveConfiguration} className="bg-white text-black font-black uppercase rounded-none px-12 h-12 shadow-[4px_4px_0_0_rgba(220,38,38,1)] active:translate-x-1 active:translate-y-1 transition-all">
                  <Save className="mr-2 h-4 w-4" /> Save Configuration
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </LoadScript>
    </>
  );
}