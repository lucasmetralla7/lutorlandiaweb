import { Button } from "@/components/ui/button";
import { copyToClipboard } from "@/lib/utils";

export default function Hero() {
  return (
    <section 
      className="relative bg-cover bg-center h-[500px] flex items-center" 
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1579547945413-497e1b99dac0?w=1200')" }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      
      <div className="container mx-auto px-4 z-10 text-center">
        <img 
          src="https://i.imgur.com/uXFUkqf.png" 
          alt="Lutorlandia Logo" 
          className="mx-auto h-32 mb-6 floating"
        />
        <h1 className="text-4xl md:text-5xl font-minecraft text-white mb-4">LUTORLANDIA</h1>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          El mejor servidor de Minecraft con eventos, minijuegos y una gran comunidad de jugadores.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-lg px-6 py-3 flex items-center justify-center">
            <span className="font-mono font-bold text-xl text-accent mr-2">mc.lutorlandia.net</span>
            <button 
              className="text-accent hover:text-white text-lg" 
              title="Copiar IP" 
              onClick={() => copyToClipboard('mc.lutorlandia.net')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
<<<<<<< HEAD
=======
            <span className="font-mono font-bold text-xl text-primary mr-2">mc.lutorlandia.net</span>
            <button 
              className="text-gray-400 hover:text-white text-lg" 
              title="Copiar IP" 
              onClick={() => copyToClipboard('mc.lutorlandia.net')}
            >
              <i className="fas fa-copy"></i>
>>>>>>> 197055a3 (Solucionando conflictos y actualizando)
            </button>
          </div>
          
          <a 
            href="https://tienda.lutorlandia.net" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button variant="minecraft" size="lg">
              VISITAR TIENDA
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
