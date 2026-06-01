import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { palette } from "@/components/ui";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Introuvable" }} />
      <View style={styles.container}>
        <Text style={styles.title}>Cette page n'existe pas.</Text>

        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Retour aux billets</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.background,
    padding: 20,
  },
  title: {
    color: palette.text,
    fontSize: 20,
    fontWeight: "900",
  },
  link: {
    marginTop: 16,
    paddingVertical: 16,
  },
  linkText: {
    color: palette.purple,
    fontSize: 14,
    fontWeight: "800",
  },
});
