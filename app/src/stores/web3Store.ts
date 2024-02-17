import type { Connection } from '@solana/web3.js';
import { writable } from 'svelte/store';

type WalletStore = {
	connection: Connection;
};

export const web3Store = writable<WalletStore>(undefined);
