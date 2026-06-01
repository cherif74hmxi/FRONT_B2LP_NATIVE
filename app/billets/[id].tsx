import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import AppHeader from "@/components/AppHeader";
import { useAuth } from "@/components/AuthProvider";
import {
  createCommentaire,
  deleteBillet,
  deleteCommentaire,
  fetchBillet,
} from "@/components/api";
import type { Billet } from "@/components/types";
import {
  ActionButton,
  MessageBox,
  formatDate,
  getBilletAuthorName,
  getCommentAuthorName,
  palette,
} from "@/components/ui";

export default function BilletDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { initialized, isAdmin, isAuthenticated, token, user } = useAuth();
  const billetId = Array.isArray(id) ? id[0] : id;
  const [billet, setBillet] = useState<Billet>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [commentError, setCommentError] = useState<string>();
  const [commentSuccess, setCommentSuccess] = useState<string>();
  const [commentContent, setCommentContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDeletingBillet, setIsDeletingBillet] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<number>();

  const loadBillet = useCallback(
    async (refreshing = false) => {
      if (!initialized || !billetId) {
        return;
      }

      if (refreshing) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      setErrorMessage(undefined);

      try {
        const nextBillet = await fetchBillet(billetId, token);
        setBillet(nextBillet);
      } catch (error) {
        setBillet(undefined);
        setErrorMessage(error instanceof Error ? error.message : "Erreur inconnue");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [billetId, initialized, token],
  );

  useFocusEffect(
    useCallback(() => {
      loadBillet();
    }, [loadBillet]),
  );

  function confirmDeleteBillet() {
    if (!token || !billet) {
      return;
    }

    Alert.alert("Supprimer ce billet ?", "Cette action est definitive.", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          setIsDeletingBillet(true);
          setErrorMessage(undefined);

          try {
            await deleteBillet(token, billet.id);
            router.replace("/");
          } catch (error) {
            setErrorMessage(
              error instanceof Error ? error.message : "Suppression impossible",
            );
          } finally {
            setIsDeletingBillet(false);
          }
        },
      },
    ]);
  }

  async function handleCreateComment() {
    if (!token || !user || !billet) {
      setCommentError("Vous devez etre connecte.");
      return;
    }

    setCommentError(undefined);
    setCommentSuccess(undefined);
    setIsSubmittingComment(true);

    try {
      await createCommentaire(token, billet.id, user.id, commentContent.trim());
      setCommentContent("");
      setCommentSuccess("Commentaire ajoute.");
      await loadBillet(true);
    } catch (error) {
      setCommentError(error instanceof Error ? error.message : "Ajout impossible");
    } finally {
      setIsSubmittingComment(false);
    }
  }

  function confirmDeleteComment(commentaireId: number) {
    if (!Number.isFinite(commentaireId) || commentaireId <= 0) {
      setCommentError(
        "Impossible de supprimer ce commentaire : l'API ne renvoie pas son id.",
      );
      return;
    }

    if (!token || !billet) {
      return;
    }

    Alert.alert("Supprimer ce commentaire ?", "Cette action est definitive.", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          setDeletingCommentId(commentaireId);
          setCommentError(undefined);

          try {
            await deleteCommentaire(token, commentaireId);
            setBillet({
              ...billet,
              Commentaires: billet.Commentaires?.filter(
                (commentaire) => commentaire.id !== commentaireId,
              ),
            });
          } catch (error) {
            setCommentError(
              error instanceof Error ? error.message : "Suppression impossible",
            );
          } finally {
            setDeletingCommentId(undefined);
          }
        },
      },
    ]);
  }

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          onRefresh={() => loadBillet(true)}
          refreshing={isRefreshing}
          tintColor={palette.cyan}
        />
      }
    >
      <AppHeader />

      <View style={styles.body}>
        <ActionButton
          icon="arrow-left"
          label="Retour aux billets"
          onPress={() => router.push("/")}
          variant="ghost"
        />

        {!initialized || isLoading ? (
          <View style={styles.loadingBlock}>
            <ActivityIndicator color={palette.cyan} />
            <Text style={styles.loadingText}>Chargement du billet...</Text>
          </View>
        ) : errorMessage ? (
          <>
            <MessageBox
              message="Ce billet est momentanement indisponible."
              title="Impossible de charger le billet"
              tone="error"
            />
            <ActionButton
              icon="refresh"
              label="Reessayer"
              onPress={() => loadBillet()}
              variant="secondary"
            />
          </>
        ) : billet ? (
          <>
            <View style={styles.article}>
              <Text style={styles.articleTitle}>{billet.Titre}</Text>
              <Text style={styles.meta}>
                Cree le {formatDate(billet.Date)} par {getBilletAuthorName(billet.Auteur)}
              </Text>
              <Text style={styles.articleContent}>{billet.Contenu}</Text>

              {isAdmin ? (
                <View style={styles.adminActions}>
                  <ActionButton
                    icon="pencil"
                    label="Modifier"
                    onPress={() =>
                      router.push({
                        pathname: "/admin/billets/[id]/edit",
                        params: { id: String(billet.id) },
                      })
                    }
                    variant="cyan"
                  />
                  <ActionButton
                    icon="trash"
                    label="Supprimer"
                    loading={isDeletingBillet}
                    onPress={confirmDeleteBillet}
                    variant="danger"
                  />
                </View>
              ) : null}
            </View>

            <View style={styles.commentsSection}>
              <Text style={styles.sectionTitle}>Commentaires</Text>

              {billet.Commentaires && billet.Commentaires.length > 0 ? (
                <View style={styles.commentsList}>
                  {billet.Commentaires.map((commentaire, index) => (
                    <View key={commentaire.id || index} style={styles.commentCard}>
                      <Text style={styles.commentAuthor}>
                        {getCommentAuthorName(commentaire)}
                      </Text>
                      <Text style={styles.commentDate}>
                        {formatDate(commentaire.Date)}
                      </Text>
                      <Text style={styles.commentText}>{commentaire.Contenu}</Text>

                      {isAdmin ? (
                        <ActionButton
                          icon="trash"
                          label="Supprimer le commentaire"
                          loading={deletingCommentId === commentaire.id}
                          onPress={() => confirmDeleteComment(commentaire.id)}
                          variant="danger"
                        />
                      ) : null}
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.emptyText}>Aucun commentaire pour ce billet.</Text>
              )}

              {!initialized ? null : !isAuthenticated ? (
                <View style={styles.commentForm}>
                  <MessageBox message="Connectez-vous pour ajouter un commentaire." />
                  <ActionButton
                    icon="sign-in"
                    label="Connexion"
                    onPress={() => router.push("/login")}
                    variant="secondary"
                  />
                </View>
              ) : (
                <View style={styles.commentForm}>
                  <Text style={styles.label}>Ajouter un commentaire</Text>
                  <TextInput
                    multiline
                    onChangeText={setCommentContent}
                    placeholder="Votre commentaire"
                    style={[styles.input, styles.textArea]}
                    textAlignVertical="top"
                    value={commentContent}
                  />

                  {commentError ? (
                    <MessageBox message={commentError} tone="error" />
                  ) : null}
                  {commentSuccess ? (
                    <MessageBox message={commentSuccess} tone="success" />
                  ) : null}

                  <ActionButton
                    disabled={!commentContent.trim()}
                    icon="send"
                    label="Publier"
                    loading={isSubmittingComment}
                    onPress={handleCreateComment}
                  />
                </View>
              )}
            </View>
          </>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    backgroundColor: palette.background,
  },
  body: {
    gap: 16,
    padding: 18,
  },
  loadingBlock: {
    alignItems: "center",
    gap: 10,
    borderColor: palette.border,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: palette.surface,
    padding: 18,
  },
  loadingText: {
    color: palette.muted,
    fontSize: 14,
  },
  article: {
    gap: 14,
    borderColor: palette.border,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: palette.surface,
    padding: 18,
  },
  articleTitle: {
    color: palette.cyan,
    fontSize: 28,
    fontWeight: "900",
    lineHeight: 34,
  },
  meta: {
    color: palette.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  articleContent: {
    color: palette.text,
    fontSize: 16,
    lineHeight: 24,
  },
  adminActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    borderTopColor: palette.border,
    borderTopWidth: 1,
    paddingTop: 14,
  },
  commentsSection: {
    gap: 14,
  },
  sectionTitle: {
    color: palette.text,
    fontSize: 23,
    fontWeight: "900",
  },
  commentsList: {
    gap: 12,
  },
  commentCard: {
    gap: 8,
    borderColor: palette.border,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: palette.surface,
    padding: 14,
  },
  commentAuthor: {
    color: palette.purple,
    fontSize: 15,
    fontWeight: "900",
  },
  commentDate: {
    color: palette.muted,
    fontSize: 12,
  },
  commentText: {
    color: palette.text,
    fontSize: 15,
    lineHeight: 22,
  },
  emptyText: {
    color: palette.muted,
    fontSize: 15,
  },
  commentForm: {
    gap: 12,
    borderColor: palette.border,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: palette.surface,
    padding: 14,
  },
  label: {
    color: palette.text,
    fontSize: 14,
    fontWeight: "800",
  },
  input: {
    minHeight: 46,
    borderColor: palette.border,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: palette.surface,
    color: palette.text,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  textArea: {
    minHeight: 120,
  },
});
