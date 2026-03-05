type SectionHeadingProps = {
  title: string;
  description?: string;
};

export function SectionHeading({ title, description }: SectionHeadingProps) {
  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-bold text-stone-900 md:text-3xl">{title}</h2>
      {description ? (
        <p className="mt-3 text-sm leading-relaxed text-stone-700 md:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}
