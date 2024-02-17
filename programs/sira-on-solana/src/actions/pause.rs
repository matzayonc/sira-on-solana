use anchor_lang::prelude::*;

use crate::state::State;

#[derive(Accounts)]
pub struct Pause<'info> {
    #[account(mut, seeds = [b"state"], bump = state.bump)]
    pub state: Account<'info, State>,
    #[account(mut)]
    pub signer: Signer<'info>,
}

impl<'info> Pause<'info> {
    pub fn pause(self: &mut Self) -> Result<()> {
        require_eq!(self.state.authority, self.signer.key());

        self.state.paused = true;

        Ok(())
    }

    pub fn unpause(self: &mut Self) -> Result<()> {
        require_eq!(self.state.authority, self.signer.key());

        self.state.paused = false;

        Ok(())
    }
}
