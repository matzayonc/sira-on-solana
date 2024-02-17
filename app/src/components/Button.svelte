<script lang="ts">
	export let disabled: boolean = false;

	let className: string = '';
	export { className as class };
</script>

<button
	class="inline-block rounded-3xl py-2 px-6 text-sm font-medium bg-gradient-to-r from-[#FB9D1F] to-[#1C5C75] font-bold text-white shadow-2xl duration-200 ease-in hover:shadow-sky-300/50"
	{disabled}
	on:click
>
	{#if $$slots['icon']}
		<slot name="icon" />
	{/if}
	<slot /></button
>
