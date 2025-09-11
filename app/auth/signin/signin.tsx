import { Session } from "@/app/session/session";
import SignInForm from "../../components/SignInForm";
import { redirect } from "next/navigation";
export default async function SignInComponent() {
  const data = await Session();
  if (data?.user) {
    redirect("/dashboard");
  }
  return <SignInForm />;
}
