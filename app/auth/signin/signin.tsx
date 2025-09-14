import { Session } from "@/app/session/session";
import SignInForm from "../../components/SignInForm";
import { redirect } from "next/navigation";
import ClientSessionGuard from "./ClientSessionGuard";

export default async function SignInComponent() {
  const data = await Session();

  // If server-side session check finds a user, redirect immediately
  if (data?.user) {
    redirect("/dashboard");
  }

  // If no server-side session, use client-side guard as fallback
  return (
    <ClientSessionGuard>
      <SignInForm />
    </ClientSessionGuard>
  );
}
