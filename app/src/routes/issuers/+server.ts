import { anchorStore } from '$stores/anchorStore';
import { get } from 'svelte/store';

export async function GET() {
	const { program } = get(anchorStore);

	const issuers = await program.account.issuer.all();

	const parsed = JSON.stringify(
		issuers.map((a) => {
			return {
				public_key: a.publicKey.toString(),
				...a.account
			};
		})
	);

	return new Response(parsed, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
