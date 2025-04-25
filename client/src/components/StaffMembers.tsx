import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
interface StaffMember {
  id: number;
  name: string;
  role: string;
  roleLabel: string;
  description: string;
  avatar: string;
}
interface StaffMembersProps {
  extended?: boolean;
}
export default function StaffMembers({ extended = false }: StaffMembersProps) {
  const [timestamp, setTimestamp] = useState(Date.now()); // Usar para invalidar caché
  // Actualizar timestamp cada 5 segundos para forzar recarga si es necesario
  useEffect(() => {
    const interval = setInterval(() => {
      setTimestamp(Date.now());
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/staff', timestamp],
    queryFn: async () => {
      const response = await fetch('/api/staff?t=' + timestamp);
      if (!response.ok) {
        throw new Error('Error cargando miembros del staff');
      }
      
      const data = await response.json();
      console.log('Staff data from API:', data);
      return data;
    },
    staleTime: 0,
    cacheTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });
  
  // Asegurarse de que data sea siempre un array
  const members: StaffMember[] = Array.isArray(data) ? data : [];
  
  console.log('Staff members after processing:', members);
  
  // Limitar a 4 en la página principal
  const displayMembers = extended ? members : members.slice(0, 4);
  const getBadgeColor = (roleLabel: string) => {
    switch (roleLabel) {
      case 'OWNER': return 'bg-red-500';
      case 'ADMIN': return 'bg-orange-500';
      case 'SRMOD': return 'bg-yellow-500';
      case 'MOD': return 'bg-purple-500';
      case 'HELPER': return 'bg-blue-500';
      case 'DEV': return 'bg-green-500';
      case 'BUILDER': return 'bg-emerald-500';
      default: return 'bg-gray-500';
    }
  };
  if (error) {
    console.error("Error loading staff members:", error);
  }
  if (!extended) {
    return (
      <section id="staff" className="py-16 bg-gradient-to-b from-gray-900 to-primary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-minecraft text-white mb-12 text-center">NUESTRO STAFF</h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
          ) : members.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-white text-lg">No hay miembros del staff disponibles actualmente.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayMembers.map((member) => (
                <div key={member.id} className="bg-gray-800 rounded-lg p-6 text-center overflow-hidden pixel-border">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <img src={member.avatar} alt={member.name} className="rounded-lg" />
                    <div className={`absolute -top-1 -right-1 ${getBadgeColor(member.roleLabel)} text-xs text-white px-2 py-1 rounded-md`}>
                      {member.roleLabel}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                  <p className="text-gray-400 mb-3">{member.role}</p>
                  <p className="text-gray-300 text-sm">{member.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }
  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      ) : members.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-white text-lg">No hay miembros del staff disponibles actualmente.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayMembers.map((member) => (
            <div key={member.id} className="bg-gray-800 rounded-lg p-6 text-center overflow-hidden pixel-border">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <img src={member.avatar} alt={member.name} className="rounded-lg" />
                <div className={`absolute -top-1 -right-1 ${getBadgeColor(member.roleLabel)} text-xs text-white px-2 py-1 rounded-md`}>
                  {member.roleLabel}
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
              <p className="text-gray-400 mb-3">{member.role}</p>
              <p className="text-gray-300 text-sm">{member.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
<<<<<<< HEAD
}
=======
}
import { useState, useEffect } from "react";

interface StaffMember {
  id: number;
  name: string;
  role: string;
  roleLabel: 'ADMIN' | 'MOD' | 'HELPER' | 'DEV';
  description: string;
  avatar: string;
}

interface StaffMembersProps {
  extended?: boolean;
}

export default function StaffMembers({ extended = false }: StaffMembersProps) {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([
    {
      id: 1,
      name: "LutorKing",
      role: "Fundador",
      roleLabel: "ADMIN",
      description: "Administrador principal y creador del servidor.",
      avatar: "https://mc-heads.net/avatar/MHF_Steve/100.png"
    },
    {
      id: 2,
      name: "MinecraftPro",
      role: "Moderador",
      roleLabel: "MOD",
      description: "Encargado de mantener el orden y ayudar a los jugadores.",
      avatar: "https://mc-heads.net/avatar/MHF_Alex/100.png"
    },
    {
      id: 3,
      name: "Crafteo",
      role: "Ayudante",
      roleLabel: "HELPER",
      description: "Asistente para nuevos jugadores y soporte general.",
      avatar: "https://mc-heads.net/avatar/DigMinecraft/100.png"
    },
    {
      id: 4,
      name: "PixelMaster",
      role: "Desarrollador",
      roleLabel: "DEV",
      description: "Creador de plugins y funcionalidades exclusivas.",
      avatar: "https://mc-heads.net/avatar/Notch/100.png"
    }
  ]);

  // Extended staff members for the Staff page
  const extendedStaffMembers: StaffMember[] = [
    ...staffMembers,
    {
      id: 5,
      name: "BuilderKing",
      role: "Constructor",
      roleLabel: "DEV",
      description: "Especialista en construcciones y diseño de mapas.",
      avatar: "https://mc-heads.net/avatar/Jeb_/100.png"
    },
    {
      id: 6,
      name: "EventManager",
      role: "Organizador",
      roleLabel: "MOD",
      description: "Encargado de planificar y ejecutar eventos especiales.",
      avatar: "https://mc-heads.net/avatar/Dinnerbone/100.png"
    },
    {
      id: 7,
      name: "SupportMaster",
      role: "Soporte",
      roleLabel: "HELPER",
      description: "Especialista en atención al jugador y resolución de problemas.",
      avatar: "https://mc-heads.net/avatar/Herobrine/100.png"
    },
    {
      id: 8,
      name: "ContentCreator",
      role: "Creador de Contenido",
      roleLabel: "MOD",
      description: "Responsable de crear y compartir contenido del servidor.",
      avatar: "https://mc-heads.net/avatar/Grumm/100.png"
    }
  ];

  useEffect(() => {
    // In a production environment, you would fetch staff members from an API
    const fetchStaffMembers = async () => {
      try {
        // Example API call (commented out)
        // const response = await fetch('/api/staff');
        // const data = await response.json();
        // setStaffMembers(data);
      } catch (error) {
        console.error("Error fetching staff members:", error);
      }
    };

    fetchStaffMembers();
  }, []);

  const getBadgeColor = (roleLabel: string) => {
    switch (roleLabel) {
      case 'ADMIN': return 'bg-red-500';
      case 'MOD': return 'bg-purple-500';
      case 'HELPER': return 'bg-blue-500';
      case 'DEV': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const displayedMembers = extended ? extendedStaffMembers : staffMembers;

  if (!extended) {
    return (
      <section id="staff" className="py-16 bg-gradient-to-b from-gray-900 to-primary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-minecraft text-white mb-12 text-center">NUESTRO STAFF</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedMembers.map((member) => (
              <div key={member.id} className="bg-gray-800 rounded-lg p-6 text-center overflow-hidden pixel-border">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <img src={member.avatar} alt={member.name} className="rounded-lg" />
                  <div className={`absolute -top-1 -right-1 ${getBadgeColor(member.roleLabel)} text-xs text-white px-2 py-1 rounded-md`}>
                    {member.roleLabel}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                <p className="text-gray-400 mb-3">{member.role}</p>
                <p className="text-gray-300 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {displayedMembers.map((member) => (
        <div key={member.id} className="bg-gray-800 rounded-lg p-6 text-center overflow-hidden pixel-border">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <img src={member.avatar} alt={member.name} className="rounded-lg" />
            <div className={`absolute -top-1 -right-1 ${getBadgeColor(member.roleLabel)} text-xs text-white px-2 py-1 rounded-md`}>
              {member.roleLabel}
            </div>
          </div>
          <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
          <p className="text-gray-400 mb-3">{member.role}</p>
          <p className="text-gray-300 text-sm">{member.description}</p>
        </div>
      ))}
    </div>
  );
}
>>>>>>> 197055a3 (Solucionando conflictos y actualizando)
