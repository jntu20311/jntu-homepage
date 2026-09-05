interface PageHeaderProps {
  title: string;
  description?: string;
}

export const PageHeader = ({ title, description }: PageHeaderProps) => {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
      {description ? (
        <p className="mt-4 text-muted-foreground">{description}</p>
      ) : null}
    </section>
  );
};
