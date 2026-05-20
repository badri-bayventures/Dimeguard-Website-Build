import { isValidElement, type ReactNode } from "react";
import { FaqBlock, type FaqItem } from "./faq-block";
import { JsonLd } from "@/lib/schema/json-ld";
import { faqPage } from "@/lib/schema";

export type FaqEntry = {
  question: string;
  /** Rich UI answer (may contain links, lists, etc.). */
  answer: ReactNode;
  /**
   * Plain-text version of the answer used for the FAQPage schema. Required
   * when `answer` is a ReactNode that isn't a plain string. Strip markup and
   * keep it concise — search engines see this verbatim.
   */
  answerText?: string;
};

type FaqProps = {
  items: FaqEntry[];
  /** Heading level for each question. Defaults to h3 to nest under a section h2. */
  headingAs?: "h2" | "h3";
};

/**
 * Single-source FAQ component. Same array drives the visible UI and the
 * FAQPage JSON-LD — there is no way to ship one without the other.
 */
export function Faq({ items, headingAs = "h3" }: FaqProps) {
  const uiItems: FaqItem[] = items.map((i) => ({
    question: i.question,
    answer: i.answer,
  }));
  const schemaItems = items.map((i) => ({
    question: i.question,
    answerText: i.answerText ?? reactNodeToText(i.answer),
  }));
  return (
    <>
      <FaqBlock items={uiItems} headingAs={headingAs} />
      <JsonLd data={faqPage(schemaItems)} />
    </>
  );
}

/**
 * Best-effort conversion of a ReactNode answer to flat text for the schema
 * payload. Authors should still pass `answerText` for anything beyond plain
 * strings + simple inline markup, since this can't render dynamic React.
 */
function reactNodeToText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(reactNodeToText).join("");
  if (isValidElement(node)) {
    const props = node.props as { children?: ReactNode };
    return reactNodeToText(props.children);
  }
  return "";
}
