<script lang="ts">
	import { web3Store } from '$src/stores/web3Store';
	import type { Commitment, ConnectionConfig } from '@solana/web3.js';
	import { Connection } from '@solana/web3.js';

	export let network: string,
		config: Commitment | ConnectionConfig | undefined = 'processed';

	const connection = new Connection(network, config);
	web3Store.set({ connection });
</script>
