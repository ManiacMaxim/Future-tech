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

      return undefined;
    },
  };

  return options;
};

export const parseOptimizedMarkup = (markup, configuration) =>
  parse(markup, createParseOptions(configuration));
