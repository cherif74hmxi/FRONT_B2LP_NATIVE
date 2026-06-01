import FontAwesome from "@expo/vector-icons/FontAwesome";
import type React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import type { Billet, Commentaire } from "./types";

export const palette = {
  background: "#f8fafc",
  surface: "#ffffff",
  border: "#dbe3ec",
  text: "#0f172a",
  muted: "#64748b",
  cyan: "#0e7490",
  cyanSoft: "#cffafe",
  purple: "#3b0764",
  purpleSoft: "#f3e8ff",
  danger: "#b91c1c",
  dangerSoft: "#fee2e2",
  success: "#166534",
  successSoft: "#dcfce7",
  warning: "#92400e",
  warningSoft: "#fef3c7",
};

type ButtonVariant = "primary" | "secondary" | "cyan" | "danger" | "ghost";
type IconName = React.ComponentProps<typeof FontAwesome>["name"];

type ActionButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  icon?: IconName;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
};

export function ActionButton({
  label,
  onPress,
  variant = "primary",
  icon,
  disabled,
  loading,
  fullWidth,
}: ActionButtonProps) {
  const inactive = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive }}
      disabled={inactive}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        buttonVariantStyles[variant],
        fullWidth ? styles.fullWidth : null,
        { opacity: inactive ? 0.55 : pressed ? 0.72 : 1 },
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" || variant === "danger" ? "#fff" : palette.text}
          size="small"
        />
      ) : icon ? (
        <FontAwesome
          color={getButtonTextColor(variant)}
          name={icon}
          size={15}
        />
      ) : null}
      <Text style={[styles.buttonText, { color: getButtonTextColor(variant) }]}>
        {label}
      </Text>
    </Pressable>
  );
}

type MessageBoxProps = {
  title?: string;
  message: string;
  tone?: "error" | "success" | "warning" | "neutral";
};

export function MessageBox({ title, message, tone = "neutral" }: MessageBoxProps) {
  const textColor = messageTextColors[tone];

  return (
    <View style={[styles.messageBox, messageBoxStyles[tone]]}>
      {title ? (
        <Text style={[styles.messageTitle, { color: textColor }]}>{title}</Text>
      ) : null}
      <Text style={[styles.messageText, { color: textColor }]}>{message}</Text>
    </View>
  );
}

export function formatDate(date: string): string {
  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
  }).format(parsedDate);
}

export function getBilletAuthorName(auteur: Billet["Auteur"]): string {
  if (!auteur) {
    return "Auteur inconnu";
  }

  if (typeof auteur === "string") {
    return auteur;
  }

  return auteur.nom ?? auteur.name ?? auteur.email;
}

export function getCommentAuthorName(commentaire: Commentaire): string {
  return (
    commentaire.Auteur ??
    commentaire.Utilisateur?.nom ??
    commentaire.Utilisateur?.name ??
    "Auteur inconnu"
  );
}

function getButtonTextColor(variant: ButtonVariant) {
  if (variant === "primary" || variant === "danger") {
    return "#fff";
  }

  if (variant === "cyan") {
    return "#155e75";
  }

  if (variant === "ghost") {
    return palette.muted;
  }

  return palette.purple;
}

export const sharedStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.background,
  },
  scroll: {
    backgroundColor: palette.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  pageBody: {
    gap: 16,
    padding: 16,
  },
  card: {
    gap: 12,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 8,
    backgroundColor: palette.surface,
    padding: 16,
  },
  smallCard: {
    gap: 12,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 8,
    backgroundColor: palette.surface,
    padding: 14,
  },
  actionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  title: {
    color: palette.cyan,
    fontSize: 30,
    fontWeight: "900",
  },
  subtitle: {
    color: palette.muted,
    fontSize: 16,
    lineHeight: 24,
  },
  helperText: {
    color: palette.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  field: {
    gap: 8,
  },
  label: {
    color: palette.text,
    fontSize: 14,
    fontWeight: "800",
  },
  input: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    backgroundColor: palette.surface,
    color: palette.text,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  multilineInput: {
    minHeight: 128,
    textAlignVertical: "top",
  },
});

const styles = StyleSheet.create({
  button: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  fullWidth: {
    width: "100%",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "700",
  },
  messageBox: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
  },
  messageTitle: {
    marginBottom: 4,
    fontSize: 14,
    fontWeight: "800",
    lineHeight: 20,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

const buttonVariantStyles = StyleSheet.create({
  primary: {
    borderColor: palette.purple,
    backgroundColor: palette.purple,
  },
  secondary: {
    borderColor: palette.purpleSoft,
    backgroundColor: palette.purpleSoft,
  },
  cyan: {
    borderColor: palette.cyanSoft,
    backgroundColor: palette.cyanSoft,
  },
  danger: {
    borderColor: palette.danger,
    backgroundColor: palette.danger,
  },
  ghost: {
    borderColor: "#e2e8f0",
    backgroundColor: "#f1f5f9",
  },
});

const messageBoxStyles = StyleSheet.create({
  neutral: {
    borderColor: palette.border,
    backgroundColor: palette.surface,
  },
  error: {
    borderColor: "#fecaca",
    backgroundColor: palette.dangerSoft,
  },
  success: {
    borderColor: "#bbf7d0",
    backgroundColor: palette.successSoft,
  },
  warning: {
    borderColor: "#fde68a",
    backgroundColor: palette.warningSoft,
  },
});

const messageTextColors = {
  neutral: palette.text,
  error: "#991b1b",
  success: palette.success,
  warning: palette.warning,
};
