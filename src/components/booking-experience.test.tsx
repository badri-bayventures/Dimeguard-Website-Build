import { afterAll, afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import {
  bookingSourceConfig,
  resolveBookingSource,
  type BookingSourceKey,
} from "@/site.config";

/**
 * Guards the source-aware /book page: each entry point (?source=) must render
 * its own left-panel copy, unknown/missing sources fall back to the footer
 * default, and the Calendly widget vs. graceful "scheduling is being set up"
 * fallback must track NEXT_PUBLIC_CALENDLY_URL.
 */

// Controllable ?source= value for the mocked App Router hook.
let currentSource: string | null = null;

vi.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: (key: string) => (key === "source" ? currentSource : null),
  }),
}));

// Stub the real iframe-based Calendly widget with a lightweight marker so the
// test can assert it rendered (and with which UTM source) without a network mount.
vi.mock("react-calendly", () => ({
  InlineWidget: ({
    url,
    utm,
  }: {
    url: string;
    utm?: { utmCampaign?: string };
  }) => (
    <div
      data-testid="calendly-widget"
      data-url={url}
      data-utm-campaign={utm?.utmCampaign}
    />
  ),
}));

const ORIGINAL_CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL;

afterEach(() => {
  cleanup();
  currentSource = null;
});

afterAll(() => {
  if (ORIGINAL_CALENDLY_URL === undefined) {
    delete process.env.NEXT_PUBLIC_CALENDLY_URL;
  } else {
    process.env.NEXT_PUBLIC_CALENDLY_URL = ORIGINAL_CALENDLY_URL;
  }
});

/**
 * Re-import the component after setting env so siteConfig.contact.calendlyUrl
 * (read from NEXT_PUBLIC_CALENDLY_URL at module load) reflects the test's state.
 */
async function renderBooking(calendlyUrl: string | undefined) {
  if (calendlyUrl === undefined) {
    delete process.env.NEXT_PUBLIC_CALENDLY_URL;
  } else {
    process.env.NEXT_PUBLIC_CALENDLY_URL = calendlyUrl;
  }
  vi.resetModules();
  const { BookingExperience } = await import("./booking-experience");
  return render(<BookingExperience />);
}

const CALENDLY_URL = "https://calendly.com/dimeguard/20min";

describe("resolveBookingSource", () => {
  it.each<[string, BookingSourceKey]>([
    ["hero", "hero"],
    ["retirement", "retirement"],
    ["life", "life"],
    ["footer", "footer"],
  ])("maps source=%s to the %s copy", (source, key) => {
    const resolved = resolveBookingSource(source);
    expect(resolved.key).toBe(key);
    expect(resolved.copy).toBe(bookingSourceConfig[key]);
  });

  it("falls back to footer for an unknown source", () => {
    const resolved = resolveBookingSource("not-a-real-source");
    expect(resolved.key).toBe("footer");
    expect(resolved.copy).toBe(bookingSourceConfig.footer);
  });

  it("falls back to footer for a missing source", () => {
    expect(resolveBookingSource(null).key).toBe("footer");
    expect(resolveBookingSource(undefined).key).toBe("footer");
  });
});

describe("BookingExperience left-panel copy per entry point", () => {
  it.each<BookingSourceKey>(["hero", "retirement", "life", "footer"])(
    "renders the %s heading",
    async (key) => {
      currentSource = key;
      await renderBooking(CALENDLY_URL);

      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveTextContent(bookingSourceConfig[key].heading);
      expect(heading).toHaveTextContent(bookingSourceConfig[key].headingAccent);
    },
  );

  it("falls back to the footer default heading for an unknown source", async () => {
    currentSource = "not-a-real-source";
    await renderBooking(CALENDLY_URL);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent(bookingSourceConfig.footer.heading);
    expect(heading).toHaveTextContent(bookingSourceConfig.footer.headingAccent);
  });

  it("falls back to the footer default heading when no source is present", async () => {
    currentSource = null;
    await renderBooking(CALENDLY_URL);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent(bookingSourceConfig.footer.heading);
  });
});

describe("BookingExperience Calendly availability", () => {
  it("shows the graceful fallback when NEXT_PUBLIC_CALENDLY_URL is unset", async () => {
    currentSource = "footer";
    await renderBooking(undefined);

    expect(screen.getByText("Scheduling is being set up.")).toBeInTheDocument();
    expect(screen.queryByTestId("calendly-widget")).not.toBeInTheDocument();
  });

  it("renders the Calendly widget when NEXT_PUBLIC_CALENDLY_URL is set", async () => {
    currentSource = "hero";
    await renderBooking(CALENDLY_URL);

    const widget = screen.getByTestId("calendly-widget");
    expect(widget).toBeInTheDocument();
    expect(widget).toHaveAttribute("data-url", CALENDLY_URL);
    expect(widget).toHaveAttribute("data-utm-campaign", "hero");
    expect(
      screen.queryByText("Scheduling is being set up."),
    ).not.toBeInTheDocument();
  });
});
