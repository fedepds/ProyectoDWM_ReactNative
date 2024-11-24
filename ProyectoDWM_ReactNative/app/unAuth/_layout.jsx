import { Stack } from "expo-router";

export default function RootLayout2() {

  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }}/>
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}