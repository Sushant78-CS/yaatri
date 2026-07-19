import useAuth from "@/hooks/useAuth";
import { Redirect } from "expo-router";

const IndexPage = () => {
  const { user } = useAuth();

  if (user) {
    return <Redirect href={"/screens"} />;
  } else {
    return <Redirect href={"/(auth)/sign-in"} />;
  }
};

export default IndexPage;
