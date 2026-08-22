# Skill: Design an Idempotent Tool Call

## Purpose
Convert a side-effecting agent action into a stable intent that can be safely claimed, retried, resumed, and verified without duplicate effects.

## When to use
Before automating create/send/update/deploy/charge/commit or other externally visible mutations.

## Inputs
Operation name, target system, stable business identity, non-secret arguments, provider idempotency capability, verification/read capability, and risk classification.

## Preconditions
The intended effect is understood; read-only discovery has identified the target; secrets are represented only by references.

## Allowed tools
Repository search, provider documentation, read APIs, schema validators, and the package scripts. Mutation tools are forbidden during design.

## Process
1. Define the business effect in one sentence.
2. Identify a stable business identity independent of attempt number or timestamp.
3. Remove volatile fields from identity unless they materially change the intended effect.
4. Canonicalize arguments using sorted JSON keys and stable scalar representation.
5. Create an idempotency key from operation plus stable business identity; never generate a fresh random key for a retry.
6. Compute a SHA-256 fingerprint of operation, target, and canonical arguments.
7. Determine whether the provider supports native idempotency keys and pass the same key when it does.
8. Define a reconciliation query that can prove whether the effect exists without mutating state.
9. Classify possible failures as definite retryable, definite non-retryable, or ambiguous.
10. Set maximum execution retries to two or fewer.
11. Identify approval-required conditions before execution.
12. Validate the intent against `schemas/tool-intent.schema.json` and claim it with `scripts/idempotency_gate.py`.

## Expected output
A validated tool-intent JSON document with stable key, fingerprintable arguments, retry policy, reconciliation method, and approval flag.

## Verification
Create the intent twice and confirm both produce the same fingerprint. Change a material argument and confirm the fingerprint changes.

## Failure handling
If no reliable stable identity or reconciliation path exists, classify the operation high risk and require human approval; do not enable automatic retry.

## Stop conditions
Stop if secrets would enter the ledger, the operation is destructive without approval, identity cannot be stabilized, or provider behavior cannot distinguish safe retry from duplicate execution.
