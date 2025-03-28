import { Challenge } from '../types';

export const challenges: Challenge[] = [
  {
    id: 'traffic',
    title: 'Embouteillages',
    description: 'Un embouteillage important ralentit la circulation',
    impact: {
      time: 15,
      cost: 2,
    },
  },
  {
    id: 'weather',
    title: 'Pluie',
    description: 'Une forte pluie rend les déplacements plus difficiles',
    impact: {
      time: 10,
      cost: 1,
    },
  },
  {
    id: 'strike',
    title: 'Grève',
    description: 'Les transports en commun sont perturbés',
    impact: {
      time: 20,
      cost: 5,
    },
  },
];