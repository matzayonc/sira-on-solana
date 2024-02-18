import type { Asset } from '$src/utils/types/asset';
import { error } from '@sveltejs/kit';
import { get } from 'svelte/store';
import type { MyAssetsResponse } from '../myassets/+server';
import { anchorStore } from '$src/stores/anchorStore';

/** @type {import('./$types').PageLoad} */
export async function load() {
	const publicKey = get(anchorStore).program.provider.publicKey;

	console.log(publicKey);
	if (!publicKey) return { assets: null };
	try {
		const data = await fetch(`/myassets/?owner=${publicKey}`, {
			method: 'GET',
			headers: {
				'content-type': 'application/json'
			}
		});

		const result = (await data.json()).map((v: MyAssetsResponse): Asset => {
			return {
				emissionDate: v.emission_date,
				isin: v.isin,
				issuerKey: v.issuer_key,
				nominalValue: v.nominal_value,
				ownerName: v.owner_name,
				paperIsinNumber: v.paper_isin_number,
				paperNumberFrom: v.paper_number_from,
				paperNumberTo: v.paper_number_to
			};
		});

		return { assets: result };
	} catch {
		error(404, 'Not found');
	}
}
export const ssr = false;
