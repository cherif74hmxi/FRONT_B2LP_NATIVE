import type { Billet, Commentaire } from "./types";

export function formatDate(date: string): string {
  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
  }).format(parsedDate);
}

export function getBilletAuthorName(auteur: Billet["Auteur"]): string {
  if (!auteur) {
    return "Auteur inconnu";
  }

  if (typeof auteur === "string") {
    return auteur;
  }

  return auteur.nom ?? auteur.name ?? auteur.email;
}

export function getCommentAuthorName(commentaire: Commentaire): string {
  return (
    commentaire.Auteur ??
    commentaire.Utilisateur?.nom ??
    commentaire.Utilisateur?.name ??
    "Auteur inconnu"
  );
}
