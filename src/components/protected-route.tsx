"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { LogIn, Shield } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading, signIn } = useAuth();

  if (isLoading) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            <CardTitle>Access Restricted</CardTitle>
            <CardDescription>
              You need to sign in to access the admin section
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button
              onClick={signIn}
              className="mx-auto flex items-center space-x-2"
            >
              <LogIn className="h-4 w-4" />
              <span>Sign In with Internet Identity</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
