import * as anchor from "@coral-xyz/anchor"
import { Program } from "@coral-xyz/anchor"
import { SiraOnSolana } from "../target/types/sira_on_solana"
import { Keypair, PublicKey } from "@solana/web3.js"
import { assert } from "chai"

// @ts-ignore
const signer = anchor.getProvider().wallet.publicKey

describe("sira-on-solana", () => {
	// Configure the client to use the local cluster.
	anchor.setProvider(anchor.AnchorProvider.env())

	const program = anchor.workspace.SiraOnSolana as Program<SiraOnSolana>

	it("Is initialized!", async () => {
		const provider = anchor.getProvider()

		const issuer = Keypair.generate()

		const name = "DotWave"
		const krs = "1234"

		// const [issuer, issuerBump] = await PublicKey.findProgramAddress(
		// 	[anchor.utils.bytes.utf8.encode("issuer"), signer.toBuffer()],
		// 	program.programId
		// )

		// Add your test here.
		const tx = await program.methods
			.initialize(name, krs)
			.accounts({
				signer,
				issuer: issuer.publicKey,
			})
			.signers([issuer])
			.rpc()

		const issuerAccount = await program.account.issuer.fetch(
			issuer.publicKey
		)

		assert.equal(issuerAccount.name, name)
		assert.equal(issuerAccount.krs, krs)
	})
})
