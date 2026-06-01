import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { useAuth } from "./AuthProvider";
import { ActionButton, palette } from "./ui";

export default function AppHeader() {
  const router = useRouter();
  const { initialized, isAdmin, isAuthenticated, logout, user } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const userName = user?.nom ?? user?.name ?? user?.email;

  function goToBillets() {
    if (router.canDismiss()) {
      router.dismissAll();
      return;
    }

    router.replace("/");
  }

  async function handleLogout() {
    setIsLoggingOut(true);

    try {
      await logout();
      goToBillets();
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <View style={styles.header}>
      <View style={styles.brandRow}>
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="contain"
          source={require("../assets/images/logo_lp.png")}
          style={styles.logo}
        />
        <View style={styles.brandText}>
          <Text style={styles.appName}>B2LP</Text>
          <Text style={styles.tagline}>Le blog de Lyon Palme</Text>
        </View>
      </View>

      {initialized && userName ? (
        <Text style={styles.userText}>
          Connecte en tant que {userName}
          {user?.role ? ` (${user.role})` : ""}
        </Text>
      ) : null}

      <View style={styles.actions}>
        <ActionButton
          icon="newspaper-o"
          label="Billets"
          onPress={goToBillets}
          variant="ghost"
        />

        {isAdmin ? (
          <ActionButton
            icon="plus"
            label="Nouveau"
            onPress={() => router.navigate("/admin/billets/new")}
            variant="cyan"
          />
        ) : null}

        {initialized && isAuthenticated ? (
          <ActionButton
            icon="sign-out"
            label="Deconnexion"
            loading={isLoggingOut}
            onPress={handleLogout}
            variant="secondary"
          />
        ) : (
          <>
            <ActionButton
              icon="user-plus"
              label="Inscription"
              onPress={() => router.navigate("/register")}
              variant="cyan"
            />
            <ActionButton
              icon="sign-in"
              label="Connexion"
              onPress={() => router.navigate("/login")}
              variant="secondary"
            />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
    backgroundColor: palette.surface,
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 16,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logo: {
    width: 128,
    height: 42,
  },
  brandText: {
    flex: 1,
  },
  appName: {
    color: palette.purple,
    fontSize: 24,
    fontWeight: "900",
  },
  tagline: {
    marginTop: 2,
    color: palette.muted,
    fontSize: 14,
  },
  userText: {
    color: palette.muted,
    fontSize: 12,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
});
