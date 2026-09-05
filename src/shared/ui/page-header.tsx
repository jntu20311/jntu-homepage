interface PageHeaderProps {
  title: string;
  description?: string;
}

export const PageHeader = ({ title }: PageHeaderProps) => {
  return (
    <section className="mx-auto w-full max-w-6xl py-4">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
      {/* {description ? (
        <p className="mt-4 text-muted-foreground">{description}</p>
      ) : null} */}
    </section>
  );
};
