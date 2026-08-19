interface ProductDescriptionProps {
  description: string;
}

export function ProductDescription({
  description,
}: ProductDescriptionProps) {
  return (
    <section className="border-t border-neutral-200 pt-8 sm:pt-10">
      <h2 className="mb-5 text-xl font-medium tracking-tight text-neutral-900">
        Description
      </h2>

      <p className="max-w-3xl whitespace-pre-line text-sm leading-8 text-neutral-600 sm:text-[15px]">
        {description}
      </p>
    </section>
  );
}