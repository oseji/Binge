import { forwardRef, ImgHTMLAttributes, useState } from "react";

// URLs already painted this session skip the fade, so a page restored for a
// view transition is captured with its images visible rather than mid-fade
const seen = new Set<string>();

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "loading"> & { eager?: boolean; priority?: boolean };

const Img = forwardRef<HTMLImageElement, Props>(function Img({ eager, priority, src, onLoad, ...rest }, ref) {
  const [loaded, setLoaded] = useState(() => !!src && seen.has(src));
  return (
    <img
      ref={ref}
      src={src}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      // React 18 only passes the lowercase attribute through
      {...(priority ? { fetchpriority: "high" } : {})}
      data-loaded={loaded}
      onLoad={(e) => {
        if (src) seen.add(src);
        setLoaded(true);
        onLoad?.(e);
      }}
      {...rest}
    />
  );
});

export default Img;
