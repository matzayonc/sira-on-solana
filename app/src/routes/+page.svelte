<script>
	import image from '$lib/images/solanaLogoMark.png';
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section class="container mx-auto flex justify-center items-center flex-col h-screen">
	<div class="font-bold text-gray-300 text-9xl">
		<p
			class="inline-block bg-gradient-to-r from-[#782a88] to-[#4d626b] bg-clip-text text-transparent"
		>
			Sira
		</p>

		demo app
	</div>
	<div class="mt-16 w-3/4 xl:w-3/5 text-center">
		<p class="flex text-md font-semibold text-gray-400 lg:text-lg justify-center items-center">
			Powered by Solana <img src={image} alt="Solana" class="ml-4" width="30" />
		</p>
	</div>
</section>

<style>
</style>
