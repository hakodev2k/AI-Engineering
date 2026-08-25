# Skill — Approval Context Audit

## Purpose
Determine whether a human or policy approval is bound to the exact tool action that will execute.

## Trigger
Sensitive shell, filesystem-write, MCP mutation, deployment, credential, network-write, or production-impacting calls before approval and immediately before execution.

## Inputs
Source tool-call ID/name, executable arguments, argument parse status (`ok`, `absent`, `defaulted`, `error`), reviewer-visible arguments, risk classification, and optional approval action hash.

## Preconditions
The executable payload exists before any side effect. The audit runs outside model reasoning and never requests hidden chain-of-thought.

## Required context
Only the action envelope, risk metadata, and approval decision.

## Allowed tools
Deterministic JSON parsing, canonicalization, SHA-256 hashing, policy lookup, structured logging.

## Constraints
- MUST NOT execute the tool.
- MUST NOT reconstruct missing sensitive arguments from prose.
- MUST fail closed when sensitive input is missing, defaulted, or parse-failed.
- MUST compare canonical payloads, not display formatting.
- SHOULD log hashes rather than plaintext secrets.

## Procedure
1. Validate tool-call identity and envelope shape.
2. Determine whether the action is sensitive.
3. Inspect argument parse status.
4. Canonicalize source arguments as sorted-key compact JSON.
5. Canonicalize reviewer-visible arguments identically.
6. Compare SHA-256 hashes.
7. If an approval binding hash exists, compare it to the source hash.
8. Emit verdict and reason codes.
9. Re-run immediately before execution.

## Decision points
- Sensitive + source missing/defaulted/error: block.
- Sensitive + display input missing: block.
- Source/display mismatch: block.
- Approval binding mismatch: block.
- Low-risk read-only calls may warn instead of block only under explicit host policy.

## Expected output
JSON containing `verdict`, `reasons`, `actionSha256`, `displaySha256`, `toolCallId`, and `toolName`.

## Metrics
Missing disclosure, parse substitution, payload mismatch, approval-hash mismatch, and block counts.

## Verification
Run `python -m unittest tests/test_approval_context_guard.py`.

## Failure handling
Malformed envelopes exit 1. Security blocks exit 2. A transport envelope may be rebuilt once; mismatches are not automatically retried.

## Stop conditions
Stop after one pass or one security block. Maximum envelope rebuild retries: 1.
