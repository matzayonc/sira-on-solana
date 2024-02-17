<script lang="ts">
	let stocks = [
		{ id: 1, name: 'Apple', price: 150 },
		{ id: 2, name: 'Google', price: 250 },
		{ id: 3, name: 'Microsoft', price: 300 }
	];
</script>

<svelte:head><title>Stocks</title></svelte:head>

<main class="container mx-auto flex justify-center items-center">
	<!-- <div class="w-2/3 mt-28">
		<h1 class="text">Stocks</h1>

		<ul class="">
			<li>
				<span>Ticker</span>
				<span>Price</span>
			</li>

			{#each stocks as stock}
				<li class="p-3 mb-2 border flex justify-between border-black rounded-3xl items-center">
					<span>{stock.name}</span>
					<span>{stock.price}</span>
					<span
						><a
							class="inline-block rounded-xl py-2 px-6 text-sm font-medium bg-gradient-to-r from-[#782a88] to-[#4d626b] text-white shadow-2xl duration-200 ease-in hover:shadow-sky-300/50"
							href={`/stocks/${stock.id}`}>Details</a
						></span
					>
				</li>
			{/each}
		</ul>
	</div> -->

	<table class="w-2/3 mt-40">
		<thead>
			<tr
				class="p-3 mb-2 border flex justify-between border-black rounded-3xl items-center text-center"
			>
				<th>Stock</th>
				<th>Price</th>
				<th></th>
			</tr>
		</thead>
		<tbody>
			{#each stocks as stock}
				<tr class="p-3 mb-2 border flex justify-between border-black rounded-3xl items-center">
					<td>{stock.name}</td>
					<td>{stock.price}</td>
					<td
						><a
							class="inline-block rounded-xl py-2 px-6 text-sm font-medium bg-gradient-to-r from-[#782a88] to-[#4d626b] text-white shadow-2xl duration-200 ease-in hover:shadow-sky-300/50"
							href={`/stocks/${stock.id}`}>Details</a
						></td
					>
				</tr>
			{/each}
		</tbody>
	</table>
</main>
