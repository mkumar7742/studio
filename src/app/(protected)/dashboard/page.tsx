import { Dashboard } from "@/components/dashboard";

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <Dashboard />
      </div>
    </div>
  );
}
