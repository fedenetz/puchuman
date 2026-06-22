export default function ResponsiveImage({
  image,
  alt = image.alt,
  sizes = "100vw",
  loading = "lazy",
  fetchPriority,
  className,
}) {
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={image.sources.avif} sizes={sizes} />
      <source type="image/webp" srcSet={image.sources.webp} sizes={sizes} />
      <img
        src={image.src}
        srcSet={image.sources.jpeg}
        sizes={sizes}
        alt={alt}
        width={image.width}
        height={image.height}
        loading={loading}
        decoding={fetchPriority === "high" ? "sync" : "async"}
        fetchPriority={fetchPriority}
      />
    </picture>
  );
}
