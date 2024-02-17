mod actions;
mod errors;
mod state;

pub use actions::*;
pub use state::*;

use anchor_lang::prelude::*;

declare_id!("4kKhxNRFxnxXeYn1kfjkkzWpUW91rcuERgaV8qobhk3M");

#[program]
pub mod sira_on_solana {
    use super::*;

    pub fn init(ctx: Context<Init>, bump: u8) -> Result<()> {
        ctx.accounts.handle(bump)
    }

    pub fn pause(ctx: Context<Pause>) -> Result<()> {
        ctx.accounts.pause()
    }

    pub fn unpause(ctx: Context<Pause>) -> Result<()> {
        ctx.accounts.unpause()
    }

    pub fn create_issuer(ctx: Context<CreateIssuer>, name: String, krs: String) -> Result<()> {
        ctx.accounts.handle(name, krs)
    }

    pub fn create_shareholder(
        ctx: Context<CreateShareholder>,
        bump: u8,
        amount: u64,
    ) -> Result<()> {
        ctx.accounts.handle(bump, amount)
    }

    pub fn lock(ctx: Context<Lock>) -> Result<()> {
        ctx.accounts.lock()
    }

    pub fn unlock(ctx: Context<Lock>) -> Result<()> {
        ctx.accounts.unlock()
    }
}
