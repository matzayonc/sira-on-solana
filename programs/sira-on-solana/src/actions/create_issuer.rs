use std::mem::size_of;

use anchor_lang::prelude::*;

use crate::{errors::Errors, Issuer, State};

#[derive(Accounts)]
pub struct CreateIssuer<'info> {
    #[account(mut, seeds = [b"state"], bump = state.bump)]
    pub state: Account<'info, State>,
    #[account(init, payer = signer, space = 8 + size_of::<Issuer>())]
    pub issuer: Account<'info, Issuer>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

impl<'info> CreateIssuer<'info> {
    pub fn handle(&mut self, name: String, krs: String) -> Result<()> {
        require!(!self.state.paused, Errors::SystemIsPaused);

        *self.issuer = Issuer {
            name,
            krs,
            authority: self.signer.key(),
        };

        Ok(())
    }
}
