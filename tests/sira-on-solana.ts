import * as anchor from "@coral-xyz/anchor"
import { Program } from "@coral-xyz/anchor"
import { SiraOnSolana } from "../target/types/sira_on_solana"
import { Connection, Keypair, PublicKey } from "@solana/web3.js"
import { assert } from "chai"
import { BN } from "bn.js"
import { program } from "@coral-xyz/anchor/dist/cjs/native/system"

// @ts-ignore
const signer = anchor.getProvider().wallet.publicKey

describe("Pausing", () => {
	anchor.setProvider(anchor.AnchorProvider.env())

	const program = anchor.workspace.SiraOnSolana as Program<SiraOnSolana>

	it("can pause", async () => {
		const anchor = program.methods.in
	})
})

describe("sira-on-solana", () => {
	// Configure the client to use the local cluster.
	anchor.setProvider(anchor.AnchorProvider.env())

	const program = anchor.workspace.SiraOnSolana as Program<SiraOnSolana>

	it("Is initialized!", async () => {
		const provider = anchor.getProvider()

		const issuer = Keypair.generate()

		const name = "DotWave"
		const krs = "1234"

		const tx = await program.methods
			.createIssuer(name, krs)
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

		const issuers = await program.account.issuer.all()
		assert.equal(issuers.length, 1)
		assert.equal(issuers[0].account.name, name)
		assert.equal(issuers[0].account.krs, krs)

		// create a shareholder
		const shareholder = Keypair.generate()
		const holding = Keypair.generate()
		const amount = 42
		await program.methods
			.createShareholder(shareholder.publicKey, new BN(amount))
			.accounts({
				shareholder: holding.publicKey,
				issuer: issuer.publicKey,
				signer: signer.publicKey,
			})
			.signers([holding])
			.rpc()

		const shareholderAccount = await program.account.shareholder.fetch(
			holding.publicKey
		)

		assert.equal(shareholderAccount.amount.toNumber(), amount)
		assert.ok(shareholderAccount.issuer.equals(issuer.publicKey))
		assert.ok(shareholderAccount.owner.equals(shareholder.publicKey))

		// create another shareholder
		const anotherShareholder = Keypair.generate()
		const anotherHolding = Keypair.generate()
		const anotherAmount = 42
		await program.methods
			.createShareholder(
				anotherShareholder.publicKey,
				new BN(anotherAmount)
			)
			.accounts({
				shareholder: anotherHolding.publicKey,
				issuer: issuer.publicKey,
				signer: signer.publicKey,
			})
			.signers([anotherHolding])
			.rpc()

		const anotherShareholderAccount =
			await program.account.shareholder.fetch(anotherHolding.publicKey)

		assert.equal(anotherShareholderAccount.amount.toNumber(), anotherAmount)
		assert.ok(anotherShareholderAccount.issuer.equals(issuer.publicKey))
		assert.ok(
			anotherShareholderAccount.owner.equals(anotherShareholder.publicKey)
		)

		// fetch only the first shareholder
		const firstStakeholder = await program.account.shareholder.all([
			{
				memcmp: {
					offset: 8,
					bytes: shareholder.publicKey.toBase58(),
				},
			},
		])

		assert.equal(firstStakeholder.length, 1)
		assert.ok(
			firstStakeholder[0].account.owner.equals(shareholder.publicKey)
		)
	})
})
