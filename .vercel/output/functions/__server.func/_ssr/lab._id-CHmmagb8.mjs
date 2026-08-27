import { _ as Link, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as Route$1 } from "./router-BI16N8Ti.mjs";
import { n as Button, r as Shell, t as BackLink } from "./createSsrRpc-CRUGmq6G.mjs";
import { t as ScanFlow } from "./scan-flow-v4Yjvbpw.mjs";
import { n as getLab } from "./lab-C9vQJwYa.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/lab._id-CHmmagb8.js
var import_jsx_runtime = require_jsx_runtime();
function LabPage() {
	const { id } = Route$1.useParams();
	const machine = getLab(id);
	if (!machine) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackLink, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "That machine is not in the lab."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			className: "mt-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				children: "Home"
			})
		})
	] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackLink, { label: "The lab" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanFlow, {
		targetName: machine.name,
		skipSymptoms: true,
		presetTelemetry: machine.telemetry,
		againLabel: "Probe again"
	}, machine.id)] });
}
//#endregion
export { LabPage as component };
