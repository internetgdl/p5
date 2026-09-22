/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
	p6: D1Database;
}

export default {
	async fetch(request, env, ctx): Promise<Response> {
		// Example: query the D1 database using the new method
		const data = await this.queryDatabase(env.p6);
		return Response.json({ message: "Hello World 3!", dbData: data });
	},

	// New method to connect/query the p6 database
	async queryDatabase(db: D1Database) {
		// Connect and execute a query
		const { results } = await db.prepare("SELECT * FROM users").all();
		return results;
	}
} satisfies ExportedHandler<Env>;
