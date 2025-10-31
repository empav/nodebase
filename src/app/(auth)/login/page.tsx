import SignForm from "@/features/auth/components/SignForm";
import { requireUnAuth } from "@/lib/auth-utils";

export default async function Login() {
  await requireUnAuth();
  return <SignForm isLogin />;
}
