# Skill: Design Idempotent Operation

## Purpose
Turn a potentially duplicating agent/tool mutation into a replay-safe operation contract.

## When to use
Before email/send/publish/create/update/charge/enqueue/provision actions, scheduled/resumable agents, or any workflow with retries.

## Inputs
Action name, target identity, payload, provider/tool contract, retry/resume behavior, risk level.

## Preconditions
The mutation and intended business effect are known. Read-only actions do not need this skill unless they trigger hidden writes.

## Allowed tools
Repository inspection, provider documentation, dry-run/sandbox, hashing/validation scripts, read-only provider lookup.

## Constraints
Do not execute the mutation while designing the contract. Do not include secrets in fingerprints or ledger evidence.

## Procedure
1. State the business effect in one sentence.
2. Identify the stable business identity of the target.
3. Canonicalize payload fields that define intent; remove volatile transport metadata only when it does not change intent.
4. Define `operation_key = <namespace>:<action>:<business-identity>:<intent-version>` or an equivalent stable key.
5. Compute payload fingerprint with `scripts/fingerprint_operation.py`.
6. Determine provider-native idempotency support and its retention window.
7. Define success verification: provider resource ID, queryable state, receipt, or equivalent evidence.
8. Define ambiguous-outcome lookup before any retry.
9. Define compensation only if the original outcome cannot be safely resolved.
10. Produce an operation manifest conforming to `schemas/operation-manifest.schema.json`.

## Expected output
A manifest with stable operation key, fingerprint inputs, risk, provider idempotency settings, verification strategy, retry policy, and compensation boundary.

## Verification
Run `python scripts/validate_operation_manifest.py --manifest <file> --policy config/replay-policy.json`.

## Failure handling
If stable identity cannot be defined, mark operation `blocked`. If provider state cannot be queried after ambiguous dispatch, require human review for high-risk actions.

## Stop conditions
Stop before execution when manifest validation fails, key/fingerprint conflicts, required approval is absent, or ambiguous prior outcome exists.
