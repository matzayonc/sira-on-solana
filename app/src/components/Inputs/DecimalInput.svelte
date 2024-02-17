<script lang="ts">
	export let placeholder: string = '0.00';
	export let value: number | undefined;

	let className: string = '';
	export { className as class };

	function onInputChange(event: KeyboardEvent) {
		const key = event.key;
		const isPureDecimal = key.length > 1 || /^\d*\.?\d*$/.test(key);
		const isControlKey = event.ctrlKey || event.altKey;
		if (!isPureDecimal && !isControlKey) {
			event.preventDefault();
		}
	}
</script>

<div
	class="mt-1 rounded-3xl bg-gradient-to-r from-[#782a88] to-[#4d626b] p-0.5 text-center font-semibold"
>
	<div class="rounded-3xl bg-[#f0f0f0]">
		<input
			class="w-full rounded-3xl bg-transparent px-3 py-2 text-sm font-normal placeholder-gray-400 placeholder:italic placeholder:text-slate-400 lg:px-4 lg:py-2 lg:text-base"
			on:keydown={onInputChange}
			on:change
			on:input
			on:keyup
			disabled={$$props.disabled}
			type="text"
			bind:value
			{placeholder}
			pattern="^[0-9-]*[.,]?[0-9]$"
		/>
	</div>
</div>
