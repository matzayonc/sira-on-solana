import { anchorStore } from '$stores/anchorStore';
import { get } from 'svelte/store';

export async function GET() {
	const { program } = get(anchorStore);

	const issuers = await program.account.issuer.all();

	const parsed = JSON.stringify(
		issuers.map((a) => {
			return {
				issuer_name: a.account.name,
				issuer_krs_number: a.account.krs
			};
		})
	);

	console.log();

	return new Response(parsed, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
