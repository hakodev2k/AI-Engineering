# Skill — Provenance Claim Classification

## Purpose
Classify externally grounded claims by observable provenance state and prevent completion-state wording when no successful evidence exists.

## Trigger
Before finalizing a response that says or implies the assistant found, opened, read, saw, inspected, retrieved, checked, monitored, or verified an external/private/live source.

## Inputs
Proposed response or structured claims, evidence ledger, source identity, tool/retrieval outcomes, user-provided content markers.

## Preconditions
Evidence records MUST distinguish attempted from successful actions. Source identity SHOULD include a stable ID when available.

## Required context
Only observable action/result metadata is required. Hidden chain-of-thought is neither required nor permitted.

## Allowed tools
Tool/retrieval result metadata, typed evidence ledger, deterministic claim checker, source IDs and timestamps.

## Constraints
- A tool invocation without a successful result is not observation evidence.
- Evidence for source A MUST NOT authorize a completion claim about source B.
- User-provided text MUST be labeled as user-provided/current context, not retrieved.
- Inference MUST be distinguishable from observation.

## Procedure
1. Split material external-access statements into claim units.
2. Classify each as `observation-complete`, `action-attempt`, `inference`, `user-provided`, or `capability`.
3. For every `observation-complete` claim, find a successful evidence record with matching source identity and action class.
4. If matched, attach the evidence ID internally and allow the claim.
5. If no match exists, choose the narrowest truthful state: attempt, inference, user-provided, unavailable, or unsupported.
6. Rewrite the claim before output; do not merely append a disclaimer to an unsupported completion statement.
7. For high-impact tasks, hand off material claims to the Provenance Verifier.

## Decision points
- Successful matching evidence: allow.
- Pending/failed tool action: rewrite as attempt/failure.
- Information only from current user message: rewrite as user-provided.
- Derived from other evidence: mark as inference and retain supporting evidence IDs.
- No evidence or basis: block unsupported claim.

## Expected output
A list of claim classifications and gate decisions, or a corrected response whose completion-state claims all have evidence.

## Metrics
Unsupported claim rate, false block rate, identity mismatch rate, verifier rejection rate, correction rate.

## Verification
Run deterministic tests for missing evidence, wrong source ID, failed tool result, valid success, inference, and user-provided content.

## Failure handling
If the evidence ledger is unavailable or ambiguous, fail closed for completion-state access claims and use accurate limitation language.

## Stop conditions
One classification pass plus one correction pass. If ambiguity remains after correction, report the source as unverified rather than looping.
