import { parseOptimizedMarkup } from "./createParseOptions";

export default function PageContent({ markup, eagerImageCount }) {
  return parseOptimizedMarkup(markup, { eagerImageCount });
}
