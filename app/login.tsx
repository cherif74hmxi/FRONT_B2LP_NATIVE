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
import { useAuth } from "@/components/AuthProvider";
import { ActionButton, MessageBox, palette, sharedStyles } from "@/components/ui";

export default function LoginScreen() {
  const router = useRouter();
  const { initialized, isAuthenticated, login, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userName = user?.nom ?? user?.name ?? user?.email;

  function goToBillets() {
    if (router.canDismiss()) {
      router.dismissAll();
      return;
    }

    router.replace("/");
  }

  async function handleSubmit() {
    setErrorMessage(undefined);
    setIsSubmitting(true);

    try {
      await login(email.trim(), password);
      goToBillets();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Connexion impossible");
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
          <Text style={sharedStyles.title}>Connexion</Text>
          <Text style={sharedStyles.subtitle}>
            Connectez-vous pour lire les commentaires ou administrer les billets.
          </Text>

          {initialized && isAuthenticated ? (
            <>
              <MessageBox
                message={`Vous etes deja connecte${userName ? ` : ${userName}` : ""}.`}
              />
              <ActionButton
                icon="newspaper-o"
                label="Retour aux billets"
                onPress={goToBillets}
                variant="secondary"
              />
            </>
          ) : (
            <>
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
                  autoComplete="current-password"
                  onChangeText={setPassword}
                  placeholder="Votre mot de passe"
                  placeholderTextColor={palette.muted}
                  secureTextEntry
                  style={sharedStyles.input}
                  value={password}
                />
              </FormField>

              {errorMessage ? <MessageBox message={errorMessage} tone="error" /> : null}

              <View style={sharedStyles.actionsRow}>
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
                  onPress={() => router.replace("/register")}
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
