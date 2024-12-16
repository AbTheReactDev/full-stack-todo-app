"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { signIn } from "next-auth/react";
import { ErrorMessage, Formik, Form } from "formik";

export default function SignUp() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (values: {
    email: string;
    name: string;
    password: string;
  }) => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        const result = await signIn("credentials", {
          redirect: false,
          email: values.email,
          password: values.password,
        });

        if (result?.error) {
          toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
          });
        } else {
          router.push("/");
          toast({
            title: "Success",
            description: "You are signed in",
          });
        }
      } else {
        toast({
          title: "Error",
          description: data.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen mx-5">
      <Card className="p-4 w-full sm:w-1/2 md:w-1/2 lg:w-1/3">
        <CardHeader>
          <CardTitle className="lg:text-2xl text-lg text-center">
            Create Account
          </CardTitle>
        </CardHeader>
        <Formik
          initialValues={{ name: "", email: "", password: "" }}
          validate={(values) => {
            const errors: { name?: string; email?: string; password?: string } =
              {};
            if (!values.name) {
              errors.name = "Name is required";
            }
            if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
            ) {
              errors.email = "Invalid email address";
            }
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            handleSubmit(values);
            setSubmitting(false);
          }}
        >
          {({
            values,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
            <Form onSubmit={handleSubmit}>
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                name="name"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
                className="mb-4"
              />
              <ErrorMessage
                className="text-red-500"
                name="name"
                component="div"
              />
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                name="email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                className="mb-4"
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
              />
              <ErrorMessage name="password" component="div" />
              <Button
                className="w-full mt-4"
                type="submit"
                disabled={isSubmitting}
              >
                Submit
              </Button>
            </Form>
          )}
        </Formik>
        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link href="/auth/signin">
            <Button variant="link">Sign In</Button>
          </Link>
        </p>
      </Card>
    </div>
  );
}
