import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Report } from "./types";

type ReportState = {
  reports: Report[];
  addReport: (report: Report) => void;
};

export const useReports = create<ReportState>()(
  persist(
    (set, get) => ({
      reports: [],
      addReport: (report) => {
        const rest = get().reports.filter((r) => r.id !== report.id);
        set({ reports: [report, ...rest].slice(0, 12) });
      },
    }),
    { name: "scope-reports" },
  ),
);

export function newId(): string {
  return crypto.randomUUID();
}
