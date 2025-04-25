export default function Features() {
  const features = [
    {
      id: 1,
      title: "Minijuegos",
      description: "Disfruta de una variedad de minijuegos exclusivos creados para divertirte con amigos.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
        </svg>
      ),
<<<<<<< HEAD
=======
      icon: "fas fa-dice",
>>>>>>> 197055a3 (Solucionando conflictos y actualizando)
      color: "primary" // Uses primary from our custom colors
    },
    {
      id: 2,
      title: "Economía",
      description: "Sistema económico equilibrado con tiendas, mercado de jugadores y trabajos diversos.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
<<<<<<< HEAD
=======
      icon: "fas fa-gem",
>>>>>>> 197055a3 (Solucionando conflictos y actualizando)
      color: "accent" // Uses accent from our custom colors
    },
    {
      id: 3,
      title: "Protección",
      description: "Protege tus construcciones con nuestro sistema de claims y otras herramientas de seguridad.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
<<<<<<< HEAD
=======
      icon: "fas fa-shield-alt",
>>>>>>> 197055a3 (Solucionando conflictos y actualizando)
      color: "purple-500"
    },
    {
      id: 4,
      title: "Comunidad",
      description: "Únete a una comunidad activa y amigable con eventos regulares y actividades grupales.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
<<<<<<< HEAD
=======
      icon: "fas fa-users",
>>>>>>> 197055a3 (Solucionando conflictos y actualizando)
      color: "green-500"
    }
  ];

  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-minecraft text-white mb-12 text-center">CARACTERÍSTICAS DEL SERVIDOR</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div 
              key={feature.id} 
              className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors"
            >
              <div className={`w-16 h-16 rounded-lg flex items-center justify-center mb-4 ${
                feature.color === 'primary' ? 'bg-primary/20' :
                feature.color === 'accent' ? 'bg-accent/20' :
                feature.color === 'purple-500' ? 'bg-purple-500/20' :
                'bg-green-500/20'
              }`}>
                <div className={`${
                  feature.color === 'primary' ? 'text-primary' :
                  feature.color === 'accent' ? 'text-accent' :
                  feature.color === 'purple-500' ? 'text-purple-500' :
                  'text-green-500'
                }`}>
                  {feature.icon}
                </div>
<<<<<<< HEAD
=======
              <div className={`w-16 h-16 bg-${feature.color} bg-opacity-20 rounded-lg flex items-center justify-center mb-4`}>
                <i className={`${feature.icon} text-${feature.color} text-2xl`}></i>
>>>>>>> 197055a3 (Solucionando conflictos y actualizando)
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
