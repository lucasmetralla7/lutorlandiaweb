import { useState, useEffect } from "react";

export default function ServerStatus() {
  const [serverStatus, setServerStatus] = useState({
    online: true,
    players: { online: 127, max: 500 },
    version: "1.19.2"
  });

  useEffect(() => {
    // In a production environment, you would fetch the actual server status 
    // from a Minecraft server status API
    // This is just a placeholder for demonstration
    const fetchServerStatus = async () => {
      try {
        // Example API call (commented out)
        // const response = await fetch('/api/server-status');
        // const data = await response.json();
        // setServerStatus(data);
      } catch (error) {
        console.error("Error fetching server status:", error);
      }
    };

    fetchServerStatus();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchServerStatus, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-800 py-3">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-3 md:mb-0">
            <div className={`h-3 w-3 rounded-full ${serverStatus.online ? 'bg-green-500 animate-pulse-slow' : 'bg-red-500'} mr-2`}></div>
            <span className="text-gray-300">
              Estado del servidor: 
              <span className={serverStatus.online ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'}>
                {serverStatus.online ? ' En línea' : ' Desconectado'}
              </span>
            </span>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex items-center">
              <i className="fas fa-users text-primary mr-2"></i>
              <span className="text-gray-300">
                Jugadores: <span className="text-white font-semibold">{serverStatus.players.online}/{serverStatus.players.max}</span>
              </span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-gamepad text-primary mr-2"></i>
              <span className="text-gray-300">
                Versiones compatibles: <span className="text-white font-semibold">1.20.4-1.21.4</span>
              <i className="fas fa-clock text-primary mr-2"></i>
              <span className="text-gray-300">
                Última actualización: <span className="text-white font-semibold">v{serverStatus.version}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
