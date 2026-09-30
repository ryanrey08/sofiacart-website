import { Container } from "@/components/layout/container";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function PagePlaceholder({
  title,
  description,
  sections,
}: {
  title: string;
  description: string;
  sections: { description: string; title: string }[];
}) {
  return (
    <Container className="space-y-8 py-12 lg:py-16">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>
        <p className="max-w-3xl text-base text-muted-foreground">{description}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {sections.map((section) => (
          <Card key={section.title}>
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
              <CardDescription>{section.description}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              This route is intentionally scaffolded only, so the shared page layout and data hooks can plug in during Phase 3.
            </CardContent>
          </Card>
        ))}
      </div>
    </Container>
  );
}
