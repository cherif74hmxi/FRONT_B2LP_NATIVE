import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AppHeader from "@/components/AppHeader";
import BilletArticle from "@/components/BilletArticle";
import CommentSection from "@/components/CommentSection";
import { useAuth } from "@/components/AuthProvider";
import {
  createCommentaire,
  deleteBillet,
  deleteCommentaire,
  fetchBillet,
} from "@/components/api";
import type { Billet } from "@/components/types";
import { ActionButton, MessageBox, palette, sharedStyles } from "@/components/ui";

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
      if (!initialized) {
        return;
      }

      if (!isAuthenticated || !billetId) {
        setIsLoading(false);
        return;
      }

      refreshing ? setIsRefreshing(true) : setIsLoading(true);
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
    [billetId, initialized, isAuthenticated, token],
  );

  useFocusEffect(
    useCallback(() => {
      loadBillet();
    }, [loadBillet]),
  );

  useEffect(() => {
    if (initialized && !isAuthenticated) {
      router.replace({
        pathname: "/",
        params: { authRequired: "1" },
      });
    }
  }, [initialized, isAuthenticated, router]);

  function handleBackToBillets() {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/");
  }

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
            handleBackToBillets();
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
      style={sharedStyles.scroll}
      contentContainerStyle={sharedStyles.scrollContent}
      refreshControl={
        <RefreshControl
          onRefresh={() => loadBillet(true)}
          refreshing={isRefreshing}
          tintColor={palette.cyan}
        />
      }
    >
      <AppHeader />

      <View style={sharedStyles.pageBody}>
        <ActionButton
          icon="arrow-left"
          label="Retour aux billets"
          onPress={handleBackToBillets}
          variant="ghost"
        />

        {!initialized || isLoading ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator color={palette.cyan} />
            <Text style={styles.loadingText}>Chargement du billet...</Text>
          </View>
        ) : !isAuthenticated ? (
          <MessageBox
            message="Retour aux billets..."
            tone="warning"
          />
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
            <BilletArticle
              billet={billet}
              isAdmin={isAdmin}
              isDeleting={isDeletingBillet}
              onDelete={confirmDeleteBillet}
              onEdit={() =>
                router.navigate({
                  pathname: "/admin/billets/[id]/edit",
                  params: { id: String(billet.id) },
                })
              }
            />
            <CommentSection
              billet={billet}
              commentContent={commentContent}
              commentError={commentError}
              commentSuccess={commentSuccess}
              deletingCommentId={deletingCommentId}
              isAdmin={isAdmin}
              isSubmittingComment={isSubmittingComment}
              onChangeComment={setCommentContent}
              onCreateComment={handleCreateComment}
              onDeleteComment={confirmDeleteComment}
            />
          </>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingCard: {
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 8,
    backgroundColor: palette.surface,
    padding: 16,
  },
  loadingText: {
    color: palette.muted,
    fontSize: 14,
  },
});
