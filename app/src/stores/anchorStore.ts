import { IDL, type SiraOnSolana } from '$src/utils/IDL/types/sira_on_solana';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { Connection, Keypair, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { writable } from 'svelte/store';

export type IAnchorStore = {
	connected: boolean;
	connection: Connection;
	program: Program<SiraOnSolana>;
	network: string;
};

export const PROGRAM_ID = new PublicKey('HxcpLz2sBehJSEqp5vtUnzpHGWYrwXhCZGTPAunoHUZZ');

const unconnectedConnection = new Connection('https://api.devnet.solana.com');
const unconnectedProvider = new AnchorProvider(
	unconnectedConnection,
	{
		publicKey: Keypair.generate().publicKey,
		// @ts-expect-error not a valid sign
		signAllTransactions: () => {},
		// @ts-expect-error not a valid sign
		signTransaction: () => {}
	},
	{
		preflightCommitment: 'processed'
	}
);

const unconnectedProgram = new Program<SiraOnSolana>(IDL, PROGRAM_ID, unconnectedProvider);

const unconnected: IAnchorStore = {
	connected: false,
	connection: unconnectedConnection,
	program: unconnectedProgram,
	network: clusterApiUrl('devnet')
};

export const anchorStore = writable<IAnchorStore>(unconnected);
