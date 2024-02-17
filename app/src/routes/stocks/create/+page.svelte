<script lang="ts">
	import { anchorStore } from '$src/stores/anchorStore';
	import { walletStore } from '$src/stores/walletStore';
	import { web3Store } from '$src/stores/web3Store';
	import { useSignAndSendTransaction } from '$src/utils/wallet/useSignAndSendTx';
	import * as anchor from '@coral-xyz/anchor';
	import { Keypair, PublicKey, Transaction } from '@solana/web3.js';
	import { get } from 'svelte/store';

	let stockName: string;
	let krs: string;

	const onStateInit = async () => {
		const { program } = get(anchorStore);
		const { connection } = get(web3Store);
		const wallet = get(walletStore);

		const [state, stateBump] = await PublicKey.findProgramAddress(
			[anchor.utils.bytes.utf8.encode('state')],
			program.programId
		);

		const tx = new Transaction();

		tx.add(await program.methods.init(stateBump).accounts({ state }).instruction());

		await useSignAndSendTransaction(connection, wallet, tx);
	};

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
				.createIssuer(stockName, krs, 10000)
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
	<h1>Create Stock</h1>
	<form>
		<input type="text" placeholder="Stock Name" bind:value={stockName} />
		<input type="text" placeholder="KRS" bind:value={krs} />
		<button class="" onclick={onIssuerInit}>Buy</button>
	</form>
</div>
