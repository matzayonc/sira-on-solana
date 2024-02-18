<script lang="ts">
	import type { Issuer } from '$src/utils/types/issuer';

	/** @type {import('./$types').PageData} */
	export let data: any;

	$: stocks = data.stocks as Issuer[];
</script>

<svelte:head><title>Stocks</title></svelte:head>

<main class="container mx-auto flex flex-col justify-center items-center">
	<div class="w-2/3 mt-28">
		<h1 class="text-2xl mb-7 ml-5">Stocks</h1>

		<ul class="w-full border rounded-2xl drop-shadow-xl">
			<li class="p-3 mb-2 grid-cols-6 rounded-3xl items-center text-center w-full grid">
				<span>Ticker</span>
				<span>Name</span>
				<span>Krs</span>
				<span>Issued</span>
				<span>Value</span>
			</li>

			{#each stocks as stock}
				<li class="p-3 mb-2 grid-cols-6 rounded-3xl items-center text-center w-full grid">
					<span>{stock.ticker}</span>
					<span>{stock.name}</span>
					<span>{stock.krs}</span>
					<span>{stock.issued}</span>
					<span>{stock.value} zł</span>
					<span>
						<a
							class="inline-block rounded-xl py-2 px-6 text-sm font-medium bg-gradient-to-r from-[#782a88] to-[#4d626b] text-white shadow-2xl duration-200 ease-in hover:shadow-sky-300/50"
							href={`/stocks/${stock.public_key}`}>Issue</a
						>

						<a
							class="inline-block rounded-xl py-2 px-6 text-sm font-medium bg-gradient-to-r from-[#782a88] to-[#4d626b] text-white shadow-2xl duration-200 ease-in hover:shadow-sky-300/50"
							href={`/registry/?issuer=${stock.public_key}`}
							target="_blank">API</a
						>
					</span>
				</li>
			{/each}
		</ul>
	</div>

	<a
		href="/stocks/create"
		class="mt-12 inline-block rounded-xl py-2 px-6 text-sm font-medium bg-gradient-to-r from-[#782a88] to-[#4d626b] text-white shadow-2xl duration-200 ease-in hover:shadow-sky-300/50"
		>Create new</a
	>
</main>
