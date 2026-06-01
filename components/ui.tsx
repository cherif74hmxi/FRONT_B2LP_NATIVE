import FontAwesome from "@expo/vector-icons/FontAwesome";
import type React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
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
      disabled={inactive}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        styles[`${variant}Button`],
        fullWidth ? styles.fullWidth : undefined,
        pressed && !inactive ? styles.pressed : undefined,
        inactive ? styles.disabled : undefined,
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
      <Text style={[styles.buttonText, styles[`${variant}Text`]]}>
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
  return (
    <View style={[styles.messageBox, styles[`${tone}Box`]]}>
      {title ? <Text style={[styles.messageTitle, styles[`${tone}TextBox`]]}>{title}</Text> : null}
      <Text style={[styles.messageText, styles[`${tone}TextBox`]]}>{message}</Text>
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

const styles = StyleSheet.create({
  button: {
    minHeight: 42,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
  },
  fullWidth: {
    width: "100%",
  },
  pressed: {
    opacity: 0.72,
  },
  disabled: {
    opacity: 0.55,
  },
  primaryButton: {
    backgroundColor: palette.purple,
    borderColor: palette.purple,
  },
  secondaryButton: {
    backgroundColor: palette.purpleSoft,
    borderColor: palette.purpleSoft,
  },
  cyanButton: {
    backgroundColor: palette.cyanSoft,
    borderColor: palette.cyanSoft,
  },
  dangerButton: {
    backgroundColor: palette.danger,
    borderColor: palette.danger,
  },
  ghostButton: {
    backgroundColor: "#eef2f7",
    borderColor: "#eef2f7",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "700",
  },
  primaryText: {
    color: "#fff",
  },
  secondaryText: {
    color: palette.purple,
  },
  cyanText: {
    color: "#155e75",
  },
  dangerText: {
    color: "#fff",
  },
  ghostText: {
    color: palette.text,
  },
  messageBox: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 14,
  },
  neutralBox: {
    backgroundColor: palette.surface,
    borderColor: palette.border,
  },
  errorBox: {
    backgroundColor: palette.dangerSoft,
    borderColor: "#fecaca",
  },
  successBox: {
    backgroundColor: palette.successSoft,
    borderColor: "#bbf7d0",
  },
  warningBox: {
    backgroundColor: palette.warningSoft,
    borderColor: "#fde68a",
  },
  messageTitle: {
    marginBottom: 4,
    fontSize: 15,
    fontWeight: "800",
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  neutralTextBox: {
    color: palette.text,
  },
  errorTextBox: {
    color: "#991b1b",
  },
  successTextBox: {
    color: palette.success,
  },
  warningTextBox: {
    color: palette.warning,
  },
});
