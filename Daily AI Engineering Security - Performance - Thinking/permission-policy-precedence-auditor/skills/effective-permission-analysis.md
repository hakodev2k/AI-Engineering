# Skill: Effective Permission Analysis

## Purpose
Determine the effective tool permission from multiple policy layers before execution.

## Trigger
Use before unattended tool execution, after any permission denial, or when configured allow rules and runtime behavior disagree.

## Inputs
Tool identity and arguments; operation risk; static allow/deny rules; classifier decision; hook decision; user approval; server-side requirements; inherited parent/subagent policy.

## Preconditions
All known policy sources are represented explicitly. Unknown layers are recorded as unknown rather than assumed permissive.

## Required context
Trust boundaries, whether the operation is read-only or mutating, target environment, irreversible effects, and whether approval is fresh and scoped to this exact action.

## Allowed tools
Read-only configuration inspection, policy logs, deterministic policy evaluator, documentation lookup.

## Constraints
MUST NOT disable classifiers, sandboxing, deny rules, or approvals merely to make a call succeed. MUST NOT treat conversational text as durable authorization when an out-of-band permission mechanism exists.

## Procedure
1. Normalize each policy source into `{layer, decision, scope, reason, authoritative, observed_at}`.
2. Apply deny-first safety for explicit hard denies.
3. Evaluate classifier and server constraints separately from user allowlists.
4. Record conflicts whenever one layer allows and another blocks the same scoped action.
5. Compute the winning layer using configured precedence rather than guessed semantics.
6. Classify denial as deterministic, transient, or unknown.
7. For deterministic denial, block autonomous retries and surface exact remediation.
8. For unknown precedence, require human review before any risky mutation.

## Decision points
- Explicit hard deny: block.
- Classifier unavailable: do not convert to allow; use bounded retry only when evidence says the failure is transient.
- User allow conflicts with classifier: report conflict; do not silently weaken classifier.
- Read-only false positive: prefer scoped human approval or policy fix, not global bypass.

## Expected output
Effective decision, winning layer, conflict set, retryability, required approval/remediation, and audit evidence.

## Metrics
100% of evaluated calls have decision provenance; deterministic denials are retried at most once; global bypass count does not increase; conflicts are measurable by layer pair.

## Verification
Replay known allow/deny conflict fixtures and confirm the same effective decision is produced deterministically.

## Failure handling
If a policy layer cannot be inspected, mark the result `indeterminate` and fail closed for risky writes. For safe reads, require explicit operator choice rather than silently escalating privileges.

## Stop conditions
Stop when an authoritative deny exists, precedence is indeterminate for a risky action, or required human approval is missing.