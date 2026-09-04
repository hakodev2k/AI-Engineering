# Skill: Independent Verification

## Purpose
Prove that contamination was removed without weakening tests or hiding evidence.

## Inputs
Git diff, scanner JSON, test/build output, provenance decisions, and evidence JSON.

## Procedure
1. Confirm the verifier did not author the final remediation when an independent agent is available.
2. Re-run config validation and deterministic scan.
3. Inspect every changed fixture and its consuming tests.
4. Verify replacements are synthetic and preserve only required shape.
5. Search the diff/repository for original sensitive fragments when safe to do locally.
6. Confirm no allowlist/config weakening was introduced to bypass findings.
7. Confirm focused tests pass; run broader repository checks required by project policy.
8. Validate evidence with `scripts/verify-evidence.py`.
9. Set `verification_status` to `verified`, `failed`, or `blocked` with concrete evidence.

## Completion criteria
`verified` requires zero unresolved blocking findings, resolved provenance, passing applicable tests, valid evidence, and no pending approval-required action.

## Failure handling
Return to Implementation Agent only for retryable code/test/scanner failures. Maximum total implementation retries is two. Otherwise stop with preserved evidence.