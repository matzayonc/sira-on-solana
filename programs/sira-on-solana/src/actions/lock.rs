use anchor_lang::prelude::*;

use crate::{Issuer, Shareholder};

#[derive(Accounts)]
pub struct Lock<'info> {
    #[account(mut, seeds = [b"holding", owner.key.as_ref()], bump = shareholder.bump)]
    pub shareholder: Account<'info, Shareholder>,
    /// CHECK: The owner of the action can be any account
    pub owner: AccountInfo<'info>,
    #[account(mut)]
    pub issuer: Account<'info, Issuer>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

impl<'info> Lock<'info> {
    pub fn lock(&mut self) -> Result<()> {
        require_eq!(self.issuer.authority, self.signer.key());

        self.shareholder.locked = true;

        Ok(())
    }

    pub fn unlock(&mut self) -> Result<()> {
        require_eq!(self.issuer.authority, self.signer.key());

        self.shareholder.locked = false;

        Ok(())
    }
}
