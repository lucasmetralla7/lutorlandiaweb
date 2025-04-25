import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { copyToClipboard } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import AnimatedStoreButton from "./AnimatedStoreButton";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav className={`sticky top-0 z-50 bg-primary ${isScrolled ? 'bg-opacity-90 backdrop-blur-md shadow-lg' : 'bg-opacity-100'} border-b border-gray-800 transition-all duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <div className="flex-shrink-0 cursor-pointer">
                <img className="h-10" src="https://i.imgur.com/uXFUkqf.png" alt="Lutorlandia Logo" />
              </div>
<<<<<<< HEAD
=======
              <a className="flex-shrink-0">
                <img className="h-10" src="https://i.imgur.com/uXFUkqf.png" alt="Lutorlandia Logo" />
              </a>
>>>>>>> 197055a3 (Solucionando conflictos y actualizando)
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-center space-x-4">
                <Link href="/">
                  <div className={`px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${location === '/' ? 'text-white bg-gray-800' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
                    INICIO
                  </div>
                </Link>
                <Link href="/staff">
                  <div className={`px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${location === '/staff' ? 'text-white bg-gray-800' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
                    STAFF
                  </div>
                </Link>
                <Link href="/reglas">
                  <div className={`px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${location === '/reglas' ? 'text-white bg-gray-800' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
                    REGLAS
                  </div>
                </Link>
                <Link href="/bugs">
                  <div className={`px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${location === '/bugs' ? 'text-white bg-gray-800' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
                    BUGS
                  </div>
                </Link>
                <Link href="/admin">
                  <div className={`px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${location === '/admin' ? 'text-white bg-gray-800' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
                    PANEL
                  </div>
<<<<<<< HEAD
=======
                  <a className={`px-3 py-2 rounded-md text-sm font-medium ${location === '/' ? 'text-white bg-gray-800' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
                    INICIO
                  </a>
                </Link>
                <Link href="/staff">
                  <a className={`px-3 py-2 rounded-md text-sm font-medium ${location === '/staff' ? 'text-white bg-gray-800' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
                    STAFF
                  </a>
>>>>>>> 197055a3 (Solucionando conflictos y actualizando)
                </Link>
              </div>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <div className="bg-gray-800 px-3 py-2 rounded-md flex items-center">
              <span className="font-mono font-medium text-sm mr-2">mc.lutorlandia.net</span>
              <button className="text-gray-400 hover:text-white" title="Copiar IP" onClick={() => copyToClipboard('mc.lutorlandia.net')}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
            <a href="https://discord.gg/ZAQ3bGmqg6" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1" data-discord-id="268385683956170752">
              <svg className="h-4 w-4" viewBox="0 0 71 55" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z" />
              </svg>
              DISCORD
            </a>
            <AnimatedStoreButton 
              url="https://tienda.lutorlandia.net" 
              text="TIENDA" 
            />
<<<<<<< HEAD
=======
            <a href="https://discord.gg/ZAQ3bGmqg6" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
              <i className="fab fa-discord mr-1"></i> DISCORD
            </a>
            <a href="https://tienda.lutorlandia.net" target="_blank" rel="noopener noreferrer">
              <Button variant="store" size="default">
                TIENDA
              </Button>
            </a>
>>>>>>> 197055a3 (Solucionando conflictos y actualizando)
          </div>
          
          <div className="md:hidden flex items-center">
            <button 
              type="button" 
              className="text-gray-400 hover:text-white focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden bg-gray-800 border-t border-gray-700 ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link href="/">
            <div className={`block px-3 py-2 rounded-md text-base font-medium cursor-pointer ${location === '/' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
              INICIO
            </div>
          </Link>
          <Link href="/staff">
            <div className={`block px-3 py-2 rounded-md text-base font-medium cursor-pointer ${location === '/staff' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
              STAFF
            </div>
          </Link>
          <Link href="/reglas">
            <div className={`block px-3 py-2 rounded-md text-base font-medium cursor-pointer ${location === '/reglas' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
              REGLAS
            </div>
          </Link>
          <Link href="/bugs">
            <div className={`block px-3 py-2 rounded-md text-base font-medium cursor-pointer ${location === '/bugs' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
              BUGS
            </div>
          </Link>
          <Link href="/admin">
            <div className={`block px-3 py-2 rounded-md text-base font-medium cursor-pointer ${location === '/admin' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
              PANEL
            </div>
          </Link>
          <a href="https://discord.gg/ZAQ3bGmqg6" target="_blank" rel="noopener noreferrer" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white flex items-center gap-1" data-discord-id="268385683956170752">
            <svg className="h-4 w-4" viewBox="0 0 71 55" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z" />
            </svg>
            DISCORD
          </a>
          <div className="px-3 py-2">
            <AnimatedStoreButton
              url="https://tienda.lutorlandia.net"
              text="TIENDA"
            />
          </div>
          <div className="mt-3 px-3 py-2 border border-gray-700 rounded-md bg-gray-800">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm font-bold text-accent">mc.lutorlandia.net</span>
              <button className="text-accent hover:text-white" onClick={() => copyToClipboard('mc.lutorlandia.net')}>
<<<<<<< HEAD
=======
            <a className={`block px-3 py-2 rounded-md text-base font-medium ${location === '/' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
              INICIO
            </a>
          </Link>
          <Link href="/staff">
            <a className={`block px-3 py-2 rounded-md text-base font-medium ${location === '/staff' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
              STAFF
            </a>
          </Link>
          <a href="https://discord.gg/ZAQ3bGmqg6" target="_blank" rel="noopener noreferrer" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
            DISCORD
          </a>
          <a href="https://tienda.lutorlandia.net" target="_blank" rel="noopener noreferrer" className="block px-3 py-2 rounded-md text-base font-medium text-accent font-bold hover:bg-gray-700">
            TIENDA
          </a>
          <div className="mt-3 px-3 py-2 border border-gray-700 rounded-md">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm text-gray-300">mc.lutorlandia.net</span>
              <button className="text-gray-400 hover:text-white" onClick={() => copyToClipboard('mc.lutorlandia.net')}>
>>>>>>> 197055a3 (Solucionando conflictos y actualizando)
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
