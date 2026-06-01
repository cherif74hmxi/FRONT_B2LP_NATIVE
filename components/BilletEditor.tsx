import { useRouter } from "expo-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useAuth } from "./AuthProvider";
import AppHeader from "./AppHeader";
import { createBillet, updateBillet } from "./api";
import type { Billet } from "./types";
import { ActionButton, MessageBox, palette, sharedStyles } from "./ui";

type BilletEditorProps = {
  mode: "create" | "edit";
  billet?: Billet;
};

function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

export default function BilletEditor({ mode, billet }: BilletEditorProps) {
  const router = useRouter();
  const { initialized, isAdmin, isAuthenticated, token } = useAuth();
  const [date, setDate] = useState(billet?.Date ?? getTodayDate());
  const [titre, setTitre] = useState(billet?.Titre ?? "");
  const [contenu, setContenu] = useState(billet?.Contenu ?? "");
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (billet) {
      setDate(billet.Date);
      setTitre(billet.Titre);
      setContenu(billet.Contenu);
    }
  }, [billet]);

  async function handleSubmit() {
    if (!token) {
      setErrorMessage("Vous devez etre connecte.");
      return;
    }

    setErrorMessage(undefined);
    setIsSubmitting(true);

    try {
      const savedBillet =
        mode === "create"
          ? await createBillet(token, { date, titre, contenu })
          : await updateBillet(token, billet!.id, { date, titre, contenu });
      const savedBilletId = Number(savedBillet.id);

      if (mode === "create") {
        router.replace(
          Number.isFinite(savedBilletId) && savedBilletId > 0
            ? { pathname: "/billets/[id]", params: { id: String(savedBilletId) } }
            : "/",
        );
        return;
      }

      if (router.canGoBack()) {
        router.back();
        return;
      }

      router.replace({
        pathname: "/billets/[id]",
        params: { id: String(billet!.id) },
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Enregistrement impossible",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCancel() {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    if (billet) {
      router.replace({
        pathname: "/billets/[id]",
        params: { id: String(billet.id) },
      });
      return;
    }

    router.replace("/");
  }

  if (!initialized) {
    return (
      <Screen>
        <MessageBox message="Verification de la session..." />
      </Screen>
    );
  }

  if (!isAuthenticated) {
    return (
      <Screen>
        <MessageBox message="Vous devez etre connecte pour administrer les billets." />
        <ActionButton
          icon="sign-in"
          label="Connexion"
          onPress={() => router.replace("/login")}
          variant="secondary"
        />
      </Screen>
    );
  }

  if (!isAdmin) {
    return (
      <Screen>
        <MessageBox
          message="Acces reserve aux administrateurs."
          tone="warning"
        />
      </Screen>
    );
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
          <Text style={sharedStyles.title}>
            {mode === "create" ? "Nouveau billet" : "Modifier le billet"}
          </Text>
          <Text style={sharedStyles.helperText}>
            Creation et modification reservees aux administrateurs.
          </Text>

          <FormField label="Date">
            <TextInput
              autoCapitalize="none"
              inputMode="numeric"
              onChangeText={setDate}
              placeholder="AAAA-MM-JJ"
              placeholderTextColor={palette.muted}
              style={sharedStyles.input}
              value={date}
            />
          </FormField>

          <FormField label="Titre">
            <TextInput
              onChangeText={setTitre}
              placeholder="Titre du billet"
              placeholderTextColor={palette.muted}
              style={sharedStyles.input}
              value={titre}
            />
          </FormField>

          <FormField label="Contenu">
            <TextInput
              multiline
              onChangeText={setContenu}
              placeholder="Contenu du billet"
              placeholderTextColor={palette.muted}
              style={[sharedStyles.input, styles.contentInput]}
              textAlignVertical="top"
              value={contenu}
            />
          </FormField>

          {errorMessage ? <MessageBox message={errorMessage} tone="error" /> : null}

          <View style={sharedStyles.actionsRow}>
            <ActionButton
              disabled={!date || !titre || !contenu}
              icon="save"
              label={mode === "create" ? "Creer" : "Modifier"}
              loading={isSubmitting}
              onPress={handleSubmit}
            />
            <ActionButton
              icon="times"
              label="Annuler"
              onPress={handleCancel}
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

function Screen({ children }: { children: ReactNode }) {
  return (
    <ScrollView
      style={sharedStyles.scroll}
      contentContainerStyle={sharedStyles.scrollContent}
    >
      <AppHeader />
      <View style={sharedStyles.pageBody}>{children}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentInput: {
    minHeight: 176,
  },
});
