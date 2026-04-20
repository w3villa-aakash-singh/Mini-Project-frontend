import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  Card, CardContent, CardHeader, CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Avatar, AvatarImage, AvatarFallback
} from "@/components/ui/avatar";
import toast, { Toaster } from "react-hot-toast";

import useAuth from "../../auth/store/store.js";
import {
  updateUserProfile,
  uploadUserImage,
  downloadUserProfile
} from "../services/UserService.js";

import {
  MapContainer, TileLayer, Marker, useMap
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import {
  Camera, Globe, Mail, Save, Download,
  Search, Clock, CreditCard, CheckCircle2
} from "lucide-react";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

/* ------------------ CONFIG ------------------ */

const DEFAULT_COORDS = { lat: 28.6139, lng: 77.2090 };

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

/* ------------------ HELPERS ------------------ */

const fetchJSON = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("API Error");
  return res.json();
};

const formatTimeLeft = (expiry) => {
  const diff = new Date(expiry).getTime() - Date.now();
  if (diff <= 0) return "EXPIRED";

  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  return `${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
};

/* ------------------ MAP HELPER ------------------ */

function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

/* ------------------ COMPONENT ------------------ */

export default function UserLayout() {
  const user = useAuth((s) => s.user);
  const refreshUser = useAuth((s) => s.refreshUser);

  const navigate = useNavigate();
  const location = useLocation();

  const fileInputRef = useRef(null);
  const debounceRef = useRef(null);

  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState(DEFAULT_COORDS);
  const [timeLeft, setTimeLeft] = useState("PERMANENT");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const LOCATION_IQ_KEY = import.meta.env.VITE_LOCATION_IQ_KEY;

  /* ------------------ EFFECTS ------------------ */

  useEffect(() => {
    if (!user) return;

    setAddress(user.formattedAddress || "");
    if (user.latitude && user.longitude) {
      setCoordinates({
        lat: parseFloat(user.latitude),
        lng: parseFloat(user.longitude)
      });
    }
  }, [user]);

  useEffect(() => {
    if (!user?.planExpiry || user?.planType === "FREE") {
      setTimeLeft("PERMANENT");
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(formatTimeLeft(user.planExpiry));
    }, 1000);

    return () => clearInterval(interval);
  }, [user?.planExpiry, user?.planType]);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    if (query.get("payment_success") === "true") {
      refreshUser().then(() => {
        toast.success("Plan upgraded");
        navigate("/profile", { replace: true });
      });
    }
  }, [location.search]);

  /* ------------------ LOCATION ------------------ */

  const updateAddressFromCoords = async (lat, lng) => {
    try {
      const data = await fetchJSON(
        `https://us1.locationiq.com/v1/reverse.php?key=${LOCATION_IQ_KEY}&lat=${lat}&lon=${lng}&format=json`
      );
      setAddress(data.display_name || "");
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setAddress(value);

    if (value.length <= 2) {
      setSuggestions([]);
      return;
    }

    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const data = await fetchJSON(
          `https://us1.locationiq.com/v1/autocomplete.php?key=${LOCATION_IQ_KEY}&q=${value}&format=json`
        );

        setSuggestions(Array.isArray(data) ? data : []);
        setShowSuggestions(true);
      } catch (err) {
        console.error(err);
      }
    }, 400);
  };

  const handleSelectSuggestion = (sug) => {
    setCoordinates({
      lat: parseFloat(sug.lat),
      lng: parseFloat(sug.lon)
    });
    setAddress(sug.display_name);
    setShowSuggestions(false);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude, longitude } = coords;
        setCoordinates({ lat: latitude, lng: longitude });
        await updateAddressFromCoords(latitude, longitude);
      },
      () => toast.error("Location denied")
    );
  };

  /* ------------------ ACTIONS ------------------ */

  const handleSaveConfiguration = async () => {
    const load = toast.loading("Saving...");

    try {
      await updateUserProfile(user.id, {
        formattedAddress: address,
        latitude: coordinates.lat,
        longitude: coordinates.lng
      });

      toast.success("Saved", { id: load });
      refreshUser();
    } catch {
      toast.error("Failed", { id: load });
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const load = toast.loading("Uploading...");

    try {
      await uploadUserImage(user.id, formData);
      toast.success("Updated", { id: load });
      refreshUser();
    } catch {
      toast.error("Failed", { id: load });
    }
  };

  const handleDownloadProfile = async () => {
    toast.promise(
      downloadUserProfile(user.id).then((data) => {
        const url = URL.createObjectURL(new Blob([data]));
        const link = document.createElement("a");
        link.href = url;
        link.download = `Profile_${user?.name}.pdf`;
        link.click();
      }),
      {
        loading: "Generating...",
        success: "Downloaded",
        error: "Failed"
      }
    );
  };

  /* ------------------ UI ------------------ */

  return (
    <>
      <Toaster />

      <div className="p-6 space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="text-4xl font-black">
            {user?.name?.split(" ")[0]} PROFILE
          </h2>

          <Button onClick={handleDownloadProfile}>
            <Download className="mr-2" /> Export
          </Button>
        </div>

        <div className="grid grid-cols-12 gap-6">

          {/* LEFT */}
          <div className="col-span-12 lg:col-span-4 space-y-6">

            <Card className="p-6 text-center rounded-2xl shadow-xl border border-gray-200 relative overflow-hidden">

  {/* Top Accent */}
  <div className="absolute top-0 left-0 w-full h-1 bg-red-600" />

  {/* Avatar with overlay button */}
  <div className="relative w-fit mx-auto">
    <Avatar className="w-32 h-32 ring-4 ring-red-100 shadow-lg">
      <AvatarImage src={user?.image} />
      <AvatarFallback className="text-3xl font-black">
        {user?.name?.[0]}
      </AvatarFallback>
    </Avatar>

    {/* Upload button overlay */}
    <button
      onClick={() => fileInputRef.current?.click()}
      className="absolute bottom-1 right-1 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg transition-all"
    >
      <Camera className="h-4 w-4" />
    </button>
  </div>

  {/* Hidden input */}
  <input
    type="file"
    ref={fileInputRef}
    onChange={handleImageUpload}
    className="hidden"
  />

  {/* Name */}
  <h3 className="mt-4 text-xl font-black uppercase tracking-wide">
    {user?.name}
  </h3>

  {/* Email */}
  <p className="text-sm text-gray-500 flex justify-center items-center gap-2 mt-1">
    <Mail className="h-4 w-4 text-red-500" />
    {user?.email}
  </p>

  {/* Optional badge */}
  <div className="mt-4 inline-block bg-red-50 text-red-600 text-xs font-bold px-3 py-1 rounded-full">
    Active User
  </div>

</Card>

            <Card className="p-6 rounded-2xl shadow-xl border border-gray-200 relative overflow-hidden">

  {/* Top gradient accent */}
  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-red-700" />

  {/* Header */}
  <div className="flex items-center justify-between mb-4">
    <h4 className="font-black uppercase tracking-widest text-sm text-gray-600">
      Current Plan
    </h4>

    <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-50 text-red-600">
      {user?.planType}
    </span>
  </div>

  {/* Plan Name Big */}
  {/* <div className="text-3xl font-black tracking-tight">
    {user?.planType}
  </div> */}

  {/* Divider */}
  <div className="h-px bg-gray-200 my-4" />

  {/* Time left */}
  <div className="flex items-center justify-between">
    <p className="text-sm text-gray-500">Validity</p>
    <p className="font-bold text-gray-800">
      {timeLeft}
    </p>
  </div>


  {/* Button */}
  <Button
    className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest py-3 transition-all"
    onClick={() => navigate("/plans")}
  >
    Upgrade Plan
  </Button>

</Card>
          </div>

          {/* RIGHT */}
          <Card className="col-span-12 lg:col-span-8">

            <CardHeader>
              <Globe /> Location
            </CardHeader>

            <CardContent className="space-y-4">

              {/* SEARCH */}
              <div className="flex gap-2">
                <Input
                  value={address}
                  onChange={handleInputChange}
                  placeholder="Search address"
                />

                <Button onClick={handleUseCurrentLocation}>
                  📍
                </Button>
              </div>

              {/* SUGGESTIONS */}
              {showSuggestions && (
                <div className="border max-h-40 overflow-auto">
                  {suggestions.map((s, i) => (
                    <div
                      key={i}
                      onClick={() => handleSelectSuggestion(s)}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {s.display_name}
                    </div>
                  ))}
                </div>
              )}

              {/* MAP */}
              <div className="h-[400px]">
                <MapContainer
                  center={coordinates}
                  zoom={15}
                  style={{ height: "100%" }}
                >
                  <ChangeView center={coordinates} />
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                  <Marker
                    position={coordinates}
                    draggable
                    eventHandlers={{
                      dragend: (e) => {
                        const { lat, lng } = e.target.getLatLng();
                        setCoordinates({ lat, lng });
                        updateAddressFromCoords(lat, lng);
                      }
                    }}
                  />
                </MapContainer>
              </div>

            </CardContent>

            <CardFooter>
              <Button
                onClick={handleSaveConfiguration}
                className="bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest px-6 py-3 flex items-center gap-2 transition-all"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>

          </Card>
        </div>
      </div>
    </>
  );
}