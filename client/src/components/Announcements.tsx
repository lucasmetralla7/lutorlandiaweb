import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
interface Announcement {
  id: number;
  title: string;
  content: string;
  date: string;
  type: 'EVENTO' | 'ACTUALIZACIÓN' | 'TIENDA';
  image: string;
  time?: string;
  link?: string;
}
export default function Announcements() {
  const { data: announcements = [], isLoading } = useQuery({
    queryKey: ['/api/announcements'],
    queryFn: async () => {
      const response = await fetch('/api/announcements');
      if (!response.ok) {
        throw new Error('Error cargando anuncios');
      }
      return response.json();
    }
  });
  return (
    <section className="py-16 bg-gradient-to-b from-primary to-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-minecraft text-white mb-12 text-center">ANUNCIOS RECIENTES</h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-white text-lg">No hay anuncios disponibles actualmente.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {announcements.map((announcement: Announcement) => (
              <div key={announcement.id} className="bg-gray-800 rounded-lg overflow-hidden pixel-border">
                <img 
                  src={announcement.image} 
                  alt={announcement.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <span className={`
                      text-xs text-black font-bold px-3 py-1 rounded-full
                      ${announcement.type === 'EVENTO' ? 'bg-accent' : 
                        announcement.type === 'ACTUALIZACIÓN' ? 'bg-green-500' : 
                        'bg-purple-500'}
                    `}>
                      {announcement.type}
                    </span>
                    <span className="text-gray-400 text-sm ml-auto">{announcement.date}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2">{announcement.title}</h3>
                  <p className="text-gray-300 mb-4">{announcement.content}</p>
                  
                  <div className="flex justify-between items-center">
                    {announcement.link ? (
                      <a 
                        href={announcement.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-accent font-medium hover:underline"
                      >
                        Ver tienda
                      </a>
                    ) : (
                      <span className="text-accent font-medium">{announcement.time}</span>
                    )}
                    <Button variant="ghost" size="icon" className="text-white hover:text-accent">
                      <ArrowRight size={18} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}