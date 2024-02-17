use anchor_lang::prelude::*;

#[account]
pub struct Issuer {
    pub name: String,
    pub krs: String,
    pub authority: Pubkey,
    pub timestamp: i64,
    pub using_isin: bool,
    pub emitted: u64,
    pub value: f64,
}
