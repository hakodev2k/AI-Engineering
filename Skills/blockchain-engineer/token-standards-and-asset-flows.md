# Token Standards and Asset Flows

## Purpose
Design and integrate fungible, non-fungible, and multi-token assets without assuming idealized token behavior.

## When to use
Use when issuing tokens, accepting third-party assets, building vaults/marketplaces, or reviewing transfer/approval logic.

## Inputs
Asset requirements, token standards, custody model, fee model, chain, integration contracts.

## Preconditions
Asset ownership and authorization semantics are defined.

## Context to inspect
ERC-20/721/1155 behavior, hooks, approvals, decimals, permit support, fee-on-transfer behavior, rebasing, paused/blacklisted tokens, and receiver contracts.

## Core knowledge
Standards define interfaces but real tokens vary. Integrations must handle missing return values, transfer fees, callbacks, decimal differences, approval races, and malicious receiver behavior.

## Procedure
1. Define asset invariants and accounting units.
2. Identify supported token classes and explicitly unsupported behaviors.
3. Normalize amounts without losing precision.
4. Treat transfer success as observed balance/state change when required.
5. Minimize approval scope and duration.
6. Guard callback-capable transfers against reentrancy.
7. Validate NFT receiver and ownership semantics.
8. Test fee-on-transfer and non-standard ERC-20 cases where supported.
9. Define stuck-asset recovery controls.
10. Verify event/accounting consistency.

## Decision points
Whitelist tokens when arbitrary token behavior would create unacceptable risk. Support permits only when signature/domain handling is correct for the target assets.

## Common failure patterns
Assuming 18 decimals, trusting boolean return behavior, unlimited approvals, incorrect before/after balance accounting, and mixing token units with fiat/display units.

## Verification
Run integration tests against representative standard and adversarial token mocks; reconcile internal accounting against actual balances.

## Expected output
Documented supported asset behaviors, safe transfer/approval implementation, and verified accounting invariants.

## Stop conditions
Stop when a token’s behavior cannot be characterized sufficiently to protect user assets.