<script lang="ts">
	import { goto } from '$app/navigation';
	import DecimalInput from '$components/Inputs/DecimalInput.svelte';
	import Input from '$components/Inputs/Input.svelte';
	import { anchorStore } from '$src/stores/anchorStore';
	import { walletStore } from '$src/stores/walletStore';
	import { web3Store } from '$src/stores/web3Store';
	import type { Issuer } from '$src/utils/types/issuer';
	import { useSignAndSendTransaction } from '$src/utils/wallet/useSignAndSendTx';
	import * as anchor from '@coral-xyz/anchor';
	import { PublicKey, Transaction } from '@solana/web3.js';
	import { get } from 'svelte/store';

	/** @type {import('./$types').PageData} */
	export let data: any;

	$: stock = data.stock as Issuer;

	let sharesToBuy: number;
	let name: string;
	let owner: string;

	const onStockBuy = async () => {
		const { program } = get(anchorStore);
		const { connection } = get(web3Store);
		const wallet = get(walletStore);

		if (!wallet.publicKey) {
			return;
		}

		// const owner = new PublicKey('3DaBobUvMs1oQSmSwy2HcZQDy5U3RWLvwoamz1cWkxXw');
		const ownerKey = new PublicKey(owner);

		const [holding, holdingBump] = await PublicKey.findProgramAddress(
			[anchor.utils.bytes.utf8.encode('holding'), ownerKey.toBuffer()],
			program.programId
		);

		const tx = new Transaction();

		const [state, _stateBump] = await PublicKey.findProgramAddress(
			[anchor.utils.bytes.utf8.encode('state')],
			program.programId
		);

		tx.add(
			await program.methods
				.createShareholder(holdingBump, name, new anchor.BN(10))
				.accounts({
					shareholder: holding,
					issuer: stock.public_key,
					signer: wallet.publicKey!,
					owner: ownerKey,
					state
				})
				.instruction()
		);

		try {
			await useSignAndSendTransaction(connection, wallet, tx);
			sharesToBuy = 0;
			name = '';
		} catch (error) {
			console.error(error);
		}
	};

	const showAddressContent = (key: string) => {
		return key.slice(0, 6) + '..' + key.slice(-6);
	};
</script>

<svelte:head><title>{stock.name} - Transfer</title></svelte:head>

<main class="container mx-auto flex justify-center items-center h-screen flex-col">
	<div class="relative">
		<div
			class="absolute -top-16 -left-80 h-11 w-11 cursor-pointer items-center justify-center rounded-full text-[#782a88] hover:text-[#888888]"
			onclick={() => goto('/stocks')}
		>
			<svg
				class="h-6 w-6"
				aria-hidden="true"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 14 10"
			>
				<path
					stroke="currentColor"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M13 5H1m0 0 4 4M1 5l4-4"
				/>
			</svg>
		</div>
	</div>

	<div class="border rounded-3xl p-10 flex flex-col justify-between drop-shadow-lg items-center">
		<h1 class="text-3xl">Issue</h1>

		<div class="mb-5 w-full mt-8">
			<p>Ticker: {stock.ticker}</p>
			<p>Name: {stock.name}</p>
			<p>Krs: {stock.krs}</p>
			<p>Key: {showAddressContent(stock.public_key)}</p>
		</div>

		<DecimalInput bind:value={sharesToBuy} placeholder="Amount" />
		<Input bind:value={name} placeholder="Name" />
		<Input bind:value={owner} placeholder="Owner's Key" />
		<button
			class="mt-5 w-2/3 inline-block border-spacing-10 rounded-3xl py-3 px-6 text-sm font-medium bg-gradient-to-r from-[#782a88] to-[#4d626b] text-white shadow-2xl duration-200 ease-in hover:shadow-sky-300/50"
			onclick={onStockBuy}>Issue</button
		>
	</div>
</main>
