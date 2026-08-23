# Skill: Review a Policy Exception

## Purpose

Safely add or narrow a policy rule when a legitimate recurring tool operation is blocked.

## Inputs

- Representative blocked request and decision.
- Business/engineering reason the operation is needed.
- Expected tool, operation, and argument boundaries.
- Risk and rollback information.

## Preconditions

The request is legitimate and cannot be represented by an existing safer tool operation. A policy owner is available to review the change.

## Process

1. Confirm the block is caused by policy, not a malformed request or missing approval.
2. Prefer changing the caller to a narrower tool/operation over widening policy.
3. Identify the smallest match pattern that covers the legitimate cases.
4. Keep irreversible/high-risk patterns denied; an `allow` rule must not outrank a required hard deny.
5. Choose `approval` instead of `allow` when the action mutates production, Git history, infrastructure, secrets, schemas, dependencies, or data.
6. Add the proposed rule with a unique ID, explicit priority, effect, reason, and narrow match.
7. Add tests for one expected match and at least one nearby non-match or dangerous case.
8. Run `python scripts/verify_package.py`.
9. Inspect the diff for unintended policy widening.
10. Obtain policy-owner approval before merging a weakening change.

## Expected output

A reviewed policy/test diff with evidence showing the intended operation works and protected operations remain blocked.

## Verification

All package tests pass and representative denied/approval-required cases retain their expected decisions.

## Failure handling

If the desired rule cannot be expressed narrowly, keep the operation blocked and use a manually controlled tool path instead.

## Stop conditions

Stop when verification fails, a rule would override a hard deny, the rationale is missing, or required policy-owner approval is unavailable.