import { login } from "@/lib/actions/login";
import { AuthForm } from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <div className="w-full max-w-xl mx-auto">
      <AuthForm type="login" action={login} />
    </div>
  );
}