import { anchorStore } from '$stores/anchorStore';
import { get } from 'svelte/store';

export async function GET({ url }) {
	const owner = url.searchParams.get('owner');
	if (!owner) {
		return new Response('Missing owner', { status: 400 });
	}

	const { program } = get(anchorStore);

	const stakeholders = await program.account.shareholder.all([
		{
			memcmp: {
				offset: 8,
				bytes: owner
			}
		}
	]);

	const issuers = await program.account.issuer.all();

	const parsed = JSON.stringify(
		stakeholders.map((s) => {
			const issuer = issuers.find((i) => i.publicKey.equals(s.account.issuer));
			if (!issuer) {
				return new Response('Issuer not found', { status: 404 });
			}

			const emissionDate = new Date(issuer.account.timestamp.toNumber() * 1000);

			return {
				owner_name: s.account.name,
				paper_number_from: s.account.first.toNumber(),
				paper_number_to: s.account.amount.add(s.account.first).toNumber(),
				isin: issuer.account.usingIsin,
				paper_isin_number: s.account.amount.toNumber(),
				emission_date: emissionDate.toISOString(),
				nominal_value: s.account.amount.muln(issuer.account.value).toNumber(),
				issuer_key: issuer.publicKey.toString()
			};
		})
	);

	return new Response(parsed, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
