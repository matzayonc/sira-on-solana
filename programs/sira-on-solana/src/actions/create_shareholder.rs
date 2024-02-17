use std::mem::size_of;

use anchor_lang::prelude::*;

use crate::{Issuer, Shareholder};

#[derive(Accounts)]
#[instruction(bump: u8)]
pub struct CreateShareholder<'info> {
    #[account(init, 
        payer = signer, 
        space = 8 + size_of::<Issuer>(),
        seeds = [b"holding", owner.key.as_ref()], bump
    )]
    pub shareholder: Account<'info, Shareholder>,
    #[account(mut)]
    pub issuer: Account<'info, Issuer>,
    #[account(mut)]
    pub signer: Signer<'info>,
    /// CHECK: The owner of the action can be any account
    pub owner: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

impl<'info> CreateShareholder<'info> {
    pub fn handle(&mut self, amount: u64) -> Result<()> {
        require_eq!(self.issuer.authority, self.signer.key());

        *self.shareholder = Shareholder {
            owner: self.owner.key(),
            issuer: self.issuer.key(),
            amount,
            locked: false,
        };

        Ok(())
    }
}
