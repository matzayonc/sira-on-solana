<script lang="ts">
	import { page } from '$app/stores';
	import DecimalInput from '$components/Inputs/DecimalInput.svelte';
	import { stocks } from '$src/db/db';
	import { anchorStore } from '$src/stores/anchorStore';
	import { walletStore } from '$src/stores/walletStore';
	import { web3Store } from '$src/stores/web3Store';
	import { useSignAndSendTransaction } from '$src/utils/wallet/useSignAndSendTx';
	import * as anchor from '@coral-xyz/anchor';
	import { PublicKey, Transaction } from '@solana/web3.js';
	import { get } from 'svelte/store';

	$: ({ params } = $page);
	$: stock = params && params.id ? stocks[Number(params.id)] : stocks[0];

	let sharesToBuy: number;

	const onStockBuy = async () => {
		const { program } = get(anchorStore);
		const { connection } = get(web3Store);
		const wallet = get(walletStore);

		if (!wallet.publicKey) {
			return;
		}

		const [holding, holdingBump] = await PublicKey.findProgramAddress(
			[anchor.utils.bytes.utf8.encode('holding'), wallet.publicKey.toBuffer()],
			program.programId
		);

		const tx = new Transaction();

		tx.add(
			await program.methods
				.createShareholder(holdingBump, new anchor.BN(10))
				.accounts({
					shareholder: holding,
					issuer: new PublicKey('FgEinDLzidRHirdSKQzAERqBPKyBqjdWvjaE3QaARofd'),
					signer: wallet.publicKey!,
					owner: wallet.publicKey,
					state: new PublicKey('7XvP4GS9aTWFukHc26AEv2ccUYGb1zY9Tq3paszh9K52')
				})
				.instruction()
		);

		await useSignAndSendTransaction(connection, wallet, tx);
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
