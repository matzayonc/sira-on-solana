<script lang="ts">
	import { goto } from '$app/navigation';

	let stocks = [
		{ id: 1, name: 'Apple', price: 150 },
		{ id: 2, name: 'Google', price: 250 },
		{ id: 3, name: 'Microsoft', price: 300 }
	];
</script>

<svelte:head><title>Stocks</title></svelte:head>

<div>
	<h1>Stocks</h1>

	<table>
		<thead>
			<tr>
				<th>Stock</th>
				<th>Price</th>
			</tr>
		</thead>
		<tbody>
			{#each stocks as stock}
				<tr onclick={() => goto(`/stocks/${stock.id}`)}>
					<td>{stock.name}</td>
					<td>{stock.price}</td>
					<td><a href={`/stocks/${stock.id}`}>Home</a></td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
