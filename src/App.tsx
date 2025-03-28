import React, { useState, useEffect } from 'react';
import { Bike, Bus, Car, Train, RotateCcw, User, Trophy } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from "framer-motion";

interface TransportOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  co2: number;
  time: number;
  color: string;
  points: number;
}

interface Level {
  id: number;
  name: string;
  description: string;
  startPoint: [number, number];
  endPoint: [number, number];
  startName: string;
  endName: string;
  distance: number;
  difficulty: 'Facile' | 'Moyen' | 'Difficile';
}

const transportOptions: TransportOption[] = [
  { id: 'bike', name: 'Vélo', icon: <Bike size={32} />, co2: 0, time: 45, color: '#22c55e', points: 100 },
  { id: 'bus', name: 'Bus', icon: <Bus size={32} />, co2: 68, time: 30, color: '#3b82f6', points: 50 },
  { id: 'train', name: 'Train/Métro', icon: <Train size={32} />, co2: 14, time: 25, color: '#6366f1', points: 75 },
  { id: 'car', name: 'Voiture', icon: <Car size={32} />, co2: 120, time: 20, color: '#ef4444', points: -50 },
];



const levels: Level[] = [
  {
    id: 1,
    name: "Trajet Local",
    description: "Tour Eiffel → Gare du Nord",
    startPoint: [48.8584, 2.2945],
    endPoint: [48.8866, 2.3432],
    startName: "Tour Eiffel",
    endName: "Gare du Nord",
    distance: 4.5,
    difficulty: "Facile"
  },
  {
    id: 2,
    name: "Paris → Lyon",
    description: "Gare de Lyon (Paris) → Gare Part-Dieu (Lyon)",
    startPoint: [48.8448, 2.3735],
    endPoint: [45.7605, 4.8590],
    startName: "Gare de Lyon",
    endName: "Gare Part-Dieu",
    distance: 465,
    difficulty: "Moyen"
  },
  {
    id: 3,
    name: "Trajet Urbain",
    description: "Montmartre → Notre-Dame",
    startPoint: [48.8867, 2.3431],
    endPoint: [48.8530, 2.3499],
    startName: "Montmartre",
    endName: "Notre-Dame",
    distance: 3.8,
    difficulty: "Facile"
  },
  {
    id: 4,
    name: "Trajet Urbain",
    description: "Montpellier → Bordeaux",
    startPoint: [43.611111, 3.871837],
    endPoint: [44.841080, -0.580948],
    startName: "Montpellier",
    endName: "Bordeaux",
    distance: 3.8,
    difficulty: "Moyen"
  },
  {
    id: 4,
    name: "Trajet Urbain",
    description: "Bellcour → Bordeaux",
    startPoint: [45.757523, 4.832542],
    endPoint: [44.841080, -0.580948],
    startName: "Bellcour",
    endName: "Bordeaux",
    distance: 3.8,
    difficulty: "Facile"
  }
];

function AnimatedMarker({ position, color }: { position: [number, number]; color: string }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(position, map.getZoom());
  }, [position, map]);

  return (
    <Marker
      position={position}
      icon={L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: ${color}; width: 15px; height: 15px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>`,
        iconSize: [15, 15],
      })}
    />
  );
}

function App() {
  const [selectedTransport, setSelectedTransport] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [markerPosition, setMarkerPosition] = useState<[number, number]>([0, 0]);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [currentLevel, setCurrentLevel] = useState<Level>(levels[0]);
  const [showProfile, setShowProfile] = useState(false);
  const [ecoScore, setEcoScore] = useState(1000);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);

  useEffect(() => {
    setMarkerPosition(currentLevel.startPoint);
  }, [currentLevel]);

  const handleTransportSelect = (id: string) => {
    setSelectedTransport(id);
    setShowResult(true);
    startAnimation();
    
    const option = transportOptions.find(t => t.id === id);
    if (option) {
      const newScore = ecoScore + option.points;
      setEcoScore(newScore);
      
      if (!completedLevels.includes(currentLevel.id)) {
        setCompletedLevels([...completedLevels, currentLevel.id]);
      }
    }
  };

  const startAnimation = () => {
    setAnimationProgress(0);
    const animate = (progress: number) => {
      if (progress <= 1) {
        const lat = currentLevel.startPoint[0] + (currentLevel.endPoint[0] - currentLevel.startPoint[0]) * progress;
        const lng = currentLevel.startPoint[1] + (currentLevel.endPoint[1] - currentLevel.startPoint[1]) * progress;
        setMarkerPosition([lat, lng]);
        setAnimationProgress(progress);
        requestAnimationFrame(() => animate(progress + 0.005));
      }
    };
    animate(0);
  };

  const handleRestart = () => {
    setSelectedTransport(null);
    setShowResult(false);
    setMarkerPosition(currentLevel.startPoint);
    setAnimationProgress(0);
  };

  const handleNextLevel = () => {
    const currentIndex = levels.findIndex(l => l.id === currentLevel.id);
    const nextIndex = (currentIndex + 1) % levels.length;
    setCurrentLevel(levels[nextIndex]);
    handleRestart();
  };

  const isGoodChoice = (id: string) => {
    return id === 'train' || id === 'bike';
  };

  const selectedOption = selectedTransport ? transportOptions.find(t => t.id === selectedTransport) : null;

  const getEcoScoreColor = (score: number) => {
    if (score >= 1200) return 'text-green-600';
    if (score >= 800) return 'text-blue-600';
    if (score >= 400) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-12">
        <motion.h1
  className="text-4xl font-bold text-green-800"
  initial={{ opacity: 1, y: -20 }}
  animate={{ y: [10, -15, 10] }} // Animation de la position verticale uniquement
  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
>
  Movesmart 😉
</motion.h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 rounded-lg shadow transition-colors"
            >
              <User size={20} />
              Profil
            </button>
            <div className="bg-white px-4 py-2 rounded-lg shadow">
              <span className="font-medium">Niveau {currentLevel.id}</span>
            </div>
          </div>
        </header>

        {showProfile ? (
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Votre Profil :</h2>
              <button
                onClick={() => setShowProfile(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                Retour au jeu
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-xl font-medium mb-2">Score Éco</h3>
                  <p className={`text-4xl font-bold ${getEcoScoreColor(ecoScore)}`}>
                    {ecoScore} points
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-xl font-medium mb-4">Niveaux Complétés</h3>
                  <div className="space-y-2">
                    {levels.map(level => (
                      <div
                        key={level.id}
                        className={`flex items-center gap-2 p-2 rounded ${
                          completedLevels.includes(level.id)
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {completedLevels.includes(level.id) && <Trophy size={16} />}
                        Niveau {level.id}: {level.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-xl font-medium mb-4">Impact Environnemental</h3>
                <div className="space-y-4">
                  {transportOptions.map(option => (
                    <div key={option.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="text-gray-600">{option.icon}</div>
                        <span>{option.name}</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">{option.points} points</span>
                        <span className="text-gray-500 ml-2">({option.co2} g CO2/km)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">{currentLevel.name}</h2>
                  <p className="text-gray-600">Difficulté: {currentLevel.difficulty}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleRestart}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <RotateCcw size={20} />
                    Recommencer
                  </button>
                  {showResult && (
                    <button
                      onClick={handleNextLevel}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                    >
                      Niveau Suivant
                    </button>
                  )}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium text-gray-700">Départ: {currentLevel.startName}</p>
                    <p className="font-medium text-gray-700">Arrivée: {currentLevel.endName}</p>
                    <p className="text-sm text-gray-500 mt-2">Distance: {currentLevel.distance} km</p>
                  </div>
                  <div className="h-[300px] rounded-lg overflow-hidden">
                    <MapContainer
                      center={[
                        (currentLevel.startPoint[0] + currentLevel.endPoint[0]) / 2,
                        (currentLevel.startPoint[1] + currentLevel.endPoint[1]) / 2
                      ]}
                      zoom={currentLevel.distance > 100 ? 6 : 13}
                      style={{ height: '100%', width: '100%' }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      {selectedTransport && (
                        <>
                          <Polyline
                            positions={[currentLevel.startPoint, currentLevel.endPoint]}
                            color={selectedOption?.color}
                            weight={3}
                            opacity={0.6}
                          />
                          <AnimatedMarker
                            position={markerPosition}
                            color={selectedOption?.color || '#000'}
                          />
                        </>
                      )}
                    </MapContainer>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {transportOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleTransportSelect(option.id)}
                  className={`p-4 rounded-xl transition-all ${
                    selectedTransport === option.id
                      ? 'bg-green-100 border-2 border-green-500'
                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <div className="mb-2">{option.icon}</div>
                    <span className="font-medium text-gray-800">{option.name}</span>
                    <span className="text-sm text-gray-500">{option.time} min</span>
                  </div>
                </button>
              ))}
            </div>

            {showResult && selectedTransport && (
              <div className={`mt-8 p-4 rounded-lg ${
                isGoodChoice(selectedTransport) 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                <p className="text-lg font-medium">
                  {isGoodChoice(selectedTransport)
                    ? '🌟 Excellent choix ! Ce mode de transport est écologique.'
                    : '❌ Attention ! Ce mode de transport génère beaucoup de CO2.'}
                </p>
                <div className="mt-2 space-y-1">
                  <p>{transportOptions.find(t => t.id === selectedTransport)?.co2} g CO2/km</p>
                  <p className="font-medium">
                    Points gagnés: {transportOptions.find(t => t.id === selectedTransport)?.points}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        <footer className="text-center text-gray-600 text-sm">
          <p>Faites les bons choix pour l'environnement !</p>
        </footer>
      </div>
    </div>
  );
}

export default App;