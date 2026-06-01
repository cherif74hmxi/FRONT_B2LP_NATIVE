import FontAwesome from "@expo/vector-icons/FontAwesome";
import type React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { palette } from "./theme";

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
  const textColor = getButtonTextColor(variant);

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
        <FontAwesome color={textColor} name={icon} size={15} />
      ) : null}
      <Text style={[styles.buttonText, { color: textColor }]}>{label}</Text>
    </Pressable>
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
