import React, { useState, useEffect } from 'react';
import { vehicles } from '../data/vehicles';
import { challenges } from '../data/challenges';
import { GameState, Vehicle, Challenge } from '../types';
import { Bike, Bus, Car, Train, RotateCcw } from 'lucide-react';

const INITIAL_STATE: GameState = {
  score: 0,
  currentDistance: 0,
  totalDistance: 1000,
  carbonFootprint: 0,
  time: 0,
  money: 100,
  selectedVehicle: null,
  activeChallenge: null,
};

const iconMap = {
  Bike,
  Bus,
  Car,
  Train,
};

export default function GameBoard() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [isGameOver, setIsGameOver] = useState(false);

  const resetGame = () => {
    setGameState(INITIAL_STATE);
    setIsGameOver(false);
  };

  const selectVehicle = (vehicle: Vehicle) => {
    if (gameState.money >= vehicle.cost) {
      setGameState(prev => ({
        ...prev,
        selectedVehicle: vehicle,
        money: prev.money - vehicle.cost,
        carbonFootprint: prev.carbonFootprint + vehicle.carbonFootprint,
      }));
    }
  };

  useEffect(() => {
    if (gameState.selectedVehicle) {
      const interval = setInterval(() => {
        setGameState(prev => {
          const newDistance = prev.currentDistance + prev.selectedVehicle!.speed;
          if (newDistance >= prev.totalDistance) {
            clearInterval(interval);
            setIsGameOver(true);
            return {
              ...prev,
              currentDistance: prev.totalDistance,
              score: prev.score + Math.floor((1000 - prev.carbonFootprint) * 0.1),
            };
          }
          return {
            ...prev,
            currentDistance: newDistance,
            time: prev.time + 1,
          };
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [gameState.selectedVehicle]);

  useEffect(() => {
    const challengeInterval = setInterval(() => {
      if (Math.random() < 0.1 && !gameState.activeChallenge) {
        const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];
        setGameState(prev => {
          const newMoney = prev.money - randomChallenge.impact.cost;
          if (newMoney <= 0) {
            setIsGameOver(true);
            return prev;
          }
          return {
            ...prev,
            activeChallenge: randomChallenge,
            time: prev.time + randomChallenge.impact.time,
            money: newMoney,
          };
        });

        setTimeout(() => {
          setGameState(prev => ({ ...prev, activeChallenge: null }));
        }, 5000);
      }
    }, 5000);

    return () => clearInterval(challengeInterval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-green-600">Éco-Mobilité Challenge</h1>
            <button
              onClick={resetGame}
              className="flex items-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Recommencer
            </button>
          </div>
          
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-green-100 p-4 rounded-lg">
              <p className="text-sm text-green-600">Score</p>
              <p className="text-2xl font-bold">{gameState.score}</p>
            </div>
            <div className="bg-blue-100 p-4 rounded-lg">
              <p className="text-sm text-blue-600">Distance</p>
              <p className="text-2xl font-bold">{Math.floor(gameState.currentDistance)}m</p>
            </div>
            <div className="bg-red-100 p-4 rounded-lg">
              <p className="text-sm text-red-600">CO2</p>
              <p className="text-2xl font-bold">{gameState.carbonFootprint}g</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg">
              <p className="text-sm text-yellow-600">Budget</p>
              <p className="text-2xl font-bold">{gameState.money}€</p>
            </div>
          </div>

          {isGameOver && (
            <div className="bg-green-100 p-6 rounded-lg mb-8 text-center">
              <h2 className="text-2xl font-bold text-green-700 mb-2">
                {gameState.currentDistance >= gameState.totalDistance ? 'Destination atteinte !' : 'Plus de budget !'}
              </h2>
              <p className="text-lg text-green-600 mb-4">Score final : {gameState.score}</p>
              <button
                onClick={resetGame}
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Jouer à nouveau
              </button>
            </div>
          )}

          {gameState.activeChallenge && (
            <div className="bg-orange-100 p-4 rounded-lg mb-8 animate-pulse">
              <h3 className="font-bold text-orange-600">{gameState.activeChallenge.title}</h3>
              <p>{gameState.activeChallenge.description}</p>
            </div>
          )}

          <div className="grid grid-cols-4 gap-4">
            {vehicles.map(vehicle => {
              const Icon = iconMap[vehicle.icon as keyof typeof iconMap];
              return (
                <button
                  key={vehicle.id}
                  onClick={() => selectVehicle(vehicle)}
                  disabled={gameState.money < vehicle.cost || isGameOver}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    gameState.selectedVehicle?.id === vehicle.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-300'
                  } ${(gameState.money < vehicle.cost || isGameOver) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Icon className="w-8 h-8" />
                    <span className="font-medium">{vehicle.name}</span>
                    <div className="text-sm text-gray-600">
                      <p>CO2: {vehicle.carbonFootprint}g/km</p>
                      <p>Coût: {vehicle.cost}€</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-xl p-6">
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div
              className="bg-green-500 h-4 rounded-full transition-all"
              style={{ width: `${(gameState.currentDistance / gameState.totalDistance) * 100}%` }}
            ></div>
          </div>
          <p className="text-center text-gray-600">
            {Math.floor(gameState.currentDistance)}m / {gameState.totalDistance}m parcourus
          </p>
        </div>
      </div>
    </div>
  );
}