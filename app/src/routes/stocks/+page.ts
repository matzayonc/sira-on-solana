import { error } from '@sveltejs/kit';
import type { IssuersResponse } from '../issuers/+server';

export type Issuer = {
	// authority: string;
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

		const jsonData = (await data.json()).map((v: IssuersResponse) => {
			return {
				krs: v.issuer_krs_number,
				name: v.issuer_name,
				public_key: v.issuer_key,
				value: v.nominal_value
			};
		});

		return { stocks: jsonData as Issuer[] };
	} catch {
		error(404, 'Not found');
	}
}
export const ssr = false;
