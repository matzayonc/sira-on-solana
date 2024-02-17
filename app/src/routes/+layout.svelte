<script lang="ts">
	import type { Adapter } from '@solana/wallet-adapter-base';
	import { PhantomWalletAdapter, TrustWalletAdapter } from '@solana/wallet-adapter-wallets';
	import { clusterApiUrl } from '@solana/web3.js';
	// import AnchorConnectionProvider from '$components/AnchorConnectionProvider/AnchorConnectionProvider.svelte';
	import WalletProvider from '$components/Wallet/WalletProvider.svelte';
	import ConnectionProvider from '$components/Web3/ConnectionProvider.svelte';

	const localStorageKey = 'walletAdapter';
	const network = clusterApiUrl('mainnet-beta');
	let wallets: Adapter[];

	wallets = [new PhantomWalletAdapter(), new TrustWalletAdapter()];
</script>

<!-- <AnchorConnectionProvider {network} /> -->
<ConnectionProvider {network} />
<WalletProvider {localStorageKey} {wallets} autoConnect />

<!-- <Notifications item={Notification}>
	<div class="container">
		<header class="header">
			<nav class="nav">
				<div class="logo-box">
					<a href="/swap/USDC_SOL" class="logo-box__link"
						><ImageLoader src={Logo} alt="protocol-logo" class="logo-box__logo" /></a
					>
				</div>

				<ul class="nav__list">
					<li class="nav__item">
						<a href="/swap/USDC_SOL" class="nav__link">Swap</a>
					</li>
					<li class="nav__item">
						<a href="/trade/SOL" class="nav__link">Trade</a>
					</li>
					<li class="nav__item">
						<a href="/borrow/SOL" class="nav__link">Borrow</a>
					</li>
					<li class="nav__item">
						<a href="/strategy" class="nav__link">Strategy</a>
					</li>
				</ul>
			</nav>

			<div class="wallet-wrapper">
				<WalletMultiButton />
			</div>
		</header>

		<slot />
	</div>
</Notifications> -->
