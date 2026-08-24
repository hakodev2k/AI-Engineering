# Token Accounting

## Purpose
Preserve asset conservation and correct accounting across token interactions.

## Scope
Balances, shares, fees, transfers, mint/burn logic, rebasing assets, fee-on-transfer tokens, and tokenized vaults.

## MUST
- Define conservation and solvency invariants for every asset pool.
- Derive accounting from observed balance changes when token behavior can differ from requested transfer amounts.
- Specify rounding direction and who benefits from rounding at every conversion boundary.
- Test zero, minimum, maximum, repeated, and adversarial deposit/withdrawal sequences.
- Reconcile internal accounting with externally held assets.

## MUST NOT
- Assume all tokens return standard values or transfer exact requested amounts unless explicitly constrained.
- Permit unchecked minting, burning, or fee extraction.
- Hide insolvency through cached or stale accounting.

## SHOULD
- Keep units and share/asset conversions explicit.

## Exceptions
Supporting nonstandard assets requires documented compatibility constraints and dedicated tests.

## Verification
Run invariant/fuzz tests, reconcile balances, inspect rounding paths, and test representative nonstandard token behaviors.