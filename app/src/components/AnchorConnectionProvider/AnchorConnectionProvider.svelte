<script lang="ts">
	import { IDL } from '$src/utils/Idl/protocol';
	import { anchorStore } from '$stores/anchorStore';
	import { walletStore, type WalletStore } from '$stores/walletStore';
	import { AnchorProvider, Program } from '@project-serum/anchor';
	import type { Commitment, ConnectionConfig } from '@solana/web3.js';
	import { Connection } from '@solana/web3.js';

	export let network: string,
		config: Commitment | ConnectionConfig | undefined = 'processed';

	const connection = new Connection(network, config);

	function defineProgramAndProvider(walletStore: WalletStore) {
		let { signTransaction, signAllTransactions, publicKey } = walletStore;

		const provider = new AnchorProvider(
			connection,
			{
				publicKey: publicKey!,
				signAllTransactions: signAllTransactions!,
				signTransaction: signTransaction!
			},
			{
				preflightCommitment: 'processed'
			}
		);

		const program = new Program(IDL, PROGRAM_ID, provider);

		anchorStore.set({
			connection,
			program,
			network
		});
	}

	$: $walletStore && $walletStore.publicKey && defineProgramAndProvider($walletStore);
</script>

<slot />
