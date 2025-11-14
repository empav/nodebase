"use client";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";

const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});
const signUpSchema = z
  .object({
    name: z.string("Please enter a valid full name"),
    email: z.email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
    confirmPassword: z.string().min(1, "Password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Password don't match",
    path: ["confirmPassword"],
  });

type SignFormValues = z.infer<typeof loginSchema | typeof signUpSchema>;

type SignFormProps = {
  isLogin: boolean;
};

const SignForm = ({ isLogin }: SignFormProps) => {
  const router = useRouter();

  const form = useForm<SignFormValues>({
    resolver: zodResolver(isLogin ? loginSchema : signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: SignFormValues) => {
    if (isLogin) {
      await authClient.signIn.email(
        {
          ...values,
        },
        {
          onSuccess: () => {
            router.push("/");
          },
          onError: (ctx) => {
            toast.error(ctx.error.message);
          },
        },
      );
    } else {
      await authClient.signUp.email(
        {
          ...(values as SignFormValues & { name: string }),
        },
        {
          onSuccess: () => {
            router.push("/");
          },
          onError: (ctx) => {
            toast.error(ctx.error.message);
          },
        },
      );
    }
  };

  const onSocialSign = (provider: "github" | "google") => async () => {
    await authClient.signIn.social({
      provider,
    });
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Card className="min-w-[500px]">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center mb-2 gap-x-2">
          <Image alt="Logo" src="/logos/logo.svg" width={60} height={60} />{" "}
          Nodebase
        </CardTitle>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>
          {isLogin ? "Login to continue" : "Register a new account"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button
                  variant={"outline"}
                  className="w-full"
                  type="button"
                  disabled={isSubmitting}
                  onClick={onSocialSign("github")}
                >
                  <Image
                    alt="Github logo"
                    src="/logos/github.svg"
                    width={20}
                    height={20}
                  />
                  Continue with Github
                </Button>
                <Button
                  variant={"outline"}
                  className="w-full"
                  type="button"
                  disabled={isSubmitting}
                  onClick={onSocialSign("google")}
                >
                  <Image
                    alt="Google logo"
                    src="/logos/google.svg"
                    width={20}
                    height={20}
                  />
                  Continue with Google
                </Button>
              </div>
              <div className="grid gap-6">
                {isLogin ? null : (
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            type="string"
                            placeholder="Full name (first and last name)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="m@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="********"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {isLogin ? null : (
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="********"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isLogin ? "Login" : "Sign up"}
                </Button>
              </div>
              <div className="text-center text-sm">
                {isLogin ? (
                  <>
                    Don&apos;t have an account?{" "}
                    <Link
                      href={"/signup"}
                      className="underline underline-offset-4"
                    >
                      Sign up
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href={"/login"}
                      className="underline underline-offset-4"
                    >
                      Login
                    </Link>{" "}
                    with your account
                  </>
                )}
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SignForm;
