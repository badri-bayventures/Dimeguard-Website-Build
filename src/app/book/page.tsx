import { Suspense } from "react";
import { buildMetadata } from "@/lib/seo/metadata";
import { Disclosure } from "@/components/disclosure";
import { BookingExperience } from "@/components/booking-experience";

const PATH = "/book";

export const generateMetadata = () =>
  buildMetadata({
    path: PATH,
    title: "Book a 20-minute call · Dimeguard",
    description:
      "Pick a time for a free, no-obligation 20-minute call. No script, no products pitched — just a clear-eyed look at where you stand.",
    index: false,
  });

export default function BookPage() {
  return (
    <>
      <Suspense fallback={null}>
        <BookingExperience />
      </Suspense>

      <div className="border-t border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)]">
        <div className="mx-auto max-w-6xl px-6 py-8 md:px-8">
          <Disclosure />
        </div>
      </div>
    </>
  );
}
