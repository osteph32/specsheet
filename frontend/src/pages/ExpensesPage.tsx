import { PageHeader } from "../components/layout/PageHeader";

export function ExpensesPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <PageHeader
        eyebrow="Expenses"
        title="Ownership costs"
        description="Expense tracking will be implemented in a later V1 phase."
      />
    </div>
  );
}
