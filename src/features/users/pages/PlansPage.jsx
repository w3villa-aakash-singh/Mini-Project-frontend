import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Crown, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import toast from 'react-hot-toast';

import useAuth from "../../auth/store/store.js";
import { checkoutPlan } from "../../../api.js";

const PLAN_ORDER = ["FREE", "SILVER", "GOLD"];

const PLANS = [
  {
    id: 'SILVER',
    name: 'Silver Plan',
    price: '$5',
    discount: '10% OFF',
    duration: '6 HOURS',
    icon: <Shield className="h-8 w-8 text-blue-500" />,
    features: [
      '10% Discount on Products',
      'Extended Data Access',
      'Verified Badge',
      '6-Hour Session',
      'Standard PDF Export'
    ]
  },
  {
    id: 'GOLD',
    name: 'Gold Plan',
    price: '$10',
    discount: '30% OFF',
    duration: '12 HOURS',
    icon: <Crown className="h-8 w-8 text-yellow-500" />,
    features: [
      '30% Discount on Products',
      'Full Geospatial Access',
      'Priority PDF Generation',
      '12-Hour Session',
      'Global GPS Tracking'
    ]
  }
];

export default function PlansPage() {

  const navigate = useNavigate();
  const location = useLocation();

  const user = useAuth((state) => state.user);
  const refreshUser = useAuth((state) => state.refreshUser);

  const [loadingPlan, setLoadingPlan] = useState(null);

  const isUpgrade = (current, next) => {
    return PLAN_ORDER.indexOf(next) > PLAN_ORDER.indexOf(current);
  };

  useEffect(() => {
    const query = new URLSearchParams(location.search);

    if (query.get("success") === "true") {
      refreshUser?.();
      toast.success("Plan upgraded successfully 🚀");
    }
  }, [location.search]);

  const handleUpgrade = async (planName) => {
    if (!user) {
      toast.error("Please login");
      return;
    }

    if (!isUpgrade(user.planType || "FREE", planName)) {
      toast.error("Downgrade not allowed");
      return;
    }

    const load = toast.loading(`Initializing ${planName}...`);

    try {
      const res = await checkoutPlan({
        planName,
        userId: user.id
      });

      if (res?.data?.url) {
        window.location.href = res.data.url;
      } else {
        toast.error("Payment URL not found", { id: load });
      }

    } catch (error) {
      console.error(error);
      toast.error("Payment failed", { id: load });
    }
  };

  const getButtonState = (planId) => {
    const current = user?.planType || "FREE";

    if (current === planId) return { disabled: true, text: "Current Plan" };
    if (!isUpgrade(current, planId)) return { disabled: true, text: "Not Allowed" };

    return { disabled: false, text: "Upgrade Now" };
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 px-4 py-10">

      <div className="max-w-5xl mx-auto">

        {/* BACK */}
        <Button
          onClick={() => navigate(-1)}
          className="mb-6 bg-white border hover:bg-gray-100 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        {/* TITLE */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold">
            Upgrade Your Plan
          </h1>
          <p className="text-gray-500 mt-2">
            Choose a plan that fits your needs
          </p>
        </div>

        {/* PLANS */}
        <div className="grid md:grid-cols-2 gap-8">

          {PLANS.map((plan) => {
            const btn = getButtonState(plan.id);

            return (
              <Card
                key={plan.id}
                className="border rounded-xl shadow-sm hover:shadow-md transition"
              >

                <CardHeader className="text-center space-y-2">
                  <div className="flex justify-center">
                    {plan.icon}
                  </div>

                  <h2 className="text-xl font-semibold">
                    {plan.name}
                  </h2>

                  <p className="text-3xl font-bold">
                    {plan.price}
                  </p>

                  <span className="text-sm text-green-600 font-medium">
                    {plan.discount}
                  </span>

                  <p className="text-sm text-gray-500">
                    {plan.duration}
                  </p>
                </CardHeader>

                <CardContent className="space-y-2 text-sm text-gray-600">
                  {plan.features.map((f, i) => (
                    <p key={i}>✔ {f}</p>
                  ))}
                </CardContent>

                <CardFooter>
                  <Button
                    onClick={async () => {
                      setLoadingPlan(plan.id);
                      try {
                        await handleUpgrade(plan.id);
                      } finally {
                        setLoadingPlan(null);
                      }
                    }}
                    disabled={btn.disabled || loadingPlan === plan.id}
                    className="w-full bg-red-600 text-white hover:bg-red-700 flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {loadingPlan === plan.id ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      btn.text
                    )}
                  </Button>
                </CardFooter>

              </Card>
            );
          })}

        </div>
      </div>
    </div>
  );
}