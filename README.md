# SUNUIDEE - Plateforme de Gestion d'Idées avec Classification IA

## Présentation du Projet

SUNUIDEE est une application web de gestion d'idées et de suggestions permettant aux utilisateurs de soumettre des messages de manière structurée. L'originalité du projet réside dans l'intégration d'une intelligence artificielle via OpenRouter pour la classification automatique des soumissions.

L'application permet de centraliser les retours, de les organiser par catégories thématiques et d'assurer un suivi complet via une interface intuitive.

## Fonctionnalités Principales

*   Soumission d'idées : Formulaire de saisie pour le titre et la description.
*   Classification Automatisée : Utilisation de l'IA pour catégoriser les messages (Pédagogie, Événement, Vie de campus, Amélioration technique).
*   Gestion CRUD Complète : Possibilité d'ajouter, d'afficher, de modifier et de supprimer des entrées.
*   Filtrage Dynamique : Système de tri par catégorie pour une consultation facilitée.
*   Persistance des Données : Stockage cloud via **Supabase**.
*   Interface Responsive : Design moderne s'adaptant aux différents types d'écrans.

## Architecture Technique

*   Frontend : JavaScript (ES6+), HTML5, CSS (utilisant Tailwind CSS pour le stylage).
*   Backend & Base de données : **Supabase** (PostgreSQL).
*   Intelligence Artificielle : Intégration de l'API **OpenRouter**.
*   Modèle utilisé : `poolside/laguna-m.1:free` pour le traitement du langage naturel et la classification.

## Installation et Configuration

1.  Clonez le dépôt du projet :
    ```bash
    git clone https://github.com/SouleymaneBa88/message_anonyme.git
    ```

2.  Accédez au répertoire du projet :
    ```bash
    cd SUNUIDEE/message_anonyme
    ```

3.  Ouvrez le fichier `index.html` dans votre navigateur ou utilisez une extension de type "Live Server".

4.  Lien vercel.
```bash
https://messageanonym.vercel.app/
```

## Utilisation de l'IA

L'application envoie les données du formulaire à l'API OpenRouter. Un prompt spécifique est utilisé pour garantir que l'IA retourne uniquement une catégorie prédéfinie parmi les suivantes :
*   **Pédagogie**
*   **Événement**
*   **Vie de campus**
*   **Amélioration technique**

Cette approche permet d'automatiser l'organisation des données sans intervention humaine manuelle lors de la saisie.

## Structure du Code Source

*   apps.js : Contient toute la logique applicative (gestion des événements, appels API, manipulation du DOM).
*   index.html : Structure de l'interface utilisateur et des modales de confirmation.
*   Supabase : Les données sont stockées dans la table `idees`.

## Licence

Ce projet est développé dans un cadre éducatif et organisationnel. Pour toute suggestion d'amélioration, n'hésitez pas à soumettre une requête ou à modifier le code source localement.
