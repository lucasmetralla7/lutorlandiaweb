import { useEffect } from "react";
import StaffMembers from "@/components/StaffMembers";

export default function Staff() {
  useEffect(() => {
    document.title = "Staff - Lutorlandia";
  }, []);

  return (
    <div className="min-h-screen">
      <div className="py-16 bg-gradient-to-b from-primary to-gray-900">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-minecraft text-white mb-8 text-center">EQUIPO DE STAFF</h1>
          <p className="text-xl text-gray-300 mb-12 text-center max-w-3xl mx-auto">
            Conoce al equipo de Staff de Lutorlandia, dedicados a hacer de tu experiencia en el servidor algo inolvidable y divertido.
          </p>
          <StaffMembers extended={true} />
        </div>
      </div>
    </div>
  );
}
