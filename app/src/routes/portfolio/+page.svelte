<script lang="ts">
	import { walletStore } from '$src/stores/walletStore';
	import type { Asset } from '$src/utils/types/asset';

	/** @type {import('./$types').PageData} */
	export let data: any;

	$: assets = data.assets as Asset[] | null;
	$: wallet = $walletStore;
</script>

<svelte:head><title>Portfolio</title></svelte:head>

<main class="container mx-auto flex flex-col justify-center items-center">
	<div class="w-2/3 mt-28">
		<h1 class="text-2xl mb-7 ml-5">Assets</h1>

		{#if assets === null}
			<p class="text-center mt-40">Connect your wallet</p>
		{:else if assets.length === 0}
			<p class="text-center mt-40">No assets found</p>
		{:else if assets.length > 0}
			<ul class="w-full border rounded-2xl drop-shadow-xl">
				<li class="p-3 mb-2 grid-cols-5 rounded-3xl items-center text-center w-full grid">
					<span>Stock</span>
					<span>Value</span>
					<span>First share number</span>
					<span>Number of shares</span>
				</li>

				{#each assets as asset}
					<li class="p-3 mb-2 grid-cols-5 rounded-3xl items-center text-center w-full grid">
						<span>{asset.issuerName}</span>
						<span>{asset.nominalValue} zł</span>
						<span>{asset.paperNumberFrom + 1}</span>
						<span>{asset.amount}</span>
						<span>
							<a
								class="inline-block rounded-xl py-2 px-6 text-sm font-medium bg-gradient-to-r from-[#782a88] to-[#4d626b] text-white shadow-2xl duration-200 ease-in hover:shadow-sky-300/50"
								href={`/transfer/${asset.issuerKey}`}>Transfer</a
							>
						</span>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</main>
