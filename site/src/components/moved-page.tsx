import { Container } from "@/components/kit/layout";
import { asset } from "@/lib/site";

/** A page that has moved: sends the browser on at once and links to the new address. */
export function MovedPage({ to, label }: { to: string; label: string }) {
  const href = asset(to);
  return (
    <Container className="min-h-[calc(100dvh-var(--header))] pt-10 pb-section">
      <meta httpEquiv="refresh" content={`0; url=${href}`} />
      <a href={href} className="font-medium underline underline-offset-4">{label}</a>
    </Container>
  );
}
