# Movesmart

Movesmart est une application interactive de jeu et de visualisation cartographique développée avec React, TypeScript, Leaflet et Framer Motion. Le projet promeut l'utilisation de transports doux en simulant différents niveaux et modes de transport, tout en affichant des animations fluides et en récupérant des itinéraires réels via l'API OSRM.

## Fonctionnalités

- **Carte Interactive** : Visualisation des itinéraires réels avec Leaflet.
- **Animations Fluides** : Transitions et introduction animées à la manière d'Apple grâce à Framer Motion.
- **Modes de Transport Multiples** : Choix entre vélo, bus, train/métro et voiture, avec une influence sur votre score écologique.
- **Jeu Basé sur des Niveaux** : Chaque niveau affiche un point de départ et d'arrivée clairement identifiés sur la carte.
- **Réinitialisation Dynamique** : Lorsqu'un nouveau mode de transport est sélectionné, l'animation en cours est annulée et le trajet se réinitialise.
- **Mise à Jour du Score** : Le score écologique évolue en fonction du mode de transport choisi.

## Prérequis

- **Node.js** (version 14 ou supérieure recommandée)
- **npm** ou **yarn**

## Installation

1. **Cloner le Repository**

   Ouvrez un terminal et exécutez :
   ```bash
   git clone https://github.com/votre-utilisateur/movesmart.git
   cd movesmart

2. **Installer les dependances**
       ```bash
       sudo npm i 

3. **Lancer le projet**
    ```bash
       sudo npm run dev
