import parse, {
  attributesToProps,
  domToReact,
  Element,
} from "html-react-parser";

export const createParseOptions = ({ eagerImageCount = 0 } = {}) => {
  let imageIndex = 0;
  const options = {
    replace(node) {
      if (!(node instanceof Element)) return undefined;

      if (node.name === "img") {
        const props = attributesToProps(node.attribs);
        const isEager = imageIndex < eagerImageCount;
        imageIndex += 1;

        return (
          <img
            {...props}
            loading={isEager ? "eager" : "lazy"}
            decoding="async"
          />
        );
      }

      if (node.name === "video") {
        return (
          <video {...attributesToProps(node.attribs)} preload="none">
            {domToReact(node.children, options)}
          </video>
        );
      }

      if (node.name === "a") {
        const props = attributesToProps(node.attribs);
        const isLogo = node.attribs.class
          ?.split(/\s+/)
          .includes("header__logo");
        const opensNewTab = node.attribs.target === "_blank";

        if (isLogo || opensNewTab) {
          return (
            <a
              {...props}
              aria-label={isLogo ? "FutureTech home" : props["aria-label"]}
              rel={opensNewTab ? "noopener noreferrer" : props.rel}
            >
              {domToReact(node.children, options)}
            </a>
          );
        }
      }

      return undefined;
    },
  };

  return options;
};

export const parseOptimizedMarkup = (markup, configuration) =>
  parse(markup, createParseOptions(configuration));
