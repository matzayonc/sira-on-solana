<script lang="ts">
	import DecimalInput from '$components/Inputs/DecimalInput.svelte';
	import { anchorStore } from '$src/stores/anchorStore';
	import { walletStore } from '$src/stores/walletStore';
	import { web3Store } from '$src/stores/web3Store';
	import { useSignAndSendTransaction } from '$src/utils/wallet/useSignAndSendTx';
	import * as anchor from '@coral-xyz/anchor';
	import { PublicKey, Transaction } from '@solana/web3.js';
	import { get } from 'svelte/store';
	import type { Issuer } from '../+page';
	import Input from '$components/Inputs/Input.svelte';

	/** @type {import('./$types').PageData} */
	export let data: any;

	$: stock = data.stock as Issuer;

	let sharesToBuy: number;
	let name: string;

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

		const [state, _stateBump] = await PublicKey.findProgramAddress(
			[anchor.utils.bytes.utf8.encode("state")],
			program.programId
		)


		tx.add(
			await program.methods
				.createShareholder(holdingBump, name, new anchor.BN(10))
				.accounts({
					shareholder: holding,
					issuer: stock.public_key,
					signer: wallet.publicKey!,
					owner: wallet.publicKey,
					state
				})
				.instruction()
		);

		await useSignAndSendTransaction(connection, wallet, tx);
	};
</script>

<svelte:head><title>{stock.name}</title></svelte:head>

<main class="container mx-auto flex justify-center items-center h-screen">
	<div class="border rounded-3xl p-10 flex flex-col justify-between drop-shadow-lg items-center">
		<h1 class="text-3xl">{stock.name}</h1>

		<div class="mb-5 w-full mt-8">
			<p>Krs: {stock.krs}</p>
			<p>Key: {stock.public_key}</p>
		</div>

		<DecimalInput bind:value={sharesToBuy} />
		<Input bind:value={name} placeholder="Name" />
		<button
			class="mt-5 w-2/3 inline-block border-spacing-10 rounded-3xl py-3 px-6 text-sm font-medium bg-gradient-to-r from-[#782a88] to-[#4d626b] text-white shadow-2xl duration-200 ease-in hover:shadow-sky-300/50"
			onclick={onStockBuy}>Buy</button
		>
	</div>
</main>
