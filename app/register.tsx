import { useRouter } from "expo-router";
import type { ReactNode } from "react";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import AppHeader from "@/components/AppHeader";
import { registerUser } from "@/components/api";
import { ActionButton, MessageBox, palette, sharedStyles } from "@/components/ui";

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
      style={sharedStyles.screen}
    >
      <ScrollView
        style={sharedStyles.scroll}
        contentContainerStyle={sharedStyles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <AppHeader />

        <View style={sharedStyles.pageBody}>
          <Text style={sharedStyles.title}>Inscription</Text>
          <Text style={sharedStyles.subtitle}>
            Creez un compte adherent pour lire et ajouter des commentaires.
          </Text>

          <FormField label="Nom">
            <TextInput
              autoComplete="name"
              onChangeText={setName}
              placeholder="Votre nom"
              placeholderTextColor={palette.muted}
              style={sharedStyles.input}
              value={name}
            />
          </FormField>

          <FormField label="Email">
            <TextInput
              autoCapitalize="none"
              autoComplete="email"
              inputMode="email"
              keyboardType="email-address"
              onChangeText={setEmail}
              placeholder="email@exemple.fr"
              placeholderTextColor={palette.muted}
              style={sharedStyles.input}
              value={email}
            />
          </FormField>

          <FormField label="Mot de passe">
            <TextInput
              autoComplete="new-password"
              onChangeText={setPassword}
              placeholder="8 caracteres minimum"
              placeholderTextColor={palette.muted}
              secureTextEntry
              style={sharedStyles.input}
              value={password}
            />
          </FormField>

          {errorMessage ? <MessageBox message={errorMessage} tone="error" /> : null}
          {successMessage ? <MessageBox message={successMessage} tone="success" /> : null}

          <View style={sharedStyles.actionsRow}>
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
              onPress={() => router.replace("/login")}
              variant="ghost"
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function FormField({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <View style={sharedStyles.field}>
      <Text style={sharedStyles.label}>{label}</Text>
      {children}
    </View>
  );
}
