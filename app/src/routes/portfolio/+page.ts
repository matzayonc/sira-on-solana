import { walletStore } from '$src/stores/walletStore';
import type { Asset } from '$src/utils/types/asset';
import { error } from '@sveltejs/kit';
import { get } from 'svelte/store';
import type { MyAssetsResponse } from '../myassets/+server';

/** @type {import('./$types').PageLoad} */
export async function load() {
	const wallet = get(walletStore);

	console.log(wallet.publicKey);
	if (!wallet.publicKey) return { assets: null };
	try {
		const data = await fetch(`/myassets/?owner=${wallet.publicKey}`, {
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
