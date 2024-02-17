<script lang="ts">
	import { page } from '$app/stores';
	import DecimalInput from '$components/Inputs/DecimalInput.svelte';
	import { stocks } from '$src/db/db';
	import { anchorStore } from '$src/stores/anchorStore';
	import { walletStore } from '$src/stores/walletStore';
	import * as anchor from '@coral-xyz/anchor';
	import { PublicKey } from '@solana/web3.js';
	import { get } from 'svelte/store';

	$: ({ params } = $page);
	$: stock = params && params.id ? stocks[Number(params.id)] : stocks[0];

	let sharesToBuy: number;

	const onStockBuy = async () => {
		// TODO: Implement buying stocks
		const { program } = get(anchorStore);
		const { publicKey } = get(walletStore);

		if (!publicKey) {
			alert('Please connect your wallet');
			return;
		}

		const [holding, holdingBump] = await PublicKey.findProgramAddress(
			[anchor.utils.bytes.utf8.encode('holding'), publicKey.toBuffer()],
			program.programId
		);

		// await program.methods
		// 	.createShareholder(holdingBump, new BN(sharesToBuy))
		// 	.accounts({
		// 		shareholder: holding,
		// 		issuer: issuer.publicKey,
		// 		signer: signer.publicKey,
		// 		owner: shareholder.publicKey,
		// 		state
		// 	})
		// 	.rpc();
	};
</script>

<svelte:head><title>{stock.name}</title></svelte:head>

<div>
	<h1>Tesla</h1>
	<table>
		<thead>
			<tr>
				<th>Stock</th>
				<th>Price</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>{stock.name}</td>
				<td>{stock.price}</td>
				<td><DecimalInput bind:value={sharesToBuy} /></td>
				<td><button onclick={onStockBuy}>Buy</button></td>
			</tr>
		</tbody>
	</table>
</div>
