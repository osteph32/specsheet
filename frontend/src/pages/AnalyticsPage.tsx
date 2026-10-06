import { PageHeader } from "../components/layout/PageHeader";

export function AnalyticsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <PageHeader
        eyebrow="Analytics"
        title="Your analytics"
        description="Ownership analytics will be implemented in a later V1 phase."
      />
    </div>
  );
}
