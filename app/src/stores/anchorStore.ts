// import type { Protocol } from '$src/utils/Idl/protocol';
import type { Connection } from '@solana/web3.js';
import { writable } from 'svelte/store';

export type IAnchorStore = {
	connection: Connection;
	// program: Program<Protocol>;
	network: string;
};

export const anchorStore = writable<IAnchorStore>(undefined);
