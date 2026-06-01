import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AppHeader from "@/components/AppHeader";
import { useAuth } from "@/components/AuthProvider";
import { fetchBillets } from "@/components/api";
import type { Billet } from "@/components/types";
import {
  ActionButton,
  MessageBox,
  formatDate,
  getBilletAuthorName,
  palette,
  sharedStyles,
} from "@/components/ui";

export default function HomeScreen() {
  const router = useRouter();
  const { authRequired } = useLocalSearchParams<{ authRequired?: string }>();
  const { isAuthenticated } = useAuth();
  const [billets, setBillets] = useState<Billet[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [showAuthNotice, setShowAuthNotice] = useState(authRequired === "1");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadBillets = useCallback(async (refreshing = false) => {
    if (refreshing) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    setErrorMessage(undefined);

    try {
      const nextBillets = await fetchBillets();
      setBillets(nextBillets);
    } catch (error) {
      setBillets([]);
      setErrorMessage(error instanceof Error ? error.message : "Erreur inconnue");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadBillets();
    }, [loadBillets]),
  );

  useEffect(() => {
    if (authRequired === "1") {
      setShowAuthNotice(true);
    }
  }, [authRequired]);

  function handleOpenBillet(billetId: number) {
    if (!isAuthenticated) {
      setShowAuthNotice(true);
      return;
    }

    router.navigate({
      pathname: "/billets/[id]",
      params: { id: String(billetId) },
    });
  }

  return (
    <FlatList
      style={sharedStyles.scroll}
      contentContainerStyle={styles.listContent}
      data={billets}
      keyExtractor={(item) => String(item.id)}
      ListHeaderComponent={
        <>
          <AppHeader />
          <View style={styles.headerText}>
            <Text style={sharedStyles.title}>Liste des billets</Text>
            <Text style={sharedStyles.subtitle}>
              Consultez les actualites du club. Connectez-vous pour lire les
              commentaires et participer.
            </Text>
            {showAuthNotice && !isAuthenticated ? (
              <MessageBox
                message="Connectez-vous ou inscrivez-vous pour lire les commentaires d'un billet."
                tone="warning"
              />
            ) : null}
          </View>
        </>
      }
      ListEmptyComponent={
        <View style={styles.emptyState}>
          {isLoading ? (
            <>
              <ActivityIndicator color={palette.cyan} />
              <Text style={styles.loadingText}>
                Chargement des billets...
              </Text>
            </>
          ) : errorMessage ? (
            <>
              <MessageBox
                message="Reessayez plus tard ou contactez un administrateur."
                title="Impossible de charger les billets"
                tone="error"
              />
              <ActionButton
                icon="refresh"
                label="Reessayer"
                onPress={() => loadBillets()}
                variant="secondary"
              />
            </>
          ) : (
            <MessageBox message="Aucun billet trouve." />
          )}
        </View>
      }
      onRefresh={() => loadBillets(true)}
      refreshing={isRefreshing}
      renderItem={({ item }) => (
        <BilletCard
          billet={item}
          canOpenComments={isAuthenticated}
          onOpen={() => handleOpenBillet(item.id)}
        />
      )}
    />
  );
}

type BilletCardProps = {
  billet: Billet;
  canOpenComments: boolean;
  onOpen: () => void;
};

function BilletCard({
  billet,
  canOpenComments,
  onOpen,
}: BilletCardProps) {
  const content = (
    <>
      <View style={styles.cardTitleBlock}>
        <Text style={styles.cardTitle}>{billet.Titre}</Text>
        <Text style={styles.cardMeta}>
          Cree le {formatDate(billet.Date)} par{" "}
          {getBilletAuthorName(billet.Auteur)}
        </Text>
      </View>

      <Text style={styles.cardContent}>{billet.Contenu}</Text>

      {canOpenComments ? (
        <ActionButton
          icon="comments"
          label="Lire les commentaires"
          onPress={onOpen}
          variant="secondary"
        />
      ) : null}
    </>
  );

  return (
    <Pressable
      onPress={onOpen}
      style={({ pressed }) => [
        sharedStyles.card,
        styles.listItem,
        { opacity: pressed ? 0.74 : 1 },
      ]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  listContent: {
    flexGrow: 1,
    gap: 14,
    paddingBottom: 28,
  },
  headerText: {
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  emptyState: {
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  loadingText: {
    color: palette.muted,
    fontSize: 14,
    textAlign: "center",
  },
  listItem: {
    marginHorizontal: 16,
  },
  cardTitleBlock: {
    gap: 4,
  },
  cardTitle: {
    color: palette.cyan,
    fontSize: 20,
    fontWeight: "900",
    lineHeight: 28,
  },
  cardMeta: {
    color: palette.muted,
    fontSize: 12,
    lineHeight: 20,
  },
  cardContent: {
    color: palette.text,
    fontSize: 16,
    lineHeight: 24,
  },
});
