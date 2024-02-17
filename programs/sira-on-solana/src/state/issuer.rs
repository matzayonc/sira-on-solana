use anchor_lang::prelude::*;

#[account]
pub struct Issuer {
    pub name: String,
    pub krs: String,
    pub authority: Pubkey,
    pub value: f64,
}
