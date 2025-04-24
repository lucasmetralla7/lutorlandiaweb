import { Button } from "@/components/ui/button";

export default function DiscordSection() {
  return (
    <section className="py-16 bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute transform rotate-12 -right-10 top-10 h-40 w-40 bg-blue-500 rounded-lg"></div>
        <div className="absolute transform -rotate-12 -left-10 bottom-10 h-40 w-40 bg-purple-500 rounded-lg"></div>
      </div>
      
      <div className="container mx-auto px-4 z-10 relative">
        <div className="flex flex-col lg:flex-row items-center justify-between bg-gray-800 rounded-xl p-8 shadow-lg">
          <div className="mb-8 lg:mb-0 lg:mr-8">
            <h2 className="text-3xl font-minecraft text-white mb-4">ÚNETE A NUESTRO DISCORD</h2>
            <p className="text-gray-300 mb-6 max-w-xl">
              Forma parte de nuestra comunidad en Discord, donde podrás estar al tanto de todas las novedades, participar en eventos y conocer a otros jugadores.
            </p>
            <a 
              href="https://discord.gg/ZAQ3bGmqg6" 
              target="_blank" 
              rel="noopener noreferrer"
              data-discord-id="268385683956170752"
            >
              <Button className="inline-flex items-center bg-[#5865F2] hover:bg-[#4752C4]">
                <i className="fab fa-discord mr-2 text-xl"></i>
                UNIRSE AL DISCORD
              </Button>
            </a>
          </div>
          
          <div className="lg:w-1/3">
            <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg border border-gray-700">
              <div className="bg-[#5865F2] px-4 py-3 flex items-center">
                <i className="fab fa-discord text-white mr-2"></i>
                <span className="text-white font-semibold">Discord de Lutorlandia</span>
              </div>
              
              <div className="p-4">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                    <i className="fas fa-users text-gray-400"></i>
                  </div>
                  <div className="ml-3">
                    <div className="text-white font-medium">Miembros online</div>
                    <div className="text-green-400 text-sm">325 conectados ahora</div>
                  </div>
                </div>
                
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                    <i className="fas fa-hashtag text-gray-400"></i>
                  </div>
                  <div className="ml-3">
                    <div className="text-white font-medium">Canales</div>
                    <div className="text-gray-400 text-sm">anuncios, chat-general, ayuda</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                    <i className="fas fa-microphone text-gray-400"></i>
                  </div>
                  <div className="ml-3">
                    <div className="text-white font-medium">Canales de voz</div>
                    <div className="text-gray-400 text-sm">general, survival, minijuegos</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
