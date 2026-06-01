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
import { registerUser } from "@/components/api";
import { ActionButton, MessageBox, palette } from "@/components/ui";

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>();
  const [successMessage, setSuccessMessage] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    setErrorMessage(undefined);
    setSuccessMessage(undefined);

    if (password.length < 8) {
      setErrorMessage("Le mot de passe doit contenir au moins 8 caracteres.");
      return;
    }

    setIsSubmitting(true);

    try {
      await registerUser(name.trim(), email.trim(), password);
      setSuccessMessage("Compte cree. Vous pouvez maintenant vous connecter.");
      router.replace("/login");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Inscription impossible");
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
          <Text style={styles.title}>Inscription</Text>
          <Text style={styles.subtitle}>
            Creez un compte adherent pour pouvoir commenter les billets.
          </Text>

          <View style={styles.field}>
            <Text style={styles.label}>Nom</Text>
            <TextInput
              autoComplete="name"
              onChangeText={setName}
              placeholder="Votre nom"
              style={styles.input}
              value={name}
            />
          </View>

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
              autoComplete="new-password"
              onChangeText={setPassword}
              placeholder="8 caracteres minimum"
              secureTextEntry
              style={styles.input}
              value={password}
            />
          </View>

          {errorMessage ? <MessageBox message={errorMessage} tone="error" /> : null}
          {successMessage ? <MessageBox message={successMessage} tone="success" /> : null}

          <View style={styles.buttonRow}>
            <ActionButton
              disabled={!name || !email || !password}
              icon="user-plus"
              label="Creer mon compte"
              loading={isSubmitting}
              onPress={handleSubmit}
            />
            <ActionButton
              icon="sign-in"
              label="Deja un compte"
              onPress={() => router.push("/login")}
              variant="ghost"
            />
          </View>
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
