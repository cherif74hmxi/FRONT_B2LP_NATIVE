import FontAwesome from "@expo/vector-icons/FontAwesome";
import { AuthProvider } from "@/components/AuthProvider";
import { palette } from "@/components/ui";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  initialRouteName: "index",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <AuthProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            contentStyle: { backgroundColor: palette.background },
            headerStyle: { backgroundColor: palette.surface },
            headerTintColor: palette.purple,
            headerTitleStyle: { fontWeight: "800" },
          }}
        >
          <Stack.Screen name="index" options={{ title: "Billets" }} />
          <Stack.Screen name="login" options={{ title: "Connexion" }} />
          <Stack.Screen name="register" options={{ title: "Inscription" }} />
          <Stack.Screen name="billets/[id]" options={{ title: "Billet" }} />
          <Stack.Screen
            name="admin/billets/new"
            options={{ title: "Nouveau billet" }}
          />
          <Stack.Screen
            name="admin/billets/[id]/edit"
            options={{ title: "Modifier le billet" }}
          />
          <Stack.Screen name="+not-found" options={{ title: "Introuvable" }} />
        </Stack>
      </AuthProvider>
    </ThemeProvider>
  );
}
