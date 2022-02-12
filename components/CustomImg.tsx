import { Flex } from "@chakra-ui/core";

interface Props extends HTMLImageElement {}
export default function CustomBlockquote(props: Props) {
  const { alt, title, src, className, style = {} } = props;

  return (
    <Flex p={6} justify="center">
      <img
        alt={alt}
        src={src && src.startsWith("http") ? src : `/blog/${src}`}
        className={className}
        title={title}
        style={style}
      />
    </Flex>
  );
}
