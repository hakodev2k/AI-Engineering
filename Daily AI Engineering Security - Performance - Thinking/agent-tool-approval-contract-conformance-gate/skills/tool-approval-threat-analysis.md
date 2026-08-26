# Skill: Tool Approval Threat Analysis

## Purpose
Determine whether an agent's effective tool registry preserves the operator's authorization and sandbox boundaries.

## Trigger
New/changed tool, framework upgrade, policy change, prompt-injection report, or registration failure.

## Inputs
Tool manifest, global approval policy, sandbox declarations, tool implementation metadata.

## Preconditions
The runtime's intended approval policy is known and high-risk actions can be classified.

## Required context
Only observable tool behavior, manifest metadata, policy, and test evidence; hidden chain-of-thought is not required.

## Allowed tools
Read-only source/config inspection, deterministic gate, unit/security tests.

## Constraints
MUST NOT execute untrusted generated code during analysis. MUST NOT weaken global approval policy to resolve a mismatch. MUST NOT treat prompt filtering as a replacement for authorization.

## Procedure
1. Inventory registered tools and their effective approval labels.
2. Classify consequence: read-only, code execution, shell, network write, credential access, host write, or product-specific equivalent.
3. Establish the baseline declared global policy.
4. Run `scripts/tool_approval_gate.py`.
5. For each violation, trace which layer supplied the permissive value.
6. Verify sandbox configuration independently for required categories.
7. Correct precedence/classification at the smallest authoritative layer.
8. Re-run attack and benign fixtures.
9. Obtain independent security review.

## Decision points
Unknown high-risk approval semantics block registration. High-risk tools with weak local approval block. Required sandbox absent blocks. Read-only auto-approved tools may pass if policy permits.

## Expected output
Facts, Evidence, Effective policy, Violations, Decision, Verification status.

## Metrics
High-risk approval coverage, sandbox coverage, drift count, attack-fixture block rate.

## Verification
Reviewer inspects the effective registry, not only source defaults.

## Failure handling
Fail closed; disable the affected tool if classification cannot be resolved. Maximum 2 diagnosis revisions.

## Stop conditions
Stop on reproducible pass, exhausted retries, or unresolved high-risk ambiguity.
