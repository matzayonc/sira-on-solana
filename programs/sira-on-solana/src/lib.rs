use std::mem::size_of;

use anchor_lang::prelude::*;

declare_id!("4kKhxNRFxnxXeYn1kfjkkzWpUW91rcuERgaV8qobhk3M");

#[program]
pub mod sira_on_solana {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, name: String, krs: String) -> Result<()> {
        let issuer = &mut ctx.accounts.issuer;
        issuer.new(name, krs);
        Ok(())
    }
}

#[account]
pub struct Issuer {
    pub name: String,
    pub krs: String,
}

impl Issuer {
    pub fn new(&mut self, name: String, krs: String) {
        *self = Self { name, krs };
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = signer, space = 8 + size_of::<Issuer>())]
    pub issuer: Account<'info, Issuer>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}
