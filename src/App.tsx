import React, { useState, useEffect, useRef } from 'react';
import { Bike, Bus, Car, Train, RotateCcw, User, Trophy } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'framer-motion';

interface TransportOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  co2: number;
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
  recommendedTransport?: string;
}

const transportOptions: TransportOption[] = [
  { id: 'bike', name: 'Vélo', icon: <Bike size={32} />, co2: 0, color: '#22c55e', points: 100 },
  { id: 'bus', name: 'Bus', icon: <Bus size={32} />, co2: 68, color: '#3b82f6', points: 50 },
  { id: 'train', name: 'Train/Métro', icon: <Train size={32} />, co2: 14, color: '#6366f1', points: 75 },
  { id: 'car', name: 'Voiture', icon: <Car size={32} />, co2: 120, color: '#ef4444', points: -50 },
];

// 15 niveaux : 5 existants + 10 niveaux supplémentaires
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
    difficulty: "Moyen",
    recommendedTransport: "car"
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
    difficulty: "Moyen",
    recommendedTransport: "car"
  },
  {
    id: 5,
    name: "Trajet Urbain",
    description: "Bellcour → Bordeaux",
    startPoint: [45.757523, 4.832542],
    endPoint: [44.841080, -0.580948],
    startName: "Bellcour",
    endName: "Bordeaux",
    distance: 3.8,
    difficulty: "Facile"
  },
  {
    id: 6,
    name: "Trajet Périphérique",
    description: "La Défense → Nation",
    startPoint: [48.892, 2.237],
    endPoint: [48.848, 2.395],
    startName: "La Défense",
    endName: "Nation",
    distance: 8,
    difficulty: "Moyen",
    recommendedTransport: "bus"
  },
  {
    id: 7,
    name: "Trajet Long",
    description: "Paris → Marseille",
    startPoint: [48.8566, 2.3522],
    endPoint: [43.2965, 5.3698],
    startName: "Paris",
    endName: "Marseille",
    distance: 775,
    difficulty: "Difficile",
    recommendedTransport: "car"
  },
  {
    id: 8,
    name: "Trajet Rural",
    description: "Chartres → Orléans",
    startPoint: [48.4469, 1.4890],
    endPoint: [47.9025, 1.9093],
    startName: "Chartres",
    endName: "Orléans",
    distance: 90,
    difficulty: "Moyen",
    recommendedTransport: "train"
  },
  {
    id: 9,
    name: "Trajet de Campagne",
    description: "Rambouillet → Versailles",
    startPoint: [48.6459, 1.8341],
    endPoint: [48.8049, 2.1204],
    startName: "Rambouillet",
    endName: "Versailles",
    distance: 25,
    difficulty: "Facile"
  },
  {
    id: 10,
    name: "Trajet Express",
    description: "Nanterre → Saint-Denis",
    startPoint: [48.892, 2.198],
    endPoint: [48.936, 2.357],
    startName: "Nanterre",
    endName: "Saint-Denis",
    distance: 15,
    difficulty: "Moyen",
    recommendedTransport: "train"
  },
  {
    id: 11,
    name: "Trajet International",
    description: "Calais → Lille",
    startPoint: [50.9513, 1.8587],
    endPoint: [50.6292, 3.0573],
    startName: "Calais",
    endName: "Lille",
    distance: 100,
    difficulty: "Moyen",
    recommendedTransport: "train"
  },
  {
    id: 12,
    name: "Trajet Citadin",
    description: "Strasbourg → Mulhouse",
    startPoint: [48.5734, 7.7521],
    endPoint: [47.7508, 7.3359],
    startName: "Strasbourg",
    endName: "Mulhouse",
    distance: 100,
    difficulty: "Moyen",
    recommendedTransport: "train"
  },
  {
    id: 13,
    name: "Trajet Pittoresque",
    description: "Annecy → Chamonix",
    startPoint: [45.8992, 6.1294],
    endPoint: [45.9237, 6.8694],
    startName: "Annecy",
    endName: "Chamonix",
    distance: 70,
    difficulty: "Difficile",
    recommendedTransport: "train"
  },
  {
    id: 14,
    name: "Trajet de Nuit",
    description: "Paris → Disneyland Paris",
    startPoint: [48.8566, 2.3522],
    endPoint: [48.867, 2.783],
    startName: "Paris",
    endName: "Disneyland Paris",
    distance: 40,
    difficulty: "Facile",
    recommendedTransport: "bus"
  },
  {
    id: 15,
    name: "Trajet Méditerranéen",
    description: "Nice → Cannes",
    startPoint: [43.7102, 7.2620],
    endPoint: [43.5528, 7.0174],
    startName: "Nice",
    endName: "Cannes",
    distance: 33,
    difficulty: "Facile",
    recommendedTransport: "bus"
  }
];

// Fonction de calcul du temps de trajet (en minutes) en fonction du mode et de la distance
const getTransportTime = (transportId: string, distance: number) => {
  const speeds: { [key: string]: number } = {
    bike: 15,   // km/h
    bus: 40,
    train: 80,
    car: 60,
  };
  const speed = speeds[transportId];
  if (!speed) return 0;
  return Math.ceil((distance / speed) * 60); // conversion en minutes
};

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

// Variants pour l'animation des box de l'écran d'intro
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.4 } },
};

const boxVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

// Écran d'introduction avec titre et 4 box explicatives
const IntroScreen = ({ onFinish }: { onFinish: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => onFinish(), 8000);
    return () => clearTimeout(timer);
  }, [onFinish]);
  return (
    <motion.div 
      className="fixed inset-0 z-50 bg-gradient-to-br from-green-50 to-blue-50 flex flex-col items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.h1 
        className="text-5xl font-bold text-green-800 mb-8"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        Movesmart
      </motion.h1>
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 max-w-6xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6"
          variants={boxVariants}
        >
          <h2 className="text-xl font-bold mb-2">Moins de Pollution</h2>
          <p className="text-gray-600">
            Réduisez vos émissions de CO2 et contribuez à un air plus pur.
          </p>
        </motion.div>
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6"
          variants={boxVariants}
        >
          <h2 className="text-xl font-bold mb-2">Santé et Bien-être</h2>
          <p className="text-gray-600">
            Améliorez votre santé physique et mentale en vous déplaçant à pied ou à vélo.
          </p>
        </motion.div>
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6"
          variants={boxVariants}
        >
          <h2 className="text-xl font-bold mb-2">Avenir Durable</h2>
          <p className="text-gray-600">
            Investissez dans un futur respectueux de notre planète et de ses ressources.
          </p>
        </motion.div>
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6"
          variants={boxVariants}
        >
          <h2 className="text-xl font-bold mb-2">But du Jeu</h2>
          <p className="text-gray-600">
            Optimisez vos déplacements pour améliorer votre score éco et progresser.
          </p>
        </motion.div>
      </motion.div>
      <motion.button
        onClick={onFinish}
        className="mt-4 px-6 py-3 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
      >
        Commencer
      </motion.button>
    </motion.div>
  );
};

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [selectedTransport, setSelectedTransport] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [markerPosition, setMarkerPosition] = useState<[number, number]>([0, 0]);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [currentLevel, setCurrentLevel] = useState<Level>(levels[0]);
  const [showProfile, setShowProfile] = useState(false);
  const [ecoScore, setEcoScore] = useState(1000);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);
  
  const animationFrameRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const cancelAnimation = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  useEffect(() => {
    setMarkerPosition(currentLevel.startPoint);
    const getRoute = async () => {
      try {
        const url = `http://router.project-osrm.org/route/v1/driving/${currentLevel.startPoint[1]},${currentLevel.startPoint[0]};${currentLevel.endPoint[1]},${currentLevel.endPoint[0]}?overview=full&geometries=geojson`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.routes && data.routes.length > 0) {
          const coords = data.routes[0].geometry.coordinates.map((c: [number, number]) => [c[1], c[0]]);
          setRouteCoordinates(coords);
        } else {
          setRouteCoordinates([]);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de la route :", error);
        setRouteCoordinates([]);
      }
    };
    getRoute();
  }, [currentLevel]);

  const animateRoute = (coords: [number, number][], index: number = 0) => {
    if (index < coords.length) {
      setMarkerPosition(coords[index]);
      timeoutRef.current = window.setTimeout(() => {
        animateRoute(coords, index + 1);
      }, 50);
    }
  };

  const startAnimation = () => {
    cancelAnimation();
    if (routeCoordinates.length > 0) {
      animateRoute(routeCoordinates);
    } else {
      setAnimationProgress(0);
      const animate = (progress: number) => {
        if (progress <= 1) {
          const lat = currentLevel.startPoint[0] + (currentLevel.endPoint[0] - currentLevel.startPoint[0]) * progress;
          const lng = currentLevel.startPoint[1] + (currentLevel.endPoint[1] - currentLevel.startPoint[1]) * progress;
          setMarkerPosition([lat, lng]);
          setAnimationProgress(progress);
          animationFrameRef.current = requestAnimationFrame(() => animate(progress + 0.005));
        }
      };
      animate(0);
    }
  };

  const handleTransportSelect = (id: string) => {
    if (selectedTransport && selectedTransport !== id) {
      cancelAnimation();
      setMarkerPosition(currentLevel.startPoint);
      setAnimationProgress(0);
      setShowResult(false);
    }
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

  const handleRestart = () => {
    cancelAnimation();
    setSelectedTransport(null);
    setShowResult(false);
    setMarkerPosition(currentLevel.startPoint);
    setAnimationProgress(0);
  };

  const handleNextLevel = () => {
    cancelAnimation();
    const currentIndex = levels.findIndex(l => l.id === currentLevel.id);
    const nextIndex = (currentIndex + 1) % levels.length;
    setCurrentLevel(levels[nextIndex]);
    handleRestart();
  };

  const isGoodChoice = (id: string) => {
    if (currentLevel.recommendedTransport) {
      return id === currentLevel.recommendedTransport;
    }
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
    <>
      <AnimatePresence>
        {showIntro && <IntroScreen onFinish={() => setShowIntro(false)} />}
      </AnimatePresence>
      {!showIntro && (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
          <div className="container mx-auto px-4 py-8">
            <header className="flex justify-between items-center mb-12">
              <motion.h1
                className="text-4xl font-bold text-green-800"
                initial={{ opacity: 1, y: -20 }}
                animate={{ y: [10, -15, 10] }}
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
                      {/* <p className="text-sm text-gray-500 mt-2">
                        Départ: {currentLevel.startName} / Arrivée: {currentLevel.endName}
                      </p> */}
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
                          {/* Marqueurs permanents pour départ et arrivée */}
                          <Marker
                            position={currentLevel.startPoint}
                            icon={L.divIcon({
                              className: 'start-marker',
                              html: `<div style="background-color: blue; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`,
                              iconSize: [12, 12],
                            })}
                          />
                          <Marker
                            position={currentLevel.endPoint}
                            icon={L.divIcon({
                              className: 'end-marker',
                              html: `<div style="background-color: red; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`,
                              iconSize: [12, 12],
                            })}
                          />
                          {selectedTransport && (
                            <>
                              <Polyline
                                positions={routeCoordinates.length > 0 ? routeCoordinates : [currentLevel.startPoint, currentLevel.endPoint]}
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
                        <span className="text-sm text-gray-500">
                          {getTransportTime(option.id, currentLevel.distance)} min
                        </span>
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
              <p>
                Les transports doux désignent les modes de déplacement respectueux de l’environnement, tels que la marche, le vélo, la trottinette ou encore les transports en commun. Ces alternatives à la voiture individuelle contribuent à réduire la pollution, limiter les embouteillages et améliorer la qualité de vie en ville. Elles sont essentielles pour un avenir plus durable et une mobilité plus accessible à tous. Opter pour les transports doux, c’est choisir un mode de vie plus sain et plus respectueux de notre planète.
              </p>
            </footer>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
