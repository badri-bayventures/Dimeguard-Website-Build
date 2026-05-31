import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Renders Notion-sourced markdown as semantic HTML. Used for live Notion
 * posts because raw Notion markdown can contain JSX-like characters that
 * break the MDX compiler — the static MDX fallback still uses MDXRemote.
 * Body styling is provided by the `.post-body` wrapper in globals.css.
 */
export function NotionBody({ source }: { source: string }) {
  return <Markdown remarkPlugins={[remarkGfm]}>{source}</Markdown>;
}
