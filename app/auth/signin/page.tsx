"use client";

import { signIn } from "next-auth/react";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
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
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen mx-5">
      <Card className="p-4 w-full lg:w-1/4">
        <CardHeader>
          <CardTitle className="lg:text-2xl text-lg text-center">
            Login to your account
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <Label htmlFor="email">Email address</Label>
          <Input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="my-2 w-full"
          />
          <Label>Password</Label>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            className="my-2"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="flex gap-2 justify-start mt-3">
            <Button type="submit">Login</Button>
            <Link href="/auth/signup">
              <Button variant="secondary">Create Account</Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
