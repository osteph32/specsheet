import { PageHeader } from "../components/layout/PageHeader";

export function MaintenancePage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <PageHeader
        eyebrow="Maintenance"
        title="Your Maintenance"
        description="Maintenance tracking will be implemented in a later V1 phase."
      />
    </div>
  );
}
