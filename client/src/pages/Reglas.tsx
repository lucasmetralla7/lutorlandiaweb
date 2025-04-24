import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

type RuleCategory = {
  id: number;
  name: string;
  description: string;
  order: number;
};

type Rule = {
  id: number;
  categoryId: number;
  title: string;
  description: string;
  order: number;
};

export default function Reglas() {
  // Obtener categorías de reglas
  const { data: categories = [] } = useQuery<RuleCategory[]>({
    queryKey: ['/api/rule-categories'],
    queryFn: async () => {
      const response = await fetch('/api/rule-categories');
      if (!response.ok) {
        throw new Error('Error cargando categorías de reglas');
      }
      return response.json();
    }
  });

  // Para cada categoría, obtener las reglas
  const categoriesWithRules = categories.map(category => {
    const { data: rules = [] } = useQuery<Rule[]>({
      queryKey: ['/api/rules/category', category.id],
      queryFn: async () => {
        const response = await fetch(`/api/rules/category/${category.id}`);
        if (!response.ok) {
          throw new Error(`Error cargando reglas para la categoría ${category.name}`);
        }
        return response.json();
      },
      enabled: !!category.id // Solo ejecutar si tenemos una categoría
    });

    return {
      ...category,
      rules
    };
  });

  // Datos de respaldo
  const fallbackRules = [
    {
      category: "Generales",
      items: [
        "No usar hacks, mods o recursos que den ventaja injusta sobre otros jugadores.",
        "No utilizar bugs o exploits del juego para beneficio propio.",
        "No realizar spam o flood en el chat.",
        "Respetar a todos los jugadores y al staff.",
        "No compartir información personal de otros jugadores sin su consentimiento."
      ]
    },
    {
      category: "Chat y Comunicación",
      items: [
        "No insultar o faltar el respeto a otros jugadores.",
        "No enviar enlaces sospechosos o potencialmente dañinos.",
        "No promocionar otros servidores.",
        "No abusar de las mayúsculas en el chat.",
        "Escribir en español en los canales públicos."
      ]
    },
    {
      category: "Construcciones",
      items: [
        "No construir estructuras ofensivas o inapropiadas.",
        "Respetar las construcciones de otros jugadores.",
        "No reclamar territorios excesivamente grandes sin utilizarlos.",
        "Mantener una distancia razonable entre construcciones.",
        "No destruir el entorno natural de forma masiva sin propósito."
      ]
    },
    {
      category: "Economía",
      items: [
        "No realizar estafas a otros jugadores.",
        "Respetar los precios establecidos en la economía del servidor.",
        "No abusar de bugs económicos.",
        "Mantener precios razonables en las tiendas de jugadores.",
        "Reportar cualquier anomalía en las transacciones."
      ]
    }
  ];

  // Si no hay categorías con reglas, mostrar las reglas por defecto
  const rules = categoriesWithRules.length > 0 
    ? categoriesWithRules.map(cat => ({
        category: cat.name,
        items: cat.rules.map(rule => rule.description)
      }))
    : fallbackRules;

  return (
    <div className="min-h-screen bg-gray-900 pt-16 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-minecraft text-white text-center mb-12">REGLAS DEL SERVIDOR</h1>
        
        <div className="bg-gray-800 rounded-lg p-6 md:p-8 shadow-lg">
          <p className="text-gray-300 mb-8 text-center text-lg">
            Para garantizar una experiencia agradable para todos, es importante seguir estas reglas. 
            El incumplimiento puede resultar en sanciones temporales o permanentes.
          </p>
          
          <div className="space-y-10">
            {rules.map((ruleGroup, index) => (
              <div key={index}>
                <h2 className="text-2xl font-minecraft text-primary mb-4">{ruleGroup.category}</h2>
                <Separator className="mb-4 bg-gray-700" />
                <ul className="space-y-3">
                  {ruleGroup.items.map((rule, ruleIndex) => (
                    <li key={ruleIndex} className="flex items-start">
                      <div className="bg-primary h-6 w-6 rounded flex items-center justify-center text-black font-bold mr-3 mt-0.5 flex-shrink-0">
                        {ruleIndex + 1}
                      </div>
                      <p className="text-gray-300">{rule}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="mt-12 bg-gray-900 p-4 rounded-lg border border-gray-700">
            <p className="text-center text-primary font-medium mb-1">NOTA IMPORTANTE</p>
            <p className="text-center text-gray-400 text-sm">
              El equipo de moderación se reserva el derecho de sancionar comportamientos no especificados en estas reglas 
              pero que consideren perjudiciales para la comunidad. Las reglas pueden ser actualizadas sin previo aviso.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}