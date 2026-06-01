import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import AppHeader from "@/components/AppHeader";
import { useAuth } from "@/components/AuthProvider";
import { ActionButton, MessageBox, palette } from "@/components/ui";

export default function LoginScreen() {
  const router = useRouter();
  const { initialized, isAuthenticated, login, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userName = user?.nom ?? user?.name ?? user?.email;

  async function handleSubmit() {
    setErrorMessage(undefined);
    setIsSubmitting(true);

    try {
      await login(email.trim(), password);
      router.replace("/");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Connexion impossible");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.keyboard}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <AppHeader />

        <View style={styles.panel}>
          <Text style={styles.title}>Connexion</Text>
          <Text style={styles.subtitle}>
            Connectez-vous pour commenter ou administrer les billets.
          </Text>

          {initialized && isAuthenticated ? (
            <>
              <MessageBox message={`Vous etes deja connecte${userName ? ` : ${userName}` : ""}.`} />
              <ActionButton
                icon="newspaper-o"
                label="Retour aux billets"
                onPress={() => router.replace("/")}
                variant="secondary"
              />
            </>
          ) : (
            <>
              <View style={styles.field}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  autoCapitalize="none"
                  autoComplete="email"
                  inputMode="email"
                  keyboardType="email-address"
                  onChangeText={setEmail}
                  placeholder="email@exemple.fr"
                  style={styles.input}
                  value={email}
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Mot de passe</Text>
                <TextInput
                  autoComplete="current-password"
                  onChangeText={setPassword}
                  placeholder="Votre mot de passe"
                  secureTextEntry
                  style={styles.input}
                  value={password}
                />
              </View>

              {errorMessage ? <MessageBox message={errorMessage} tone="error" /> : null}

              <View style={styles.buttonRow}>
                <ActionButton
                  disabled={!email || !password || !initialized}
                  icon="sign-in"
                  label="Se connecter"
                  loading={isSubmitting}
                  onPress={handleSubmit}
                />
                <ActionButton
                  icon="user-plus"
                  label="Creer un compte"
                  onPress={() => router.push("/register")}
                  variant="ghost"
                />
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
    backgroundColor: palette.background,
  },
  content: {
    flexGrow: 1,
    backgroundColor: palette.background,
  },
  panel: {
    gap: 16,
    padding: 18,
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
  field: {
    gap: 7,
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
  buttonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
});
