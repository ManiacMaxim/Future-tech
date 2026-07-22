import { parseOptimizedMarkup } from "./createParseOptions";

export default function Header({ markup }) {
  return parseOptimizedMarkup(markup, { eagerImageCount: 1 });
}
