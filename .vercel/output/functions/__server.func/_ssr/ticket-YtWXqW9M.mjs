//#region node_modules/.nitro/vite/services/ssr/assets/ticket-YtWXqW9M.js
function decodeTicket(raw) {
	const match = raw.trim().match(/SCOPE1\.([A-Za-z0-9+/=\s]+)/);
	if (!match?.[1]) return null;
	try {
		const bin = atob(match[1].replace(/\s/g, ""));
		const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
		const json = new TextDecoder().decode(bytes);
		const ticket = JSON.parse(json);
		if (ticket?.v !== 1 || !ticket.code || !ticket.diagnosis || !ticket.telemetry) return null;
		return ticket;
	} catch {
		return null;
	}
}
//#endregion
export { decodeTicket as t };
