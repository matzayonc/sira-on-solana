use std::mem::size_of;

use anchor_lang::prelude::*;

declare_id!("4kKhxNRFxnxXeYn1kfjkkzWpUW91rcuERgaV8qobhk3M");

#[program]
pub mod sira_on_solana {
    use super::*;

    pub fn create_issuer(ctx: Context<CreateIssuer>, name: String, krs: String) -> Result<()> {
        let issuer: &mut Issuer = &mut ctx.accounts.issuer;

        *issuer = Issuer {
            name,
            krs,
            authority: ctx.accounts.signer.key(),
        };

        Ok(())
    }

    pub fn create_shareholder(
        ctx: Context<CreateShareholder>,
        owner: Pubkey,
        amount: u64,
    ) -> Result<()> {
        let shareholder: &mut Shareholder = &mut ctx.accounts.shareholder;
        assert_eq!(ctx.accounts.issuer.authority, ctx.accounts.signer.key());
        *shareholder = Shareholder {
            owner: owner,
            issuer: ctx.accounts.issuer.key(),
            amount,
        };

        Ok(())
    }
}

#[account]
pub struct Issuer {
    pub name: String,
    pub krs: String,
    pub authority: Pubkey,
}

#[account]
pub struct Shareholder {
    pub owner: Pubkey,
    pub issuer: Pubkey,
    pub amount: u64,
}

#[derive(Accounts)]
pub struct CreateIssuer<'info> {
    #[account(init, payer = signer, space = 8 + size_of::<Issuer>())]
    pub issuer: Account<'info, Issuer>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateShareholder<'info> {
    #[account(init, payer = signer, space = 8 + size_of::<Issuer>())]
    pub shareholder: Account<'info, Shareholder>,
    #[account(mut)]
    pub issuer: Account<'info, Issuer>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}
