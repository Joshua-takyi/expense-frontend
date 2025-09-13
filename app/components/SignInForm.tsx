"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";

export default function SignInForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login.mutateAsync(formData, {
      onSuccess: () => {
        router.push("/dashboard");
      },
      onError: () => {
        login.reset();
      },
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-3">
          <h1 className="text-2xl font-bold text-center">Sign In</h1>
          <p className="text-sm text-gray-600 text-center">
            Enter your credentials to access your account
          </p>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="Email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              isRequired
              errorMessage={login.isError ? "Invalid email or password" : ""}
              isInvalid={login.isError}
            />

            <Input
              type="password"
              label="Password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              isRequired
              errorMessage={login.isError ? "Invalid email or password" : ""}
              isInvalid={login.isError}
            />

            <Button
              type="submit"
              color="primary"
              className="w-full"
              isLoading={isLoading}
              isDisabled={!formData.email || !formData.password}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
