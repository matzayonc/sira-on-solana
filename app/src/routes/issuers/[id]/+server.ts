import { anchorStore } from '$src/stores/anchorStore';
import { PublicKey } from '@solana/web3.js';
import { get } from 'svelte/store';

export async function GET({ params }) {
	const { program } = get(anchorStore);

	const issuer = await program.account.issuer.fetch(new PublicKey(params.id));

	const result = {
		public_key: params.id,
		...issuer
	};

	return new Response(JSON.stringify(result), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
