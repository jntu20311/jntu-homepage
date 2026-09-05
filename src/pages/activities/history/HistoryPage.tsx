import { ActivityCard, activities } from "@/entities/activity";

export const HistoryPage = () => {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          활동내역
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          전남광주교사노조의 주요 활동을 확인하세요.
        </p>
      </header>

      <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {activities.map((activity) => (
          <li key={activity.id}>
            <ActivityCard activity={activity} />
          </li>
        ))}
      </ul>
    </div>
  );
};
