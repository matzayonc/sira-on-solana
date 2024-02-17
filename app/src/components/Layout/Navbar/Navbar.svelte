<script lang="ts">
	import { page } from '$app/stores';
	import WalletMultiButton from '$components/Wallet/WalletMultiButton.svelte';
	import clsx from 'clsx';

	$: ({ url } = $page);

	$: navbarMenu = [
		{ name: 'Home', url: '/', isActive: url.pathname === '/' ? true : false },
		{ name: 'Stocks', url: '/stocks', isActive: url.pathname === '/stocks' ? true : false },
		{ name: 'Portfolio', url: '/portfolio', isActive: url.pathname === '/portfolio' ? true : false }
	];
</script>

<nav class="fixed z-20 w-full">
	<div class="hidden justify-between p-4 lg:flex">
		<div class="flex flex-1 items-center justify-start">
			<div class="ml-5" id="navbar-default">
				<ul class="flex font-normal">
					{#each navbarMenu as navElement}
						<li>
							<a
								href={navElement.url}
								class={clsx(
									'block bg-transparent py-2 pl-3 pr-4 font-semibold',
									navElement.isActive
										? 'bg-gradient-to-r from-[#782a88] to-[#4d626b] bg-clip-text text-transparent'
										: 'text-gray-500 hover:text-[#1C5C75]'
								)}>{navElement.name}</a
							>
						</li>
					{/each}
				</ul>
			</div>
		</div>

		<div class="mx-5 flex flex-1 items-center justify-end">
			<WalletMultiButton />
		</div>
	</div>
</nav>
