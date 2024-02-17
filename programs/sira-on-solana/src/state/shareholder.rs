use anchor_lang::prelude::*;

#[account]
pub struct Shareholder {
    pub owner: Pubkey,
    pub issuer: Pubkey,
    pub amount: u64,
}
