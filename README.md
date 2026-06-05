# SUNUIDEE - Plateforme de Gestion d'Idees avec Classification IA

## Presentation du Projet

SUNUIDEE est une application web de gestion d'idees et de suggestions permettant aux utilisateurs de soumettre des messages de maniere structuree. L'originalite du projet reside dans l'integration d'une intelligence artificielle via OpenRouter pour la classification automatique des soumissions.

L'application permet de centraliser les retours, de les organiser par categories thematiques et d'assurer un suivi complet via une interface intuitive.

## Fonctionnalites Principales

- Soumission d'idees : Formulaire de saisie pour le titre et la description.
- Classification Automatisee : Utilisation de l'IA pour categoriser les messages (Pedagogie, Evenement, Vie de campus, Amelioration technique).
- Validation Semantique : Verification automatique du sens des textes soumis pour eviter les entrees sans signification (charabia, tests, remplissage aleatoire).
- Gestion CRUD Complete : Possibilite d'ajouter, d'afficher, de modifier et de supprimer des entrees.
- Filtrage Dynamique : Systeme de tri par categorie et recherche en temps reel pour une consultation facilitee.
- Persistance des Donnees : Stockage cloud via Supabase.
- Interface Responsive : Design moderne s'adaptant aux differents types d'ecrans.

## Architecture Technique

- Frontend : JavaScript (ES6+), HTML5, CSS (utilisant Tailwind CSS pour le stylage).
- Backend & Base de donnees : Supabase (PostgreSQL).
- Intelligence Artificielle : Integration de l'API OpenRouter.
- Modele utilise : openai/gpt-oss-120b pour le traitement du langage naturel, la classification et la validation semantique.

## Installation et Configuration

1. Clonez le depot du projet :
   ```bash
   git clone https://github.com/SouleymaneBa88/message_anonyme.git
   ```

2. Accedez au repertoire du projet :
   ```bash
   cd SUNUIDEE/message_anonyme
   ```

3. Ouvrez le fichier `index.html` dans votre navigateur ou utilisez une extension de type "Live Server".

4. Acces en ligne :
   ```
   https://messageanonym.vercel.app/
   ```

## Utilisation de l'IA

### Classification automatique

L'application envoie les donnees du formulaire a l'API OpenRouter. Un prompt specifique est utilise pour garantir que l'IA retourne uniquement une categorie predefinie parmi les suivantes :

- Pedagogie
- Evenement
- Vie de campus
- Amelioration technique

Cette approche permet d'automatiser l'organisation des donnees sans intervention humaine manuelle lors de la saisie.

### Validation semantique

Avant chaque enregistrement, le titre et la description sont analyses par l'IA pour verifier leur coherence. En cas de texte non significatif (charabia, mots aleatoires, contenu trop vague), la soumission est bloquee et un message d'erreur est affiche a l'utilisateur. Un mecanisme de fallback local assure la validation meme en cas d'indisponibilite de l'API.

## Structure du Code Source

- `apps.js` : Contient toute la logique applicative (gestion des evenements, appels API, manipulation du DOM, validation semantique).
- `index.html` : Structure de l'interface utilisateur et des modales de confirmation.
- `Supabase` : Les donnees sont stockees dans la table `idees`.

## Securite et Bonnes Pratiques

- Les cles API et identifiants de connexion doivent etre externalises dans des variables d'environnement pour une utilisation en production.
- La validation cote client est renforcee par une verification semantique IA avant persistance.
- Les entrees utilisateur sont echappees avant insertion dans le DOM pour prevenir les attaques XSS.

## Licence

Ce projet est developpe dans un cadre educatif et organisationnel. Pour toute suggestion d'amelioration, n'hesitez pas a soumettre une requete ou a modifier le code source localement.
