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

  async function handleLogout() {
    setIsLoggingOut(true);

    try {
      await logout();
      router.replace("/");
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
          <Text style={styles.title}>B2LP</Text>
          <Text style={styles.subtitle}>Le blog de Lyon Palme</Text>
        </View>
      </View>

      {initialized && userName ? (
        <Text style={styles.sessionText}>
          Connecte en tant que {userName}
          {user?.role ? ` (${user.role})` : ""}
        </Text>
      ) : null}

      <View style={styles.actions}>
        <ActionButton
          icon="newspaper-o"
          label="Billets"
          onPress={() => router.replace("/")}
          variant="ghost"
        />

        {isAdmin ? (
          <ActionButton
            icon="plus"
            label="Nouveau"
            onPress={() => router.push("/admin/billets/new")}
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
              onPress={() => router.push("/register")}
              variant="cyan"
            />
            <ActionButton
              icon="sign-in"
              label="Connexion"
              onPress={() => router.push("/login")}
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
    paddingHorizontal: 18,
    paddingBottom: 16,
    paddingTop: 18,
    backgroundColor: palette.surface,
    borderBottomColor: palette.border,
    borderBottomWidth: 1,
  },
  brandRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  logo: {
    width: 124,
    height: 38,
  },
  brandText: {
    flex: 1,
  },
  title: {
    color: palette.purple,
    fontSize: 24,
    fontWeight: "900",
  },
  subtitle: {
    color: palette.muted,
    fontSize: 14,
    marginTop: 2,
  },
  sessionText: {
    color: palette.muted,
    fontSize: 13,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
});
