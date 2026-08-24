# Mempool and MEV

## Purpose
Account for adversarial transaction ordering, visibility, and extraction.

## Scope
Public mempools, auctions, swaps, liquidations, claims, commits, and ordering-sensitive operations.

## MUST
- Identify operations whose outcome changes under front-running, back-running, sandwiching, or reordering.
- Enforce user-defined slippage, deadlines, minimum outputs, or equivalent bounded-execution constraints where applicable.
- Protect secrets or strategic values that must not be revealed before commitment.
- Analyze whether privileged actors can reorder or censor transactions for advantage.
- Test adverse ordering for economically sensitive flows.

## MUST NOT
- Assume transaction ordering is fair or first-come-first-served.
- Expose unbounded price or execution tolerance by default.
- Use public transaction submission for sensitive reveals without assessing extraction risk.

## SHOULD
- Use commit-reveal, batch auctions, private submission, or other mitigations when justified.

## Exceptions
Accepted MEV exposure requires quantified impact and explicit product/risk acceptance.

## Verification
Run ordering simulations, inspect slippage/deadline controls, review mempool assumptions, and evaluate adversarial economic scenarios.