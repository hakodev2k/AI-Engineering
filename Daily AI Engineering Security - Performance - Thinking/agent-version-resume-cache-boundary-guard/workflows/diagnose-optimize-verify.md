# Workflow — Diagnose, Optimize, Verify

## Trigger
Resume-cache regression or planned runtime update affecting resumable sessions.

## Goal
Reduce avoidable cold resumes without sacrificing required context.

## Baseline
Capture the last warm turn plus one representative resume: cache read/create tokens and latency.

## Stages
1. **Observe** — collect manifests and usage.
2. **Measure** — establish baseline and pause-vs-TTL evidence.
3. **Diagnose** — run `cache_boundary.py`; identify one primary changed component.
4. **Hypothesize** — state expected cache effect and correctness risk.
5. **Implement** — stabilize only the relevant cache-key component or make version transition explicit.
6. **Measure again** — repeat same resume scenario.
7. **Verify** — independent verifier checks cache metrics and required context hashes.

## Checkpoints
No implementation before baseline; no completion before independent verification.

## Retry policy
Maximum two diagnosis/implementation iterations. Each retry MUST change the hypothesis or evidence.

## Failure path
If cache remains cold with identical fingerprints, stop changing context and escalate to provider/runtime investigation.

## Definition of Done
Implemented change recorded; before/after measured; target cache rewrite reduced or explicitly classified unavoidable; tests pass; no required context removed; verifier marks Verified.