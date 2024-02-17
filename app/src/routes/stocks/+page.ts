import { error } from '@sveltejs/kit';

export type Issuer = {
	authority: string;
	krs: string;
	name: string;
	public_key: string;
	value: number;
};

/** @type {import('./$types').PageLoad} */
export async function load() {
	try {
		const data = await fetch('/issuers', {
			method: 'GET',
			headers: {
				'content-type': 'application/json'
			}
		});

		const jsonData = await data.json();
		return { stocks: jsonData as Issuer[] };
	} catch {
		error(404, 'Not found');
	}
}
export const ssr = false;
