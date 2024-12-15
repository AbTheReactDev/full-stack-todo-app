"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { signIn } from "next-auth/react";

export default function SignUp() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });
      if (res.ok) {
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
            title: "Account created",
          });
        }
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
      <Card className="p-4 w-full  lg:w-1/4">
        <CardHeader>
          <CardTitle className="lg:text-2xl text-lg text-center">
            Create Account
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="my-2 w-full"
          />
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
            <Button type="submit">Create</Button>
            <Link href="/auth/signin">
              <Button variant="secondary">Login</Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
