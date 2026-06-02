# SUNUIDEE - Plateforme de Gestion d'Idées avec Classification IA

## Présentation du Projet

SUNUIDEE est une application web de gestion d'idées et de suggestions permettant aux utilisateurs de soumettre des messages de manière structurée. L'originalité du projet réside dans l'intégration d'un modèle d'intelligence artificielle local pour la classification automatique des soumissions.

L'application permet de centraliser les retours, de les organiser par catégories thématiques et d'assurer un suivi complet via une interface intuitive.

## Fonctionnalités Principales

*   Soumission d'idées : Formulaire de saisie pour le titre et la description.
*   Classification Automatisée : Utilisation de l'IA (Llama 3.2) pour catégoriser les messages (Pédagogie, Campus, Amélioration).
*   Gestion CRUD Complète : Possibilité d'ajouter, d'afficher, de modifier et de supprimer des entrées.
*   Filtrage Dynamique : Système de tri par catégorie pour une consultation facilitée.
*   Persistance des Données : Stockage local via l'API localStorage du navigateur.
*   Interface Responsive : Design moderne s'adaptant aux différents types d'écrans.

## Architecture Technique

*   Frontend : JavaScript (ES6+), HTML5, CSS (utilisant Tailwind CSS pour le stylage).
*   Intelligence Artificielle : Intégration de l'API locale Ollama.
*   Modèle utilisé : Llama 3.2 pour le traitement du langage naturel et la classification.

## Prérequis

Pour faire fonctionner la classification automatique, vous devez disposer d'une instance Ollama opérationnelle sur votre machine locale.

1.  Installer Ollama.
2.  Télécharger le modèle requis : `ollama run llama3.2`.
3.  S'assurer que le service est accessible sur `http://localhost:11434`.

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

L'application envoie les données du formulaire à l'API locale d'Ollama. Un prompt spécifique est utilisé pour garantir que l'IA retourne uniquement une catégorie prédéfinie parmi les suivantes :
*   Pédagogie
*   Campus
*   Amélioration

Cette approche permet d'automatiser l'organisation des données sans intervention humaine manuelle lors de la saisie.

## Structure du Code Source

*   apps.js : Contient toute la logique applicative (gestion des événements, appels API, manipulation du DOM).
*   index.html : Structure de l'interface utilisateur et des modales de confirmation.
*   Local Storage : Les données sont sauvegardées sous la clé "idees" au format JSON.

## Licence

Ce projet est développé dans un cadre éducatif et organisationnel. Pour toute suggestion d'amélioration, n'hésitez pas à soumettre une requête ou à modifier le code source localement.