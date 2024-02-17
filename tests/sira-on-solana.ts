import * as anchor from "@coral-xyz/anchor"
import { Program } from "@coral-xyz/anchor"
import { Keypair, PublicKey } from "@solana/web3.js"
import { assert } from "chai"
import { BN } from "bn.js"
import { SiraOnSolana } from "../target/types/sira_on_solana"

// @ts-ignore
const signer = anchor.getProvider().wallet.publicKey

describe("Issuing", () => {
	// Configure the client to use the local cluster.
	anchor.setProvider(anchor.AnchorProvider.env())

	const program = anchor.workspace.SiraOnSolana as Program<SiraOnSolana>

	it("the whole flow", async () => {
		const [state, stateBump] = await PublicKey.findProgramAddress(
			[anchor.utils.bytes.utf8.encode("state")],
			program.programId
		)

		await program.methods.init(stateBump).accounts({ state }).rpc()

		const stateAccount = await program.account.state.fetch(state)
		assert.ok(!stateAccount.paused)
		assert.ok(stateAccount.authority.equals(signer))
		assert.equal(stateAccount.bump, stateBump)

		// pausing
		await program.methods.pause().accounts({ state }).rpc()

		const pausedStateAccount = await program.account.state.fetch(state)
		assert.ok(pausedStateAccount.paused)
		assert.ok(pausedStateAccount.authority.equals(signer))
		assert.equal(pausedStateAccount.bump, stateBump)

		await program.methods.unpause().accounts({ state }).rpc()
		assert.ok(!stateAccount.paused)
		assert.ok(stateAccount.authority.equals(signer))
		assert.equal(stateAccount.bump, stateBump)

		// issuing
		const issuer = Keypair.generate()
		const name = "DotWave"
		const krs = "1234"
		await program.methods
			.createIssuer(name, krs, 1.2, false)
			.accounts({
				signer,
				issuer: issuer.publicKey,
				state,
			})
			.signers([issuer])
			.rpc()
		const issuerAccount = await program.account.issuer.fetch(
			issuer.publicKey
		)
		assert.equal(issuerAccount.name, name)
		assert.equal(issuerAccount.krs, krs)
		assert.equal(issuerAccount.emitted.toNumber(), 0)
		assert.isFalse(issuerAccount.usingIsin)

		const issuers = await program.account.issuer.all()
		assert.equal(issuers.length, 1)
		assert.equal(issuers[0].account.name, name)
		assert.equal(issuers[0].account.krs, krs)

		// create a shareholder
		const shareholder = Keypair.generate()
		const [holding, holdingBump] = await PublicKey.findProgramAddress(
			[
				anchor.utils.bytes.utf8.encode("holding"),
				shareholder.publicKey.toBuffer(),
			],
			program.programId
		)
		const amount = 42
		await program.methods
			.createShareholder(holdingBump, new BN(amount))
			.accounts({
				shareholder: holding,
				issuer: issuer.publicKey,
				signer: signer.publicKey,
				owner: shareholder.publicKey,
				state,
			})
			.rpc()
		const shareholderAccount = await program.account.shareholder.fetch(
			holding
		)
		assert.equal(shareholderAccount.amount.toNumber(), amount)
		assert.ok(shareholderAccount.issuer.equals(issuer.publicKey))
		assert.ok(shareholderAccount.owner.equals(shareholder.publicKey))

		// create another shareholder
		const anotherShareholder = Keypair.generate()
		const [anotherHolding, anotherHoldingBump] =
			await PublicKey.findProgramAddress(
				[
					anchor.utils.bytes.utf8.encode("holding"),
					anotherShareholder.publicKey.toBuffer(),
				],
				program.programId
			)

		const anotherAmount = 42
		await program.methods
			.createShareholder(anotherHoldingBump, new BN(anotherAmount))
			.accounts({
				shareholder: anotherHolding,
				issuer: issuer.publicKey,
				signer: signer.publicKey,
				owner: anotherShareholder.publicKey,
				state,
			})
			.rpc()

		const anotherShareholderAccount =
			await program.account.shareholder.fetch(anotherHolding)
		assert.equal(anotherShareholderAccount.amount.toNumber(), anotherAmount)
		assert.equal(anotherShareholderAccount.first.toNumber(), amount)
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

		// check emitted after
		const issuerAccountAfter = await program.account.issuer.fetch(
			issuer.publicKey
		)
		assert.equal(
			issuerAccountAfter.emitted.toNumber(),
			amount + anotherAmount
		)

		// transfer
		await program.methods
			.transfer(new BN(4))
			.accounts({
				state,
				source: anotherHolding,
				destination: holding,
				signer: anotherShareholder.publicKey,
				owner: shareholder.publicKey,
			})
			.signers([anotherShareholder])
			.rpc()

		const shareholderAccountAfterTransfer =
			await program.account.shareholder.fetch(holding)
		assert.equal(
			shareholderAccountAfterTransfer.amount.toNumber(),
			amount + 4
		)
		const anotherShareholderAccountAfterTransfer =
			await program.account.shareholder.fetch(anotherHolding)
		assert.equal(
			anotherShareholderAccountAfterTransfer.amount.toNumber(),
			amount - 4
		)
	})
})
