import { Button } from "@/components/ui/button";
import { copyToClipboard } from "@/lib/utils";

export default function CallToAction() {
  return (
    <section className="py-16 bg-cover bg-center relative" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1558877385-81a1c7b67d9b?w=1200')" }}>
      <div className="absolute inset-0 bg-primary bg-opacity-80"></div>
      
      <div className="container mx-auto px-4 z-10 relative">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-minecraft text-white mb-6">¿LISTO PARA JUGAR?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Únete a Lutorlandia y forma parte de una de las comunidades más divertidas de Minecraft. ¡Te esperamos!
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <div className="bg-gray-800 bg-opacity-90 rounded-lg px-6 py-3 flex items-center justify-center">
              <span className="font-mono font-bold text-xl text-white mr-2">mc.lutorlandia.net</span>
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
      </div>
    </section>
  );
}
