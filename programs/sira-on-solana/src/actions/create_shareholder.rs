use std::mem::size_of;

use anchor_lang::prelude::*;

use crate::{errors::Errors, Issuer, Shareholder, State};

#[derive(Accounts)]
#[instruction(bump: u8)]
pub struct CreateShareholder<'info> {
    #[account(mut, seeds = [b"state"], bump = state.bump)]
    pub state: Account<'info, State>,
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
    pub fn handle(&mut self, bump: u8, name: String, amount: u64) -> Result<()> {
        require!(!self.state.paused, Errors::SystemIsPaused);
        require_eq!(self.issuer.authority, self.signer.key());

        let clock = Clock::get()?;
        let timestamp = clock.unix_timestamp;

        *self.shareholder = Shareholder {
            owner: self.owner.key(),
            issuer: self.issuer.key(),
            timestamp,
            name,
            amount,
            first : self.issuer.emitted,
            locked: false,
            bump
        };

        self.issuer.emitted += amount;

        Ok(())
    }
}
