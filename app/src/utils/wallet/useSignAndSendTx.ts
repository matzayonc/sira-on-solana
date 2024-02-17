import type { WalletStore } from '$src/stores/walletStore';
import type { Connection, Signer, Transaction } from '@solana/web3.js';

export async function useSignAndSendTransaction(
	connection: Connection,
	wallet: WalletStore,
	transaction: Transaction,
	singers?: Signer[], // way to fun to change this now
	wait?: boolean
): Promise<string> {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const walletAddress = wallet.publicKey!;

	const blockhash = (await connection.getRecentBlockhash()).blockhash;

	transaction.recentBlockhash = blockhash;
	transaction.feePayer = walletAddress;

	if (singers) transaction.partialSign(...singers);

	let signedTransaction;

	try {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		signedTransaction = await wallet.signTransaction!(transaction);
	} catch (error) {
		console.error(error);
		return 'signing error';
	}

	try {
		const sig = await connection.sendRawTransaction(signedTransaction.serialize(), {
			skipPreflight: true
		});

		if (wait) {
			await connection.confirmTransaction(sig);
		}
		return sig;
	} catch (error) {
		console.error(error);
		return 'sending error';
	}
}
