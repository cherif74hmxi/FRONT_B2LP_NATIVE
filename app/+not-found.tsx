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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: palette.background,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: palette.text,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: palette.purple,
    fontWeight: "800",
  },
});
