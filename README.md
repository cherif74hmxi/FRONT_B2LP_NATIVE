![Logo Lyon Palme](assets/images/logo_lp.png)

# Application mobile du blog Lyon Palme "B2LP"

Code de l'application mobile developpee avec Expo, React Native et TypeScript.

Cette application permet aux adherents du club Lyon Palme de consulter les
billets du blog, de lire les commentaires associes, et de commenter les billets
apres connexion.

Elle communique avec le webservice Laravel `API_B2LP`.

Mise a jour Juin 2026.

## 1. Presentation

L'application B2LP est la version mobile du front du blog Lyon Palme.

Elle permet :

- aux visiteurs de consulter la liste des billets et leur contenu ;
- aux visiteurs d'etre invites a se connecter lorsqu'ils veulent lire les commentaires ;
- aux adherents connectes de lire les commentaires ;
- aux adherents connectes d'ajouter un commentaire ;
- a l'administrateur de creer, modifier et supprimer des billets ;
- a l'administrateur de supprimer des commentaires.

La gestion des donnees est faite par l'API Laravel.

## 2. Technologies utilisees

- Expo SDK 54
- React Native
- React
- TypeScript
- Expo Router
- Axios
- AsyncStorage
- API Laravel avec authentification par Bearer Token

Le projet utilise des styles React Native classiques avec `StyleSheet`.
NativeWind/Tailwind n'est pas utilise dans cette version pour garder le projet
simple et stable sur telephone.

## 3. Installation du projet

Cloner le projet :

```bash
git clone <url-du-repo-mobile>
cd projetB2LP_Native
```

Installer les dependances :

```bash
npm install
```

Si besoin, creer une variable d'environnement pour changer l'URL de l'API :

```bash
EXPO_PUBLIC_API_BASE_URL=https://monblog.cherifhammani.fr/api
```

Si cette variable n'est pas definie, l'application utilise deja cette URL par
defaut dans `components/types.ts`.

## 4. Lancement en local

Demarrer Expo avec un tunnel, pratique pour tester sur telephone :

```bash
npm run start:tunnel
```

Ensuite :

- installer l'application Expo Go sur le telephone ;
- scanner le QR code affiche dans le terminal ;
- garder le terminal ouvert pendant le test.

Si Expo Go affiche une erreur de connexion au serveur de developpement, il faut
relancer la commande et scanner un nouveau QR code.

Pour un test avec cache nettoye :

```bash
npm run start:clear
```

## 5. Commandes utiles

```bash
npm start
npm run start:clear
npm run start:tunnel
npm run android
npm run ios
npm run web
npx tsc --noEmit
npx expo install --check
```

## 6. Fonctionnement general

Le fichier `components/api.ts` centralise tous les appels vers l'API Laravel.

Les principales fonctions sont :

- `fetchBillets()` : recupere la liste des billets ;
- `fetchBillet(id)` : recupere le detail d'un billet avec ses commentaires ;
- `loginUser(email, password)` : connecte un utilisateur ;
- `registerUser(name, email, password)` : cree un compte utilisateur ;
- `createBillet()` : cree un billet ;
- `updateBillet()` : modifie un billet ;
- `deleteBillet()` : supprime un billet ;
- `createCommentaire()` : ajoute un commentaire ;
- `deleteCommentaire()` : supprime un commentaire.

La session utilisateur est geree dans `components/AuthProvider.tsx`.

Sur mobile, on n'utilise pas `localStorage` ou `sessionStorage`.
La session est stockee avec `AsyncStorage`, qui est l'equivalent adapte a React
Native.

## 7. Gestion des roles

Visiteur :

- peut voir la liste des billets ;
- peut lire le titre et le contenu des billets ;
- ne peut pas lire les commentaires ;
- ne peut pas commenter ;
- ne peut pas administrer les billets.

Adherent connecte :

- peut voir les billets ;
- peut lire les commentaires ;
- peut ajouter un commentaire.

Administrateur :

- peut voir les billets ;
- peut lire les commentaires ;
- peut ajouter un commentaire ;
- peut creer, modifier et supprimer des billets ;
- peut supprimer des commentaires.

Le vrai controle des droits est fait cote API Laravel.
Le front gere surtout l'affichage et la navigation selon l'utilisateur connecte.

## 8. Structure principale du projet

```txt
app/
  index.tsx                         Liste des billets
  login.tsx                         Page de connexion
  register.tsx                      Page d'inscription
  billets/[id].tsx                  Detail d'un billet et commentaires
  admin/billets/new.tsx             Creation d'un billet
  admin/billets/[id]/edit.tsx       Modification d'un billet
  _layout.tsx                       Navigation generale avec Expo Router

components/
  api.ts                            Appels vers l'API Laravel
  AuthProvider.tsx                  Gestion de la session utilisateur
  AppHeader.tsx                     En-tete de l'application
  BilletArticle.tsx                 Affichage d'un billet
  BilletEditor.tsx                  Formulaire de creation/modification
  CommentSection.tsx                Affichage et ajout des commentaires
  types.ts                          Types TypeScript
  ui.tsx                            Couleurs, boutons et styles communs
```

## 9. API utilisee

L'application utilise le webservice Laravel suivant :

```txt
https://monblog.cherifhammani.fr/api
```

Routes principales utilisees :

```txt
GET    /api/billets
GET    /api/billets/{id}
POST   /api/login
POST   /api/register
POST   /api/user/logout
POST   /api/commentaires
DELETE /api/commentaires/{commentaire}
POST   /api/billets
PATCH  /api/billets/{billet}
DELETE /api/billets/{billet}
```

Les routes d'administration necessitent un Bearer Token.

## 10. Points importants React Native

React Native ressemble a React, mais il y a quelques differences importantes :

- pas de balises HTML comme `div`, `p` ou `img` ;
- on utilise `View`, `Text`, `Image`, `TextInput`, `Pressable` ;
- le style se fait avec des objets JavaScript, souvent avec `StyleSheet.create()` ;
- il n'y a pas de DOM ni de navigateur classique ;
- pour stocker une session, on utilise `AsyncStorage` au lieu de `localStorage` ;
- la navigation est geree ici par Expo Router ;
- pour tester sur telephone, on utilise Expo Go et un serveur Expo ;
- certains comportements changent entre iOS, Android et web ;
- les images locales doivent etre importees avec `require()` ;
- les appels API avec Axios fonctionnent comme dans React web.

## 11. Tests et verification

Avant de rendre ou presenter le projet, lancer :

```bash
npx expo install --check
npx tsc --noEmit
```

Pour verifier que le bundle iOS se construit :

```bash
npx expo export --platform ios
```

## 12. Lien avec le webservice

Le front mobile depend du webservice Laravel `API_B2LP`.

Repo du webservice :

```txt
https://github.com/cherif74hmxi/API_B2LP
```
