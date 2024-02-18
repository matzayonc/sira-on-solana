import type { MyAssetsResponse } from '$src/routes/myassets/+server';
import type { Asset } from '$src/utils/types/asset';
import type { Issuer } from '$src/utils/types/issuer';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
	try {
		const issuer = await fetch(`/issuers/${params.id}`, {
			method: 'GET',
			headers: {
				'content-type': 'application/json'
			}
		});

		const issuerData = (await issuer.json()) as Issuer[];

		const registry = await fetch(`/registry/?issuer=${params.id}`, {
			method: 'GET',
			headers: {
				'content-type': 'application/json'
			}
		});

		const registryData = (await registry.json()).map((v: MyAssetsResponse): Asset => {
			return {
				ownerKey: v.owner_key,
				emissionDate: v.emission_date,
				isin: v.isin,
				issuerKey: v.issuer_key,
				nominalValue: v.nominal_value,
				ownerName: v.owner_name,
				paperIsinNumber: v.paper_isin_number,
				paperNumberFrom: v.paper_number_from,
				paperNumberTo: v.paper_number_to,
				issuerName: v.issuer_name,
				amount: v.number_of_shares
			};
		});

		return { stock: issuerData, registry: registryData };
	} catch {
		error(404, 'Not found');
	}
}
export const ssr = false;
