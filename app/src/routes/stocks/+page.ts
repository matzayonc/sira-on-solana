import type { Issuer } from '$src/utils/types/issuer';
import { error } from '@sveltejs/kit';
import type { IssuersResponse } from '../issuers/+server';

/** @type {import('./$types').PageLoad} */
export async function load() {
	try {
		const data = await fetch('/issuers', {
			method: 'GET',
			headers: {
				'content-type': 'application/json'
			}
		});

		const jsonData = (await data.json()).map((v: IssuersResponse): Issuer => {
			return {
				authority: '',
				krs: v.issuer_krs_number,
				name: v.issuer_name,
				public_key: v.issuer_key,
				value: v.nominal_value,
				ticker: v.ticker,
				issued: v.issued
			};
		});

		return { stocks: jsonData as Issuer[] };
	} catch {
		error(404, 'Not found');
	}
}
export const ssr = false;
