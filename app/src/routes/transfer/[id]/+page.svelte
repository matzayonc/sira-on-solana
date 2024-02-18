<script lang="ts">
	import { goto } from '$app/navigation';
	import DecimalInput from '$components/Inputs/DecimalInput.svelte';
	import Input from '$components/Inputs/Input.svelte';
	import { anchorStore } from '$src/stores/anchorStore';
	import { walletStore, type WalletStore } from '$src/stores/walletStore';
	import { web3Store } from '$src/stores/web3Store';
	import type { Asset } from '$src/utils/types/asset';
	import type { Issuer } from '$src/utils/types/issuer';
	import { useSignAndSendTransaction } from '$src/utils/wallet/useSignAndSendTx';
	import * as anchor from '@coral-xyz/anchor';
	import { PublicKey, Transaction } from '@solana/web3.js';
	import { get } from 'svelte/store';

	/** @type {import('./$types').PageData} */
	export let data: any;

	$: stock = data.stock as Issuer;
	$: registry = data.registry as Asset[];

	let destination: string;
	let amountToTransfer: number;

	const onTransfer = async () => {
		const { program } = get(anchorStore);
		const { connection } = get(web3Store);
		const wallet = get(walletStore);

		if (!wallet.publicKey) {
			return;
		}

		const [holding, _holdingBump] = await PublicKey.findProgramAddress(
			[
				anchor.utils.bytes.utf8.encode('holding'),
				new PublicKey(stock.public_key).toBuffer(),
				wallet.publicKey.toBuffer()
			],
			program.programId
		);

		const [state, _stateBump] = await PublicKey.findProgramAddress(
			[anchor.utils.bytes.utf8.encode('state')],
			program.programId
		);

		const [otherHolding, bump] = await PublicKey.findProgramAddressSync(
			[
				anchor.utils.bytes.utf8.encode('holding'),
				new PublicKey(stock.public_key).toBuffer(),
				new PublicKey(destination).toBuffer()
			],
			program.programId
		);

		const tx = new Transaction();

		tx.add(
			await program.methods
				.transfer(new anchor.BN(amountToTransfer))
				.accounts({
					state,
					source: holding,
					destination: otherHolding,
					signer: wallet.publicKey,
					issuer: stock.public_key,
					owner: new PublicKey(destination)
				})
				.instruction()
		);

		try {
			await useSignAndSendTransaction(connection, wallet, tx);
			destination = '';
			amountToTransfer = 0;
		} catch (error) {
			console.error(error);
		}
	};

	const showAddressContent = (store: WalletStore) => {
		const base58 = store.publicKey?.toBase58();
		if (!store.wallet || !base58) return null;
		return base58.slice(0, 5) + '..' + base58.slice(-5);
	};
</script>

<svelte:head><title>{stock.name} - Transfer</title></svelte:head>

<main class="container mx-auto flex justify-center items-center flex-col pt-40">
	<div class="relative">
		<div
			class="absolute -top-16 -left-72 h-11 w-11 cursor-pointer items-center justify-center rounded-full text-[#782a88] hover:text-[#888888]"
			onclick={() => goto('/portfolio')}
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

	<div
		class="border rounded-3xl p-10 flex flex-col justify-between drop-shadow-lg items-center space-y-5"
	>
		<h1 class="text-3xl">Transfer</h1>

		<div class="mb-5 w-full mt-8">
			<p>Ticker: {stock.name}</p>
			<p>Name: {stock.name}</p>
			<p>Available: {stock.name}</p>
		</div>

		<p class="text-center">My wallet: <br />{showAddressContent($walletStore)}</p>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="16"
			fill="currentColor"
			class="bi bi-arrow-down"
			viewBox="0 0 16 16"
		>
			<path
				fill-rule="evenodd"
				d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1"
			/>
		</svg>
		<DecimalInput bind:value={amountToTransfer} placeholder="Amount to transfer" />
		<Input bind:value={destination} placeholder="Destination address" />
		<button
			class="mt-5 w-2/3 inline-block border-spacing-10 rounded-3xl py-3 px-6 text-sm font-medium bg-gradient-to-r from-[#782a88] to-[#4d626b] text-white shadow-2xl duration-200 ease-in hover:shadow-sky-300/50"
			onclick={onTransfer}>Transfer</button
		>
	</div>

	<div class="w-2/3 mt-20 mb-10">
		<h2 class="text-lg m-5">Registry</h2>

		<ul class="border rounded-2xl drop-shadow-xl">
			<li class="p-3 mb-2 grid-cols-5 rounded-3xl items-center text-center w-full grid">
				<span>Stock</span>
				<span>Value</span>
				<span>First share number</span>
				<span>Number of shares</span>
			</li>

			{#each registry as asset}
				<li class="p-3 mb-2 grid-cols-5 rounded-3xl items-center text-center w-full grid">
					<span>{asset.issuerName}</span>
					<span>{asset.nominalValue} zł</span>
					<span>{asset.paperNumberFrom + 1}</span>
					<span>{asset.amount}</span>
					<span>
						<button
							class="inline-block rounded-xl py-2 px-6 text-sm font-medium bg-gradient-to-r from-[#782a88] to-[#4d626b] text-white shadow-2xl duration-200 ease-in hover:shadow-sky-300/50"
							onclick={() => {
								destination = asset.ownerKey;
							}}>Copy to desitination</button
						>
					</span>
				</li>
			{/each}
		</ul>
	</div>
</main>
