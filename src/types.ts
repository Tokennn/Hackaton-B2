export interface Vehicle {
  id: string;
  name: string;
  icon: string;
  carbonFootprint: number;
  speed: number;
  cost: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  impact: {
    time: number;
    cost: number;
  };
}

export interface GameState {
  score: number;
  currentDistance: number;
  totalDistance: number;
  carbonFootprint: number;
  time: number;
  money: number;
  selectedVehicle: Vehicle | null;
  activeChallenge: Challenge | null;
}