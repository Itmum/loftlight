"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { Check, Eye, EyeOff, Loader2, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

type FormState = {
  name: string;
  email: string;
  image: string;
  password: string;
};
type Errors = Partial<Record<keyof FormState, string>>;

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

const isHttpUrl = (value: string) => {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
};

// The three password rules from your brief
const passwordRules = (pw: string) => [
  { label: "At least 6 characters", ok: pw.length >= 6 },
  { label: "One uppercase letter (A–Z)", ok: /[A-Z]/.test(pw) },
  { label: "One lowercase letter (a–z)", ok: /[a-z]/.test(pw) },
];

function validate(f: FormState): Errors {
  const e: Errors = {};
  if (f.name.trim().length < 2)
    e.name = "Enter your name (at least 2 characters).";
  if (!EMAIL_REGEX.test(f.email.trim()))
    e.email = "Enter a valid email address.";
  if (f.image.trim() && !isHttpUrl(f.image.trim()))
    e.image = "Photo URL must be a valid link starting with https://";
  const failed = passwordRules(f.password).find((r) => !r.ok);
  if (failed) e.password = `Password needs: ${failed.label.toLowerCase()}.`;
  return e;
}

const FieldMessage = ({ message }: { message?: string }) =>
  message ? (
    <p role="alert" className="text-sm text-destructive">
      {message}
    </p>
  ) : null;

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    image: "",
    password: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const set = (key: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const handleEmailSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    const found = validate(form);
    setErrors(found);
    const messages = Object.values(found).filter(Boolean) as string[];
    if (messages.length > 0) {
      toast.error(
        messages.length === 1
          ? messages[0]
          : `${messages[0]} (${messages.length - 1} more to fix)`,
      );
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Creating your account…");
    try {
      const { error } = await authClient.signUp.email({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        ...(form.image.trim() ? { image: form.image.trim() } : {}),
      });

      if (error) {
        toast.error(error.message ?? "Couldn’t create your account.", {
          id: toastId,
        });
        return;
      }

      toast.success("Account created. Please log in.", { id: toastId });
      router.push("/login");
    } catch {
      toast.error("Can’t reach the server. Please try again.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      // Redirects to Google, then back to your home page
      await authClient.signIn.social({ provider: "google", callbackURL: "/" });
    } catch {
      toast.error("Google sign-in failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="mx-auto my-6 flex max-w-3xl flex-col gap-6 px-4">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="font-serif text-2xl">
            Create your account
          </CardTitle>
          <CardDescription>
            Join to book studios or list your own space.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* noValidate: our own validation shows the messages, not the browser's popups */}
          <form onSubmit={handleEmailSignUp} noValidate>
            <FieldGroup>
              <Field>
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleGoogle}
                  disabled={googleLoading || loading}
                >
                  {googleLoading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="size-4"
                    >
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                  )}
                  Continue with Google
                </Button>
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or sign up with email
              </FieldSeparator>

              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="John Doe"
                  value={form.name}
                  aria-invalid={!!errors.name}
                  onChange={(e) => set("name", e.target.value)}
                />
                <FieldMessage message={errors.name} />
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="m@example.com"
                  value={form.email}
                  aria-invalid={!!errors.email}
                  onChange={(e) => set("email", e.target.value)}
                />
                <FieldMessage message={errors.email} />
              </Field>

              <Field>
                <FieldLabel htmlFor="image">Photo URL (optional)</FieldLabel>
                <Input
                  id="image"
                  type="url"
                  placeholder="https://i.ibb.co/your-photo.jpg"
                  value={form.image}
                  aria-invalid={!!errors.image}
                  onChange={(e) => set("image", e.target.value)}
                />
                <FieldMessage message={errors.image} />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    className="pr-11"
                    value={form.password}
                    aria-invalid={!!errors.password}
                    onChange={(e) => set("password", e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-1/2 right-1 size-8 -translate-y-1/2"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </Button>
                </div>
                {/* Live checklist: turns green as each rule is met */}
                <ul className="space-y-1 pt-1 text-sm">
                  {passwordRules(form.password).map((rule) => (
                    <li
                      key={rule.label}
                      className={`flex items-center gap-2 ${
                        rule.ok
                          ? "text-green-600 dark:text-green-400"
                          : "text-muted-foreground"
                      }`}
                    >
                      {rule.ok ? (
                        <Check className="size-3.5" />
                      ) : (
                        <X className="size-3.5" />
                      )}
                      {rule.label}
                    </li>
                  ))}
                </ul>
              </Field>

              <Field>
                <Button type="submit" disabled={loading || googleLoading}>
                  {loading && <Loader2 className="size-4 animate-spin" />}
                  {loading ? "Creating account…" : "Register"}
                </Button>
                <FieldDescription className="text-center">
                  Have an account? <Link href="/login">Login</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By continuing, you agree to our <a href="#">Terms of Service</a> and{" "}
        <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
