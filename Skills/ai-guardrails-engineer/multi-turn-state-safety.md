# Multi-Turn State Safety

## Purpose
Prevent bypass and authority accumulation across history, summaries, plans, state.

## When to use
Use for conversational/stateful/autonomous workflows.

## Inputs
State model, policies, permissions, retention, attacks.

## Context to inspect
Inspect truncation, summaries, memory, plans, identity/policy changes, state reuse.

## Core knowledge
Safe turns can compose unsafely; summaries can preserve malicious instructions. Revalidate at action time.

## Procedure
1. Identify action-influencing state.
2. Label provenance/trust.
3. Prevent instruction laundering through summaries.
4. Revalidate identity/authorization/policy.
5. Expire approvals/capabilities.
6. Scope state.
7. Test split-intent.
8. Test truncation/substitution.
9. Quarantine suspicious state.
10. Audit transitions.

## Decision points
Persist facts more readily than instructions; type privileged state provenance.

## Common failure patterns
Trusted summaries, stale approvals, cross-task contamination, latest-turn-only policy, tenantless keys.

## Verification
Multi-turn attacks remain blocked.

## Expected output
State safety design and tests.

## Stop conditions
Escalate silent privilege accumulation.