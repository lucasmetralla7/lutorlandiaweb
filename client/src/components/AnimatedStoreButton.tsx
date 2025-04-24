import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

type AnimatedStoreButtonProps = {
  className?: string;
  url: string;
  text: string;
};

export default function AnimatedStoreButton({ className, url, text }: AnimatedStoreButtonProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [cracks, setCracks] = useState(0);
  const [isBreaking, setIsBreaking] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isHovering && cracks < 10) {
      // Incrementar las grietas cada 200ms cuando el mouse está encima
      interval = setInterval(() => {
        setCracks(prev => {
          if (prev < 10) {
            return prev + 1;
          }
          return prev;
        });
      }, 200);
    } else if (!isHovering && cracks > 0) {
      // Restaurar las grietas cuando el mouse se quita
      interval = setInterval(() => {
        setCracks(prev => {
          if (prev > 0) {
            return prev - 1;
          }
          return prev;
        });
      }, 100);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isHovering, cracks]);

  // Efecto para la "explosión" cuando se completan las grietas
  useEffect(() => {
    if (cracks === 10 && !isBreaking) {
      setIsBreaking(true);
      
      // Redirigir a la tienda después de 500ms para dar tiempo a la animación
      const timeout = setTimeout(() => {
        window.open(url, '_blank');
        
        // Resetear el estado después de navegar
        setTimeout(() => {
          setIsBreaking(false);
          setCracks(0);
          setIsHovering(false);
        }, 300);
      }, 500);
      
      return () => clearTimeout(timeout);
    }
  }, [cracks, isBreaking, url]);

  const getCrackClass = () => {
    if (cracks === 0) return '';
    if (isBreaking) return 'breaking';
    
    // Devuelve una clase que corresponde al nivel de grietas
    return `crack-${Math.min(cracks, 10)}`;
  };

  return (
    <div 
      className={`relative inline-block minecraft-block ${getCrackClass()} ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={() => setCracks(10)} // Establecer inmediatamente a 10 para romper al hacer clic
    >
      <Button 
        variant="store" 
        size="default"
        className={`relative z-10 transition-all minecraft-text ${isBreaking ? 'scale-110 opacity-0' : ''}`}
      >
        {text}
      </Button>
      
      {/* Los estilos están definidos en client/src/index.css para evitar problemas de compatibilidad */}
    </div>
  );
}