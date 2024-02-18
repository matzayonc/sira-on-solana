use anchor_lang::prelude::*;

#[error_code]
pub enum Errors {
    #[msg("Account is not derived from the provided seeds")]
    DataTooLarge,
    #[msg("Not enough shares to transfer")]
    NotEnoughShares,
    #[msg("System is currently paused")]
    SystemIsPaused,
    #[msg("Source account was locked by issuer")]
    SourceIsLocked,
    #[msg("Destination account was locked by issuer")]
    DestinationIsLocked,
    #[msg("The destination account is not owned by the same issuer")]
    DifferentIssuer,
}
