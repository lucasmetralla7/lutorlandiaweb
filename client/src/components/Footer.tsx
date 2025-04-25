import { Link } from "wouter";
import { copyToClipboard } from "@/lib/utils";

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <img src="https://i.imgur.com/uXFUkqf.png" alt="Lutorlandia Logo" className="h-12 mb-4" />
            <p className="text-gray-400 mb-4">
              Servidor de Minecraft con una gran comunidad, eventos constantes y experiencias únicas para todos los jugadores.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://discord.gg/ZAQ3bGmqg6" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <i className="fab fa-discord"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Enlaces rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <div className="text-gray-400 hover:text-white cursor-pointer">Inicio</div>
<<<<<<< HEAD
=======
                  <a className="text-gray-400 hover:text-white">Inicio</a>
>>>>>>> 197055a3 (Solucionando conflictos y actualizando)
                </Link>
              </li>
              <li>
                <Link href="/staff">
                  <div className="text-gray-400 hover:text-white cursor-pointer">Staff</div>
<<<<<<< HEAD
=======
                  <a className="text-gray-400 hover:text-white">Staff</a>
>>>>>>> 197055a3 (Solucionando conflictos y actualizando)
                </Link>
              </li>
              <li>
                <a href="https://tienda.lutorlandia.net" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                  Tienda
                </a>
              </li>
              <li>
                <a href="https://discord.gg/ZAQ3bGmqg6" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                  Discord
                </a>
              </li>
              <li>
                <Link href="/reglas">
                  <div className="text-gray-400 hover:text-white cursor-pointer">Reglas</div>
                </Link>
<<<<<<< HEAD
=======
                <a href="#" className="text-gray-400 hover:text-white">
                  Reglas
                </a>
>>>>>>> 197055a3 (Solucionando conflictos y actualizando)
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Información del servidor</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
                <span className="text-gray-300">
                  IP: <span className="text-accent font-bold cursor-pointer hover:text-white" onClick={() => copyToClipboard('mc.lutorlandia.net')}>mc.lutorlandia.net</span>
                </span>
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
                <span className="text-gray-300">Versiones compatibles: <span className="text-white font-semibold">1.20.4-1.21.4</span></span>
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-300">Web: <span className="text-white font-semibold">lutorlandia.net</span></span>
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-300">Contacto: <span className="text-white font-semibold">contacto@lutorlandia.net</span></span>
<<<<<<< HEAD
=======
                <i className="fas fa-server text-primary mr-2"></i>
                <span className="text-gray-400">
                  IP: <span className="text-white cursor-pointer hover:text-primary" onClick={() => copyToClipboard('mc.lutorlandia.net')}>mc.lutorlandia.net</span>
                </span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-gamepad text-primary mr-2"></i>
                <span className="text-gray-400">Versión: <span className="text-white">1.19.2</span></span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-globe text-primary mr-2"></i>
                <span className="text-gray-400">Web: <span className="text-white">lutorlandia.net</span></span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-envelope text-primary mr-2"></i>
                <span className="text-gray-400">Contacto: <span className="text-white">contacto@lutorlandia.net</span></span>
>>>>>>> 197055a3 (Solucionando conflictos y actualizando)
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-500">&copy; 2025 Lutorlandia. Todos los derechos reservados.</p>
          <p className="text-gray-600 text-sm mt-2">
            Minecraft es una marca registrada de Mojang AB / Microsoft. Este sitio no está afiliado con Mojang AB / Microsoft.
<<<<<<< HEAD
=======
          <p className="text-gray-500">&copy; {new Date().getFullYear()} Lutorlandia. Todos los derechos reservados.</p>
          <p className="text-gray-600 text-sm mt-2">
            Minecraft es una marca registrada de Mojang AB. Este sitio no está afiliado con Mojang.
>>>>>>> 197055a3 (Solucionando conflictos y actualizando)
          </p>
        </div>
      </div>
    </footer>
  );
}
