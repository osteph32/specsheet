interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
}

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <div>
      <p className="text-sm font-medium text-zinc-500">{eyebrow}</p>

      <h1 className="mt-1 text-3xl font-semibold tracking-tight">{title}</h1>

      {description && (
        <p className="mt-2 max-w-2xl text-zinc-400">{description}</p>
      )}
    </div>
  );
}
