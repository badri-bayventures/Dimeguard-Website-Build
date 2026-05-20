import type { ReactElement } from "react";

/**
 * Renders a JSON-LD object as an inline <script type="application/ld+json">
 * tag. Server component — must only receive serializable data.
 *
 * Undefined fields are stripped so JSON.stringify produces tidy output that
 * validates against schema.org.
 */
export function JsonLd({
  data,
  id,
}: {
  data: Record<string, unknown> | Record<string, unknown>[];
  id?: string;
}): ReactElement {
  const cleaned = JSON.stringify(data, (_key, value) => {
    if (value === undefined) return undefined;
    return value;
  });
  return (
    <script
      type="application/ld+json"
      id={id}
      dangerouslySetInnerHTML={{ __html: cleaned }}
    />
  );
}
