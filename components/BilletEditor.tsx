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
import { ActionButton, MessageBox, palette } from "./ui";

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
        if (Number.isFinite(savedBilletId) && savedBilletId > 0) {
          router.replace({
            pathname: "/billets/[id]",
            params: { id: String(savedBilletId) },
          });
        } else {
          router.replace("/");
        }
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
          onPress={() => router.push("/login")}
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
      style={styles.keyboard}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <AppHeader />

        <View style={styles.form}>
          <Text style={styles.screenTitle}>
            {mode === "create" ? "Nouveau billet" : "Modifier le billet"}
          </Text>
          <Text style={styles.helpText}>
            Creation et modification reservees aux administrateurs.
          </Text>

          <View style={styles.field}>
            <Text style={styles.label}>Date</Text>
            <TextInput
              autoCapitalize="none"
              inputMode="numeric"
              onChangeText={setDate}
              placeholder="AAAA-MM-JJ"
              style={styles.input}
              value={date}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Titre</Text>
            <TextInput
              onChangeText={setTitre}
              placeholder="Titre du billet"
              style={styles.input}
              value={titre}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Contenu</Text>
            <TextInput
              multiline
              onChangeText={setContenu}
              placeholder="Contenu du billet"
              style={[styles.input, styles.textArea]}
              textAlignVertical="top"
              value={contenu}
            />
          </View>

          {errorMessage ? (
            <MessageBox message={errorMessage} tone="error" />
          ) : null}

          <View style={styles.buttonRow}>
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
              onPress={() =>
                billet
                  ? router.replace({
                      pathname: "/billets/[id]",
                      params: { id: String(billet.id) },
                    })
                  : router.replace("/")
              }
              variant="ghost"
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Screen({ children }: { children: ReactNode }) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <AppHeader />
      <View style={styles.form}>{children}</View>
    </ScrollView>
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
  form: {
    gap: 16,
    padding: 18,
  },
  screenTitle: {
    color: palette.cyan,
    fontSize: 26,
    fontWeight: "900",
  },
  helpText: {
    color: palette.muted,
    fontSize: 14,
    lineHeight: 20,
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
  textArea: {
    minHeight: 180,
  },
  buttonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
});
