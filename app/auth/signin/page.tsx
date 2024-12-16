"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ErrorMessage, Formik, Form } from "formik";
import Link from "next/link";
import { useEffect } from "react";

export default function SignIn() {
  const router = useRouter();

  const { data: session, status } = useSession();
  const { toast } = useToast();

  const handleSubmit = async (email: string, password: string) => {
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    console.log(res);

    if (!res?.ok) {
      toast({
        title: "Error",
        description: "Invalid credentials or user not found",
        variant: "destructive",
      });
    } else {
      router.push("/");
      toast({
        title: "Success",
        description: "You are signed in",
      });
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status]);

  return (
    <div className="flex flex-col items-center justify-center h-screen mx-5">
      <Card className="p-4 w-full sm:w-1/2 md:w-1/2 lg:w-1/3">
        <CardHeader>
          <CardTitle className="lg:text-2xl text-lg text-center">
            Login to your account
          </CardTitle>
        </CardHeader>

        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={(values, { setSubmitting }) => {
            setSubmitting(true);
            handleSubmit(values.email, values.password);
            setSubmitting(false);
          }}
        >
          {({ values, handleChange, handleBlur, isSubmitting }) => (
            <Form>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                name="email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                className="mb-4"
                required
              />
              <ErrorMessage
                className="text-red-500"
                name="email"
                component="div"
              />
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                name="password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                required
              />
              <ErrorMessage name="password" component="div" />
              <Button
                className="w-full mt-4"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Loading..." : "Submit"}
              </Button>
            </Form>
          )}
        </Formik>

        <form
          action={async () => {
            await signIn("google");
          }}
        >
          <Button className="w-full mt-4 bg-blue-500 text-white">
            Sign in with Google
          </Button>
        </form>
        <form
          action={async () => {
            await signIn("github");
          }}
        >
          <Button
            variant="outline"
            className="w-full mt-4 bg-green-500 text-white"
          >
            Sign in with Github
          </Button>
        </form>
        <p className="text-sm text-center mt-4">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup">
            <Button variant="link">Sign Up</Button>
          </Link>
        </p>
      </Card>
    </div>
  );
}
