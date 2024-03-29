<script lang="ts">
	import { walletStore, type WalletStore } from '$stores/walletStore';
	import WalletButton from './WalletButton.svelte';
	import WalletConnectButton from './WalletConnectButton.svelte';
	import WalletModal from './WalletModal.svelte';

	export let maxNumberOfWallets = 3;

	$: ({ publicKey, wallet, disconnect, connect, select } = $walletStore);

	let dropDrownVisible = false,
		modalVisible = false,
		copied = false;

	$: base58 = publicKey && publicKey?.toBase58();
	$: content = showAddressContent($walletStore);

	const copyAddress = async () => {
		if (!base58) return;
		await navigator.clipboard.writeText(base58);
		copied = true;
		setTimeout(() => (copied = false), 400);
	};

	const openDropdown = () => (dropDrownVisible = true);
	const closeDropdown = () => (dropDrownVisible = false);
	const openModal = () => {
		modalVisible = true;
		closeDropdown();
	};
	const closeModal = () => (modalVisible = false);

	function showAddressContent(store: WalletStore) {
		const base58 = store.publicKey?.toBase58();
		if (!store.wallet || !base58) return null;
		return base58.slice(0, 4) + '..' + base58.slice(-4);
	}

	async function connectWallet(event: any) {
		closeModal();
		select(event.detail);
		await connect();
	}

	async function disconnectWallet(event: any) {
		closeDropdown();
		await disconnect();
	}

	interface CallbackType {
		(arg?: string): void;
	}

	function clickOutside(node: HTMLElement, callbackFunction: CallbackType): SvelteActionReturnType {
		function onClick(event: MouseEvent) {
			if (
				node &&
				event.target instanceof Node &&
				!node.contains(event.target) &&
				!event.defaultPrevented
			) {
				callbackFunction();
			}
		}

		document.body.addEventListener('click', onClick, true);

		return {
			update(newCallbackFunction: CallbackType) {
				callbackFunction = newCallbackFunction;
			},
			destroy() {
				document.body.removeEventListener('click', onClick, true);
			}
		};
	}

	// async function onFaucetClick() {
	// 	const { connection } = get(web3Store);
	// 	const wallet = get(walletStore);
	// 	if (wallet) {
	// 		await useMintDevnetTokens(connection, wallet);
	// 		delay(async () => {
	// 			await loadUserStoreAccounts();
	// 		}, 3000);

	// 		if (dropDrownVisible) {
	// 			closeDropdown();
	// 		}
	// 	}
	// }
</script>

{#if !wallet}
	<WalletButton class="wallet-adapter-button-trigger" on:click={openModal}>
		<slot>Connect Wallet</slot>
	</WalletButton>
{:else if !base58}
	<WalletConnectButton />
{:else}
	<div class="wallet-adapter-dropdown">
		<WalletButton on:click={openDropdown} class="wallet-adapter-button-trigger">
			<svelte:fragment slot="start-icon">
				<img src={wallet.icon} alt={`${wallet.name} icon`} />
			</svelte:fragment>
			{content}
		</WalletButton>
		{#if dropDrownVisible}
			<ul
				aria-label="dropdown-list"
				class="wallet-adapter-dropdown-list wallet-adapter-dropdown-list-active"
				role="menu"
				use:clickOutside={() => {
					if (dropDrownVisible) {
						closeDropdown();
					}
				}}
			>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- <li on:click={onFaucetClick} class="wallet-adapter-dropdown-list-item" role="menuitem">
					Faucet
				</li> -->
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<li on:click={copyAddress} class="wallet-adapter-dropdown-list-item" role="menuitem">
					{copied ? 'Copied' : 'Copy address'}
				</li>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<li on:click={openModal} class="wallet-adapter-dropdown-list-item" role="menuitem">
					Connect a different wallet
				</li>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<li on:click={disconnectWallet} class="wallet-adapter-dropdown-list-item" role="menuitem">
					Disconnect
				</li>
			</ul>
		{/if}
	</div>
{/if}

{#if modalVisible}
	<WalletModal on:close={closeModal} on:connect={connectWallet} {maxNumberOfWallets} />
{/if}
