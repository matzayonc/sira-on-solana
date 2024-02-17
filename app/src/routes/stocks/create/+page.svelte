<script lang="ts">
	import DecimalInput from '$components/Inputs/DecimalInput.svelte';
	import Input from '$components/Inputs/Input.svelte';
	import { anchorStore } from '$src/stores/anchorStore';
	import { walletStore } from '$src/stores/walletStore';
	import { web3Store } from '$src/stores/web3Store';
	import { useSignAndSendTransaction } from '$src/utils/wallet/useSignAndSendTx';
	import * as anchor from '@coral-xyz/anchor';
	import { Keypair, PublicKey, Transaction } from '@solana/web3.js';
	import { get } from 'svelte/store';

	let stockName: string;
	let krs: string;
	let value: number;

	// const onStateInit = async () => {
	// 	const { program } = get(anchorStore);
	// 	const { connection } = get(web3Store);
	// 	const wallet = get(walletStore);

	// 	const [state, stateBump] = await PublicKey.findProgramAddress(
	// 		[anchor.utils.bytes.utf8.encode('state')],
	// 		program.programId
	// 	);

	// 	const tx = new Transaction();

	// 	tx.add(await program.methods.init(stateBump).accounts({ state }).instruction());

	// 	await useSignAndSendTransaction(connection, wallet, tx);
	// };

	const onIssuerInit = async () => {
		const { program } = get(anchorStore);
		const { connection } = get(web3Store);
		const wallet = get(walletStore);

		const [state, stateBump] = await PublicKey.findProgramAddress(
			[anchor.utils.bytes.utf8.encode('state')],
			program.programId
		);

		const tx = new Transaction();

		const issuer = Keypair.generate();
		tx.add(
			await program.methods
				.createIssuer(stockName, krs, value, false)
				.accounts({
					signer: wallet.publicKey!,
					issuer: issuer.publicKey,
					state
				})
				.instruction()
		);

		await useSignAndSendTransaction(connection, wallet, tx, [issuer]);
	};
</script>

<svelte:head><title>Create Stock</title></svelte:head>

<div>
	<main class="container mx-auto flex justify-center items-center h-screen">
		<div class="border rounded-3xl p-10 flex flex-col justify-between drop-shadow-lg items-center">
			<h1 class="text-3xl mb-10">Create Stock</h1>

			<div class="space-y-5">
				<Input placeholder="Stock Name" bind:value={stockName} />
				<Input placeholder="KRS" bind:value={krs} />
				<DecimalInput placeholder="Value" bind:value />
			</div>

			<button
				class="mt-10 w-2/3 inline-block border-spacing-10 rounded-3xl py-3 px-6 text-sm font-medium bg-gradient-to-r from-[#782a88] to-[#4d626b] text-white shadow-2xl duration-200 ease-in hover:shadow-sky-300/50"
				onclick={onIssuerInit}>Create</button
			>
		</div>
	</main>
</div>
