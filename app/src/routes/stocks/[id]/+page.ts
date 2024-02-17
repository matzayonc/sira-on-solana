import { error } from '@sveltejs/kit';

export type Issuer = { issuer_name: string; issuer_krs_number: string; public_key: string };

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
	try {
		const data = await fetch(`/issuers/${params.id}`, {
			method: 'GET',
			headers: {
				'content-type': 'application/json'
			}
		});

		const jsonData = await data.json();
		console.log(jsonData);
		return { stock: jsonData as Issuer[] };
	} catch {
		error(404, 'Not found');
	}
}
export const ssr = false;
