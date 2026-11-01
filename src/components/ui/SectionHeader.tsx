type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  dark?: boolean;
  align?: "left" | "center";
};

export default function SectionHeader({
  eyebrow,
  title,
  description,
  dark = false,
  align = "left",
}: SectionHeaderProps) {
  const centered = align === "center";
  return (
    <div
      className={`${centered ? "mx-auto text-center items-center" : "text-left items-start"} flex max-w-3xl flex-col`}
    >
      <span className={`eyebrow ${dark ? "text-[#9ebcff]" : ""}`}>
        {eyebrow}
      </span>
      <h2
        className={`display-heading mt-5 text-4xl sm:text-5xl lg:text-6xl ${dark ? "text-tar-cream" : "text-tar-navy"}`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-5 max-w-2xl text-base leading-7 sm:text-lg sm:leading-8 ${dark ? "text-white/65" : "text-slate-600"} ${centered ? "text-center" : ""}`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
