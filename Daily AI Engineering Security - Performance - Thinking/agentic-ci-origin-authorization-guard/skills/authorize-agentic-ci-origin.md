# Skill: Authorize Agentic CI Origin

## Purpose
Decide whether a privileged AI/CI action is authorized by the initiating principal rather than merely by a trusted relay bot.

## Trigger
Before any secret-bearing or write-capable workflow stage reachable from agent-generated output.

## Inputs
Event JSON, repository identity, policy JSON, optional human approval record.

## Preconditions
Raw event metadata is available and has not been rewritten by the model.

## Required context
Trust levels for GitHub associations, capability classification, expected repository/ref, relay identity.

## Allowed tools
Read-only event inspection, policy parser, deterministic authorization script, audit logging.

## Constraints
Do not infer authorization from natural-language intent. Do not execute privileged actions during analysis.

## Procedure
1. Identify the source event and initiating actor.
2. Trace every relay hop to the current workflow actor.
3. Classify requested capability as privileged or non-privileged.
4. Normalize actor association and repository/ref.
5. Verify origin against policy; do not substitute relay trust.
6. If origin fails policy, look for a separate explicit approval bound to the same capability and evidence hash.
7. Emit allow, deny, or require-approval with evidence.
8. Record the decision before secrets/privileged tokens are exposed.

## Decision points
Allow only if origin is trusted under policy or a valid bound human approval exists. Otherwise deny or require approval.

## Expected output
Structured decision with origin, relay, capability, evidence hash, reason, and verification status.

## Metrics
Provenance completeness, blocked untrusted relays, approval frequency, policy false positives.

## Verification
Replay malicious fixtures where an untrusted issue causes a trusted bot command. The result must remain denied without human approval.

## Failure handling
Parser/policy errors are blocking failures. Preserve the event payload hash and escalate for human review.

## Stop conditions
Stop after one deterministic decision. No autonomous retry is permitted for authorization failures.
