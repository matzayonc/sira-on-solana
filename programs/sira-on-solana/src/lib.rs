use anchor_lang::prelude::*;

declare_id!("4kKhxNRFxnxXeYn1kfjkkzWpUW91rcuERgaV8qobhk3M");

#[program]
pub mod sira_on_solana {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

