import type { Issuer } from '$src/utils/types/issuer';
import { error } from '@sveltejs/kit';

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
