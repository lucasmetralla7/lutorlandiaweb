import Hero from "@/components/Hero";
import ServerStatus from "@/components/ServerStatus";
import Announcements from "@/components/Announcements";
import Features from "@/components/Features";
import StaffMembers from "@/components/StaffMembers";
import DiscordSection from "@/components/DiscordSection";
import CallToAction from "@/components/CallToAction";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    document.title = "Lutorlandia - Servidor de Minecraft";
  }, []);

  return (
    <div className="min-h-screen">
      <Hero />
      <ServerStatus />
      <Announcements />
      <Features />
      <StaffMembers />
      <DiscordSection />
      <CallToAction />
    </div>
  );
}
