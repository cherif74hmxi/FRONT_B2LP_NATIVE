import { StyleSheet, Text, View } from "react-native";
import { palette } from "./theme";

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

const styles = StyleSheet.create({
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
