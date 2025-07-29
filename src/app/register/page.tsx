import { register } from "@/lib/actions/register";
import { AuthForm } from "@/components/AuthForm";

export default function RegisterPage() {
  return (
    <div className="w-full max-w-xl mx-auto">
      <AuthForm action={register} type="register" />
    </div>
  );
}
