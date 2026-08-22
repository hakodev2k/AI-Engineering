# Workflow — Claim, Evidence, Verify

## Trigger
A response is about to assert that an external/private/live source was found, opened, read, seen, inspected, retrieved, monitored, checked, or verified.

## Goal
Ensure completion-state access claims are backed by source-matched successful evidence.

## Inputs
Draft response or structured claims, evidence ledger, source IDs, action statuses, current-context markers.

## Baseline
Measure unsupported completion claims on a representative evaluation set before enabling the gate. Record false positives and false negatives.

## Stages
1. **Observe** — identify externally grounded claim units.
2. **Classify** — mark each as observation-complete, action-attempt, inference, user-provided, capability, or unrelated.
3. **Match evidence** — require a successful evidence record with matching source/action for observation-complete claims.
4. **Correct** — if absent, rewrite to attempted, inferred, user-provided, unavailable, or unsupported.
5. **Retry retrieval once** — only when the user asked for actual retrieval and a valid retrieval path exists.
6. **Reclassify** — evaluate corrected claims against updated evidence.
7. **Independent verify** — Provenance Verifier reviews material claims for high-impact workflows.

## Responsible agent
Response agent performs stages 1–6. Provenance Verifier owns stage 7 when required.

## Tools
Evidence ledger, source metadata, retrieval/tool results, `scripts/provenance_gate.py`.

## Outputs
Corrected response, claim/evidence decisions, optional verifier verdict.

## Checkpoints
- Tool attempts and successes are distinct.
- Source identity is matched exactly or by an approved stable alias.
- User-provided content is not mislabeled as retrieval.
- Inference is not presented as direct observation.

## Metrics
Unsupported claims/1,000 gated claims, false-block rate, identity mismatch rate, correction rate, verifier rejection rate.

## Retry policy
At most one retrieval retry for the same source/action unless materially new information changes the retrieval strategy.

## Stop conditions
If evidence remains missing after the bounded retry, stop and use limitation/unverified language. Never loop until a desired provenance state appears.

## Failure path
Fail closed for observation-complete wording; preserve useful information by labeling it as inference or user-provided when justified.

## Verification
Deterministic gate tests MUST cover success, failed attempt, missing evidence, wrong source, user-provided context, and inference.

## Definition of Done
All material completion-state source claims have matching successful evidence; corrections are applied; retries are bounded; verifier passes when required; no hidden reasoning is requested.
