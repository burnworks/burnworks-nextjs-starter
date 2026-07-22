type SectionHeadingProps = {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  title: string;
  description?: string;
};

export function SectionHeading({
  as: Heading = "h2",
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="max-w-3xl">
      <Heading className="text-2xl font-bold text-stone-900 md:text-3xl">
        {title}
      </Heading>
      {description ? (
        <p className="mt-3 text-sm leading-relaxed text-stone-700 md:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}
