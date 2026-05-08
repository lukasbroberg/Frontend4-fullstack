import { Redirect } from "expo-router";

/** Redirects the app root to the login screen. */
export default function Index() {
  return <Redirect href="/(tabs)/feed" />;
}
