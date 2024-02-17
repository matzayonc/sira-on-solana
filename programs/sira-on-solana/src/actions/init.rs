use std::mem::size_of;

use anchor_lang::prelude::*;

use crate::State;

#[derive(Accounts)]
#[instruction(bump: u8)]
pub struct Init<'info> {
    #[account(init, 
        payer = signer,
        space = 8 + size_of::<State>(), 
        seeds = [b"state", signer.to_account_info().key.as_ref()], bump
    )]
    pub state: Account<'info, State>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}


 impl<'info> Init<'info> {
    pub fn handle(&mut self, bump: u8 ) -> Result<()> {
        *self.state = State {
            bump,
            authority: self.signer.key(),
            paused: false,
        };

        Ok(())
    } 
}