import { DataStoreRepository } from "@/repositories/dataStore";

export class ExportService {
  /**
   * Export all data as downloadable JSON file
   */
  static exportAsJSON(): void {
    if (typeof window === "undefined") return;
    const data = DataStoreRepository.exportAllData();
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `personal_transformation_os_backup_${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Export tasks as CSV file
   */
  static exportTasksAsCSV(): void {
    if (typeof window === "undefined") return;
    const tasks = DataStoreRepository.getTasks();
    const headers = ["ID", "Title", "Priority", "Status", "EstimatedMinutes", "ActualMinutes", "DueDate"];
    const rows = tasks.map((t) => [
      t.id,
      `"${t.title.replace(/"/g, '""')}"`,
      t.priority,
      t.status,
      t.estimatedMinutes,
      t.actualMinutesSpent,
      t.dueDate || "",
    ]);

    const csvContent = [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tasks_export_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
