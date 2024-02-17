use anchor_lang::prelude::*;

#[account]
pub struct State {
    pub bump: u8,
    pub authority: Pubkey,
    pub paused: bool,
}
