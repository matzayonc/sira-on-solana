<script lang="ts">
	import { page } from '$app/stores';
	import DecimalInput from '$components/Inputs/DecimalInput.svelte';
	import { stocks } from '$src/db/db';

	$: ({ params } = $page);
	$: stock = params && params.id ? stocks[Number(params.id)] : stocks[0];

	let sharesToBuy: number;

	const onStockBuy = () => {
		// TODO: Implement buying stocks
		console.log('Buing stocks', stock, 'amount:', sharesToBuy);
	};
</script>

<svelte:head><title>Tesla</title></svelte:head>

<div>
	<h1>Tesla</h1>
	<table>
		<thead>
			<tr>
				<th>Stock</th>
				<th>Price</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>{stock.name}</td>
				<td>{stock.price}</td>
				<td><DecimalInput bind:value={sharesToBuy} /></td>
				<td><button onclick={onStockBuy}>Buy</button></td>
			</tr>
		</tbody>
	</table>
</div>
