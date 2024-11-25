import { Redirect } from "expo-router";
import { useToken } from "@/context/TokenContext";

export default () => {
  const { token } = useToken();

  return token ? <Redirect href="(tabs)" /> : <Redirect href="/unAuth" />;
};
