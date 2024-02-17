import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load() {
	fetch('/issuers', {
		method: 'GET',
		headers: {
			'content-type': 'application/json'
		}
	})
		.then((data) => data.json())
		.then((data) => {
			return { data: data as { issuer_name: string; issuer_krs_number: string }[] };
		})
		.catch(() => {
			error(404, 'Not found');
		});
}
export const ssr = false;
