import { Dashboard } from "@/components/dashboard";
import { PageHeader } from "@/components/page-header";

export default function Home() {
  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Dashboard" description="Welcome back, here's your financial overview." showAddTransaction />
      <div className="flex-1 overflow-y-auto">
        <Dashboard />
      </div>
    </div>
  );
}
