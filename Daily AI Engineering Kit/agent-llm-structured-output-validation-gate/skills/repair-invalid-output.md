# Repair Invalid Output

## Purpose
Repair validation failures without changing the contract or fabricating missing facts.

## Inputs
Invalid output, validator stderr, schema, original evidence.

## Process
1. Classify failure as syntax, schema, semantic evidence, or environment/tool failure.
2. For syntax/schema failures, modify only fields required by the existing contract.
3. For missing evidence, return to repository/log/test evidence collection; never synthesize a citation.
4. For contradictory evidence, change status to `inconclusive` or `failed` rather than forcing `verified`.
5. Re-run the deterministic gate.
6. Permit at most two total repair attempts per workflow run.

## Verification
The repaired artifact must pass the same unchanged schema and semantic checks.

## Stop conditions
Stop when valid, after two failed repairs, or when a requested repair would weaken validation/security or require an approval-gated change.
