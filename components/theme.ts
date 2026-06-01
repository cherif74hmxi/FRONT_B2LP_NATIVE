import { StyleSheet } from "react-native";

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
