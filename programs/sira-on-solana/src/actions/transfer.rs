use anchor_lang::prelude::*;

use crate::errors::Errors;
use crate::{Shareholder, State};

#[derive(Accounts)]
pub struct Transfer<'info> {
    #[account(mut, seeds = [b"state"], bump = state.bump)]
    pub state: Account<'info, State>,
    #[account(mut, 
        seeds = [b"holding", issuer.to_account_info().key.as_ref(), signer.key.as_ref()],
        bump = source.bump
    )]
    pub source: Account<'info, Shareholder>,
    #[account(mut, 
        seeds = [b"holding", issuer.to_account_info().key.as_ref(), owner.key.as_ref()],
        bump = destination.bump
    )]
    pub destination: Account<'info, Shareholder>,
    /// CHECK: The owner of the action can be any account
    pub owner: AccountInfo<'info>,
    /// CHECK: No need to deserialize it, and will be checked as seed anyway
    pub issuer: AccountInfo<'info>,
    #[account(mut)]
    pub signer: Signer<'info>,
}

impl<'info> Transfer<'info> {
    pub fn handle(&mut self, amount: u64) -> Result<()> {
        require!(!self.state.paused, Errors::SystemIsPaused);
        require!(!self.source.locked, Errors::SourceIsLocked);
        require!(!self.destination.locked, Errors::DestinationIsLocked);
        require_eq!(self.source.issuer, self.destination.issuer, Errors::DifferentIssuer);
        require!(self.source.amount >= amount, Errors::NotEnoughShares);

        self.source.amount -= amount;
        self.destination.amount += amount;

        Ok(())
    }
}
