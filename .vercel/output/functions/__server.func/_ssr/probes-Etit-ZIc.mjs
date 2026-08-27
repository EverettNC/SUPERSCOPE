import { i as string, o as unknown, r as object } from "../_libs/zod.mjs";
import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/probes-Etit-ZIc.js
var _0002_probes_default = "-- Remote diagnostic probe sessions. Unowned rows, keyed by a random code.\n-- Telemetry is device facts (cores, memory, network) — no names or emails.\ncreate table if not exists probes (\n  code          text primary key,\n  status        text not null default 'waiting',\n  created_at    timestamptz not null default now(),\n  started_at    timestamptz,\n  completed_at  timestamptz,\n  telemetry     jsonb,\n  diagnosis     jsonb\n);\n\ncreate index if not exists probes_created_at_idx on probes (created_at desc);\n";
/**
* Migration bookkeeping shared by the two appliers — `scripts/migrate.mjs`
* (deploy, `readdir`) and `src/lib/db.ts` (PGLite preview, `import.meta.glob`).
*
* Applied files are keyed by BASENAME, so the same file applies once no matter
* which directory it is globbed from. That is what makes the auth schema safe to
* copy from `migrations/auth/` into `migrations/` when an app turns sign-in on:
* a database that already has `0001_auth.sql` will not re-run it.
*
* Neither applier descends into subdirectories, so `migrations/auth/*.sql` is
* out of scope for both until it is copied up.
*/
/**
* The `_migrations` key for a migration path (or bare filename).
* @param {string} path
* @returns {string}
*/
function migrationName(path) {
	return path.split("/").pop() ?? path;
}
/**
* @param {string} path
* @returns {boolean}
*/
function isMigrationFile(path) {
	return path.endsWith(".sql");
}
/**
* Migrations in `paths` that are not yet in `applied`, in apply order.
* Non-`.sql` entries (a `readdir` also yields `migrations/auth/`) are dropped.
* @param {Iterable<string>} paths
* @param {Iterable<string>} applied
* @returns {Array<{ name: string, path: string }>}
*/
function pendingMigrations(paths, applied) {
	const done = new Set(applied);
	return [...paths].filter(isMigrationFile).map((path) => ({
		name: migrationName(path),
		path
	})).sort((a, b) => a.name.localeCompare(b.name)).filter(({ name }) => !done.has(name));
}
var rawDatabaseUrl = typeof process !== "undefined" ? process.env.DATABASE_URL : void 0;
var databaseUrl = rawDatabaseUrl && rawDatabaseUrl.trim() ? rawDatabaseUrl : void 0;
/**
* Active backend: real **Neon** when `DATABASE_URL` is set (deployed / configured
* sandbox), otherwise a local embedded **PGLite** (Postgres compiled to WASM) so
* the app has a working database even with nothing configured — the live preview
* included. Swap in Neon later by just setting `DATABASE_URL`; no code changes.
*/
var dbSource = databaseUrl ? "neon" : "pglite";
/**
* Init state lives on globalThis as promises: dev HMR creates new instances of
* this module, and two instances racing module-level state would open a second
* pool or run two concurrent PGLite migration passes (whose duplicate
* `_migrations` insert rejects — and would get memoized, poisoning every later
* `getSql()`). A failed init clears its slot so the next call retries.
*/
var globalRef = globalThis;
/**
* Result-type parity: Postgres sends every value as text plus a type OID — the
* JS value is the DRIVER's parsing choice, and pg and PGLite disagree (pg:
* int8 -> string, date -> local-midnight Date; PGLite: int8 -> BigInt, which
* JSON.stringify rejects, date -> UTC Date). Normalize both so preview and
* production return identical, JSON-safe shapes:
*   int8/bigint (incl. count(*)) -> number (past 2^53 loses precision — cast
*                                   `::text` if you ever need huge integers)
*   date                         -> 'YYYY-MM-DD' string
*   interval                     -> Postgres interval text
* numeric already comes back as a string on both (arbitrary precision).
*/
var OID_INT8 = 20;
var OID_DATE = 1082;
var OID_INTERVAL = 1186;
var identity = (v) => v;
/** Wrap a query runner in the tagged-template + `.query()` `Sql` surface. */
function toSql(run) {
	const sql = (async (strings, ...values) => {
		let text = strings[0];
		for (let i = 0; i < values.length; i += 1) text += `$${i + 1}${strings[i + 1]}`;
		return run(text, values);
	});
	sql.query = (text, params = []) => run(text, params);
	return sql;
}
function createNeonSql() {
	globalRef.__pgSqlPromise__ ??= (async () => {
		const { Pool, types } = await import("../_libs/pg.mjs").then((n) => n.t);
		types.setTypeParser(OID_INT8, Number);
		types.setTypeParser(OID_DATE, identity);
		types.setTypeParser(OID_INTERVAL, identity);
		const pool = new Pool({ connectionString: databaseUrl });
		return toSql(async (text, params) => {
			return (await pool.query(text, params)).rows;
		});
	})().catch((err) => {
		globalRef.__pgSqlPromise__ = void 0;
		throw err;
	});
	return globalRef.__pgSqlPromise__;
}
async function createPgliteSql() {
	globalRef.__pgliteInstance__ ??= (async () => {
		const { PGlite } = await import("../_libs/electric-sql__pglite.mjs").then((n) => n.t);
		const pg = new PGlite({ parsers: {
			[OID_INT8]: Number,
			[OID_DATE]: identity,
			[OID_INTERVAL]: identity
		} });
		await pg.waitReady;
		await pg.exec("create table if not exists _migrations (name text primary key, applied_at timestamptz not null default now())");
		return pg;
	})().catch((err) => {
		globalRef.__pgliteInstance__ = void 0;
		throw err;
	});
	const pg = await globalRef.__pgliteInstance__;
	const migrate = async () => {
		const migrations = /* #__PURE__ */ Object.assign({ "/migrations/0002_probes.sql": _0002_probes_default });
		const done = (await pg.query("select name from _migrations")).rows.map((r) => r.name);
		for (const { name, path } of pendingMigrations(Object.keys(migrations), done)) await pg.transaction(async (tx) => {
			await tx.exec(migrations[path]);
			await tx.query("insert into _migrations (name) values ($1)", [name]);
		});
	};
	const pass = (globalRef.__pgliteMigrateChain__ ?? Promise.resolve()).catch(() => void 0).then(migrate);
	globalRef.__pgliteMigrateChain__ = pass;
	await pass;
	return toSql(async (text, params) => {
		return (await pg.query(text, params)).rows;
	});
}
var sqlPromise = null;
async function createSql() {
	if (typeof window !== "undefined") throw new Error("@/lib/db is server-only — call getSql() from a createServerFn handler or a server route loader, never from client code.");
	return dbSource === "neon" ? createNeonSql() : createPgliteSql();
}
/**
* Get the shared, **server-only** SQL client. Neon when `DATABASE_URL` is set,
* otherwise the local PGLite fallback. Memoized — safe to call per request.
*
* Schema comes from `migrations/*.sql`, auto-applied before the first query on
* both backends — define tables there, never inline in server functions.
*/
function getSql() {
	sqlPromise ??= createSql().catch((err) => {
		sqlPromise = null;
		throw err;
	});
	return sqlPromise;
}
/**
* Finish DB bootstrap before the server handles traffic.
*
* - **PGLite** (preview / no `DATABASE_URL`): open the in-memory DB and apply
*   `migrations/*.sql`. Idempotent — concurrent callers share one promise.
* - **Neon**: no-op (pool is created lazily on first query).
*
* Vite `configureServer` awaits this at dev startup; production imports of this
* module kick it off immediately (see bottom of file).
*/
function ensureDbReady() {
	if (dbSource !== "pglite") return Promise.resolve();
	return getSql().then(() => void 0);
}
var globalBoot = globalThis;
if (typeof window === "undefined" && dbSource === "pglite") globalBoot.__pgBootstrapPromise__ ??= ensureDbReady().catch((err) => {
	globalBoot.__pgBootstrapPromise__ = void 0;
	console.error("[db] PGLite bootstrap failed:", err);
	throw err;
});
var CODE_RE = /^[A-Z0-9]{4}-[A-Z0-9]{4}$/;
var ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function mintCode() {
	const bytes = crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(8));
	let s = "";
	for (const b of bytes) s += ALPHABET[b % 32];
	return `${s.slice(0, 4)}-${s.slice(4)}`;
}
function normalizeCode(raw) {
	const compact = raw.toUpperCase().replace(/[^A-Z0-9]/g, "");
	if (compact.length !== 8) return raw.trim().toUpperCase();
	return `${compact.slice(0, 4)}-${compact.slice(4)}`;
}
function parseJson(value) {
	if (value == null) return null;
	if (typeof value === "string") try {
		return JSON.parse(value);
	} catch {
		return null;
	}
	if (typeof value === "object") return value;
	return null;
}
function toRow(row) {
	return {
		code: row.code,
		status: row.status || "waiting",
		createdAt: row.created_at,
		telemetry: parseJson(row.telemetry),
		diagnosis: parseJson(row.diagnosis)
	};
}
var createProbe_createServerFn_handler = createServerRpc({
	id: "05e50a3d7c5f14a2d5cdef517b7f3fb180b0956727505d341f52908487bdba1f",
	name: "createProbe",
	filename: "src/lib/probes.ts"
}, (opts) => createProbe.__executeServer(opts));
var createProbe = createServerFn({ method: "POST" }).handler(createProbe_createServerFn_handler, async () => {
	const sql = await getSql();
	for (let i = 0; i < 6; i += 1) {
		const code = mintCode();
		try {
			await sql.query("insert into probes (code, status) values ($1, $2)", [code, "waiting"]);
			return {
				ok: true,
				code
			};
		} catch {}
	}
	return {
		ok: false,
		error: "Could not open a session."
	};
});
var getProbe_createServerFn_handler = createServerRpc({
	id: "9e88fbcdf1c5982a0632d904b537a09dd8aeb517d65f8973d159ee93f44192e0",
	name: "getProbe",
	filename: "src/lib/probes.ts"
}, (opts) => getProbe.__executeServer(opts));
var getProbe = createServerFn({ method: "GET" }).validator((input) => object({ code: string().min(1) }).parse(input)).handler(getProbe_createServerFn_handler, async ({ data }) => {
	const code = normalizeCode(data.code);
	if (!CODE_RE.test(code)) return {
		ok: false,
		error: "Bad code."
	};
	const row = (await (await getSql()).query("select code, status, created_at::text as created_at, telemetry, diagnosis from probes where code = $1 and created_at > now() - interval '24 hours' limit 1", [code]))[0];
	if (!row) return {
		ok: false,
		error: "No probe with that code."
	};
	return {
		ok: true,
		probe: toRow(row)
	};
});
var startProbe_createServerFn_handler = createServerRpc({
	id: "35ea96e7dab841dc9731f002dbd7e8c9effd60525887eb83ac329a6cd1f1bb08",
	name: "startProbe",
	filename: "src/lib/probes.ts"
}, (opts) => startProbe.__executeServer(opts));
var startProbe = createServerFn({ method: "POST" }).validator((input) => object({ code: string().min(1) }).parse(input)).handler(startProbe_createServerFn_handler, async ({ data }) => {
	const code = normalizeCode(data.code);
	if (!CODE_RE.test(code)) return {
		ok: false,
		error: "Bad code."
	};
	const sql = await getSql();
	if (!(await sql.query("update probes set status = 'scanning', started_at = now() where code = $1 and status = 'waiting' returning code", [code]))[0]) {
		const existing = await sql.query("select code, status, created_at::text as created_at, telemetry, diagnosis from probes where code = $1 limit 1", [code]);
		if (!existing[0]) return {
			ok: false,
			error: "No probe with that code."
		};
		return {
			ok: true,
			probe: toRow(existing[0])
		};
	}
	return {
		ok: true,
		probe: toRow((await sql.query("select code, status, created_at::text as created_at, telemetry, diagnosis from probes where code = $1", [code]))[0])
	};
});
var completeProbe_createServerFn_handler = createServerRpc({
	id: "b7e50b2760624703db69aff3394ffefcea078e651a5a34c6d68e1486dfc45068",
	name: "completeProbe",
	filename: "src/lib/probes.ts"
}, (opts) => completeProbe.__executeServer(opts));
var completeProbe = createServerFn({ method: "POST" }).validator((input) => object({
	code: string().min(1),
	telemetry: unknown(),
	diagnosis: unknown()
}).parse(input)).handler(completeProbe_createServerFn_handler, async ({ data }) => {
	const code = normalizeCode(data.code);
	if (!CODE_RE.test(code)) return {
		ok: false,
		error: "Bad code."
	};
	const rows = await (await getSql()).query("update probes set status = 'complete', completed_at = now(), telemetry = $2::jsonb, diagnosis = $3::jsonb where code = $1 returning code, status, created_at::text as created_at, telemetry, diagnosis", [
		code,
		JSON.stringify(data.telemetry),
		JSON.stringify(data.diagnosis)
	]);
	if (!rows[0]) return {
		ok: false,
		error: "No probe with that code."
	};
	return {
		ok: true,
		probe: toRow(rows[0])
	};
});
//#endregion
export { completeProbe_createServerFn_handler, createProbe_createServerFn_handler, getProbe_createServerFn_handler, startProbe_createServerFn_handler };
