<script lang="ts">
	import { IDL, type SiraOnSolana } from '$src/utils/IDL/types/sira_on_solana';
	import { anchorStore } from '$stores/anchorStore';
	import { walletStore, type WalletStore } from '$stores/walletStore';
	import { AnchorProvider, Program } from '@project-serum/anchor';
	import type { Commitment, ConnectionConfig } from '@solana/web3.js';
	import { Connection, PublicKey } from '@solana/web3.js';

	const PROGRAM_ID = new PublicKey('4kKhxNRFxnxXeYn1kfjkkzWpUW91rcuERgaV8qobhk3M');

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

		const program = new Program<SiraOnSolana>(IDL, PROGRAM_ID, provider);

		anchorStore.set({
			connection,
			program,
			network
		});
	}

	$: $walletStore && $walletStore.publicKey && defineProgramAndProvider($walletStore);
</script>

<slot />
