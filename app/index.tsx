import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AppHeader from "@/components/AppHeader";
import { fetchBillets } from "@/components/api";
import type { Billet } from "@/components/types";
import {
  ActionButton,
  MessageBox,
  formatDate,
  getBilletAuthorName,
  palette,
} from "@/components/ui";

export default function HomeScreen() {
  const router = useRouter();
  const [billets, setBillets] = useState<Billet[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>();
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

  return (
    <FlatList
      contentContainerStyle={styles.listContent}
      data={billets}
      keyExtractor={(item) => String(item.id)}
      ListHeaderComponent={
        <>
          <AppHeader />
          <View style={styles.intro}>
            <Text style={styles.title}>Liste des billets</Text>
            <Text style={styles.subtitle}>
              Consultez les actualites du club et les commentaires associes.
            </Text>
          </View>
        </>
      }
      ListEmptyComponent={
        <View style={styles.stateBlock}>
          {isLoading ? (
            <>
              <ActivityIndicator color={palette.cyan} />
              <Text style={styles.loadingText}>Chargement des billets...</Text>
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
        <Pressable
          onPress={() =>
            router.push({
              pathname: "/billets/[id]",
              params: { id: String(item.id) },
            })
          }
          style={({ pressed }) => [styles.card, pressed ? styles.pressed : undefined]}
        >
          <View style={styles.cardHeader}>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{item.Titre}</Text>
              <Text style={styles.cardMeta}>
                Cree le {formatDate(item.Date)} par {getBilletAuthorName(item.Auteur)}
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </View>
          <Text numberOfLines={4} style={styles.cardContent}>
            {item.Contenu}
          </Text>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    flexGrow: 1,
    gap: 14,
    paddingBottom: 28,
    backgroundColor: palette.background,
  },
  intro: {
    gap: 7,
    paddingHorizontal: 18,
    paddingTop: 20,
  },
  title: {
    color: palette.cyan,
    fontSize: 28,
    fontWeight: "900",
  },
  subtitle: {
    color: palette.muted,
    fontSize: 15,
    lineHeight: 21,
  },
  stateBlock: {
    gap: 12,
    paddingHorizontal: 18,
    paddingTop: 8,
  },
  loadingText: {
    color: palette.muted,
    fontSize: 14,
    textAlign: "center",
  },
  card: {
    marginHorizontal: 18,
    gap: 12,
    borderColor: palette.border,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: palette.surface,
    padding: 16,
  },
  pressed: {
    opacity: 0.74,
  },
  cardHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 12,
  },
  cardText: {
    flex: 1,
    gap: 5,
  },
  cardTitle: {
    color: palette.cyan,
    fontSize: 20,
    fontWeight: "900",
    lineHeight: 25,
  },
  cardMeta: {
    color: palette.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  chevron: {
    color: palette.purple,
    fontSize: 32,
    fontWeight: "500",
    lineHeight: 34,
  },
  cardContent: {
    color: palette.text,
    fontSize: 15,
    lineHeight: 22,
  },
});
