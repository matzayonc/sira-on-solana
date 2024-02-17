import type { SiraOnSolana } from '$src/utils/IDL/types/sira_on_solana';
import { Program } from '@project-serum/anchor';
import type { Connection } from '@solana/web3.js';
import { writable } from 'svelte/store';

export type IAnchorStore = {
	connection: Connection;
	program: Program<SiraOnSolana>;
	network: string;
};

export const anchorStore = writable<IAnchorStore>(undefined);
