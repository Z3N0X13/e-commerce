import { login } from "@/lib/actions/login.actions";
import { AuthForm } from "@/components/form/AuthForm";

export default function LoginPage() {
  return (
    <div className="w-full max-w-xl mx-auto">
      <AuthForm type="login" action={login} />
    </div>
  );
}