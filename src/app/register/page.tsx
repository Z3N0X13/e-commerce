import { register } from "@/lib/actions/register.actions";
import { AuthForm } from "@/components/form/AuthForm";

export default function RegisterPage() {
  return (
    <div className="w-full max-w-xl mx-auto">
      <AuthForm action={register} type="register" />
    </div>
  );
}
