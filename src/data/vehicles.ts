import { Vehicle } from '../types';
import { Bike, Bus, Car, Train } from 'lucide-react';

export const vehicles: Vehicle[] = [
  {
    id: 'bike',
    name: 'Vélo',
    icon: 'Bike',
    carbonFootprint: 0,
    speed: 15,
    cost: 0,
  },
  {
    id: 'bus',
    name: 'Bus',
    icon: 'Bus',
    carbonFootprint: 30,
    speed: 25,
    cost: 2,
  },
  {
    id: 'train',
    name: 'Train',
    icon: 'Train',
    carbonFootprint: 20,
    speed: 60,
    cost: 5,
  },
  {
    id: 'car',
    name: 'Voiture',
    icon: 'Car',
    carbonFootprint: 120,
    speed: 45,
    cost: 8,
  },
];