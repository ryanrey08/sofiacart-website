import { Container } from "@/components/layout/container";
import { RegisterForm } from "@/components/storefront/register-form";
import { Badge } from "@/components/ui/badge";

export default function RegisterPage() {
  return (
    <Container className="space-y-8 py-12 lg:py-16">
      <div className="space-y-4">
        <Badge variant="secondary">Registration</Badge>
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Create your SofiaCart account</h1>
          <p className="max-w-3xl text-base text-muted-foreground">
            This customer registration page now uses the shared form system with validation for personal information, account security, shipping address, and terms acceptance.
          </p>
        </div>
      </div>
      <RegisterForm />
    </Container>
  );
}
