use std::mem::size_of;

use anchor_lang::prelude::*;

use crate::{Issuer, Shareholder};

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

impl<'info> CreateShareholder<'info> {
    pub fn handle(&mut self, owner: Pubkey, amount: u64) -> Result<()> {
        require_eq!(self.issuer.authority, self.signer.key());

        *self.shareholder = Shareholder {
            owner: owner,
            issuer: self.issuer.key(),
            amount,
        };

        Ok(())
    }
}
