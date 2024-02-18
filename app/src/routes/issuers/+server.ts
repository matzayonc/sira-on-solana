import { anchorStore } from '$stores/anchorStore';
import { get } from 'svelte/store';

export interface IssuersResponse {
	issuer_key: string;
	issuer_name: string;
	issuer_krs_number: string;
	nominal_value: number;
}

export async function GET() {
	const { program } = get(anchorStore);

	const issuers = await program.account.issuer.all();

	const parsed = JSON.stringify(
		issuers.map((a): IssuersResponse => {
			return {
				issuer_key: a.publicKey.toString(),
				issuer_name: a.account.name,
				issuer_krs_number: a.account.krs,
				nominal_value: a.account.value
			};
		})
	);

	return new Response(parsed, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
