use anchor_lang::prelude::*;

#[error_code]
pub enum InvalidSeeds {
    #[msg("Account is not derived from the provided seeds")]
    DataTooLarge,
}
