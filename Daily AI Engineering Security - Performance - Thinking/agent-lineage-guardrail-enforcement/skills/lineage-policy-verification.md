# Skill: Lineage Policy Verification

## Purpose
Prove that every agent descendant executes under the intended security policy and that high-risk tool calls can be attributed to a stable actor identity.

## Trigger
Before spawning a subagent/teammate, after child startup, and before any high-risk tool call from a descendant.

## Inputs
Parent actor ID, child actor ID, policy document/hash, launch metadata, hook event metadata, audit events.

## Preconditions
The orchestrator can observe child creation and high-risk tool events.

## Allowed tools
Read-only configuration inspection, SHA-256 hashing, hook/audit log inspection, safe probe tool calls.

## Constraints
MUST NOT infer identity from free-form prompts. MUST NOT lower permissions because verification is inconvenient. MUST NOT allow a missing identity on high-risk actions.

## Procedure
1. Canonicalize the effective policy and compute SHA-256.
2. Bind the child to `actor_id`, `parent_actor_id`, `root_actor_id`, and `policy_hash`.
3. Run a non-destructive coverage probe through the same hook path used for protected tools.
4. Confirm the resulting event contains attributable lineage metadata or a trusted wrapper-supplied mapping.
5. Compare child policy hash with the required root policy hash.
6. Record PASS/BLOCK and evidence.
7. For every high-risk call, verify actor identity and policy hash before execution.

## Decision points
- Missing identity on low-risk read-only call: observe and flag according to policy.
- Missing identity on write/shell/network/credential-sensitive call: BLOCK.
- Policy hash mismatch: BLOCK and terminate/relaunch child under correct policy.

## Expected output
Structured verification record with lineage, policy hash, coverage result, risks, and status.

## Metrics
Descendant hook coverage %, unattributed call count, policy-hash mismatch count, blocked unsafe calls, false-positive rate.

## Verification
Independent verifier recomputes policy hash and checks audit coverage for all descendants.

## Failure handling
One relaunch is allowed after a propagation failure. A second failure stops delegation and escalates.

## Stop conditions
Any untrusted policy mutation, unresolved high-risk unattributed call, or two failed propagation attempts.