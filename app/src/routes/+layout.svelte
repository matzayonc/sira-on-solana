<script lang="ts">
	import './styles.scss';

	import type { Adapter } from '@solana/wallet-adapter-base';
	import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
	import { clusterApiUrl } from '@solana/web3.js';
	import { onMount } from 'svelte';

	import AnchorConnectionProvider from '$components/AnchorConnectionProvider/AnchorConnectionProvider.svelte';
	import Navbar from '$components/Layout/Navbar/Navbar.svelte';
	import WalletProvider from '$components/Wallet/WalletProvider.svelte';
	import ConnectionProvider from '$components/Web3/ConnectionProvider.svelte';

	const localStorageKey = 'walletAdapter';
	const network = clusterApiUrl('devnet');
	let wallets: Adapter[];

	onMount(async () => {
		wallets = [new PhantomWalletAdapter()];
	});
</script>

<AnchorConnectionProvider {network} />
<ConnectionProvider {network} />
<WalletProvider {localStorageKey} {wallets} autoConnect />

<Navbar />

<slot />
