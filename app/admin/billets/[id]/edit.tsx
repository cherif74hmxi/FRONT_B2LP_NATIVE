import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import AppHeader from "@/components/AppHeader";
import { useAuth } from "@/components/AuthProvider";
import BilletEditor from "@/components/BilletEditor";
import { fetchBillet } from "@/components/api";
import type { Billet } from "@/components/types";
import { MessageBox, palette } from "@/components/ui";

export default function EditBilletScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { initialized, isAdmin, isAuthenticated, token } = useAuth();
  const billetId = Array.isArray(id) ? id[0] : id;
  const [billet, setBillet] = useState<Billet>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);

  const loadBillet = useCallback(async () => {
    if (!initialized || !isAuthenticated || !isAdmin || !billetId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage(undefined);

    try {
      const nextBillet = await fetchBillet(billetId, token);
      setBillet(nextBillet);
    } catch (error) {
      setBillet(undefined);
      setErrorMessage(error instanceof Error ? error.message : "Erreur inconnue");
    } finally {
      setIsLoading(false);
    }
  }, [billetId, initialized, isAdmin, isAuthenticated, token]);

  useFocusEffect(
    useCallback(() => {
      loadBillet();
    }, [loadBillet]),
  );

  if (!initialized || !isAuthenticated || !isAdmin) {
    return <BilletEditor mode="edit" />;
  }

  if (isLoading) {
    return (
      <ScrollView contentContainerStyle={styles.content}>
        <AppHeader />
        <View style={styles.stateBlock}>
          <ActivityIndicator color={palette.cyan} />
          <Text style={styles.loadingText}>Chargement du billet...</Text>
        </View>
      </ScrollView>
    );
  }

  if (errorMessage || !billet) {
    return (
      <ScrollView contentContainerStyle={styles.content}>
        <AppHeader />
        <View style={styles.stateBlock}>
          <MessageBox
            message={errorMessage ?? "Billet introuvable."}
            title="Impossible de charger le billet"
            tone="error"
          />
        </View>
      </ScrollView>
    );
  }

  return <BilletEditor billet={billet} mode="edit" />;
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    backgroundColor: palette.background,
  },
  stateBlock: {
    alignItems: "center",
    gap: 12,
    padding: 18,
  },
  loadingText: {
    color: palette.muted,
    fontSize: 14,
  },
});
