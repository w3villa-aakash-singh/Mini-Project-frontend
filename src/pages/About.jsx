import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info, ShieldCheck, Zap, Globe } from "lucide-react";

const About = () => {
  const features = [
    {
      title: "Social Signup & Merge",
      description: "Sign up via Google or Facebook. Existing accounts with the same email are merged automatically[cite: 11, 15].",
      icon: <ShieldCheck className="w-5 h-5 text-blue-500" />,
      tag: "Auth"
    },
    {
      title: "Storj & Google Maps",
      description: "Profile pictures are stored on Storj [cite: 57, 164], and addresses use Google Maps auto-suggestions[cite: 65, 162].",
      icon: <Globe className="w-5 h-5 text-green-500" />,
      tag: "Cloud"
    },
    {
      title: "Time-Limited Plans",
      description: "Choose 1h, 6h, or 12h plans. Access is automatically revoked by a cron job upon expiration[cite: 100, 148].",
      icon: <Zap className="w-5 h-5 text-yellow-500" />,
      tag: "Payments"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Header Section */}
          <section className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Project Overview
            </h1>
            <p className="text-xl text-muted-foreground dark:text-slate-400">
              Detailed requirements for user management and secure access control[cite: 3, 4].
            </p>
          </section>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <CardHeader className="flex flex-row items-center space-x-3 pb-2">
                  {feature.icon}
                  <CardTitle className="text-lg text-slate-900 dark:text-slate-100">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-slate-600 dark:text-slate-400">{feature.description}</p>
                  <Badge variant="secondary" className="dark:bg-slate-800 dark:text-slate-300">{feature.tag}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Admin & Security Section */}
          <Card className="mt-12 border-slate-200 dark:border-slate-800 dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-slate-100">
                <Info className="w-5 h-5 text-blue-400" />
                Administrative Controls [cite: 102]
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
              <p>• Only verified users can access the dashboard after login[cite: 50].</p>
              <p>• Admins have exclusive access to user management, search, and pagination[cite: 112, 117].</p>
              <p>• Plan expiration is handled via a server-side cron job to maintain data integrity[cite: 149].</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;