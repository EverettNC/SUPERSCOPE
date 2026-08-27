import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store-BYOuz_lx.js
var useReports = create()(persist((set, get) => ({
	reports: [],
	addReport: (report) => {
		set({ reports: [report, ...get().reports.filter((r) => r.id !== report.id)].slice(0, 12) });
	}
}), { name: "scope-reports" }));
function newId() {
	return crypto.randomUUID();
}
//#endregion
export { useReports as n, newId as t };
