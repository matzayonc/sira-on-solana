use anchor_lang::prelude::*;

#[account]
pub struct Shareholder {
    pub owner: Pubkey,
    pub issuer: Pubkey,
    pub first: u64,
    pub amount: u64,
    pub locked: bool,
    pub bump: u8,
}
