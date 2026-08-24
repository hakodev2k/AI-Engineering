# Skill — Auxiliary Occupancy Diagnosis
## Purpose
Find whether nested inference usage contaminates parent context occupancy.
## Trigger
Context meter spikes/drops after advisor/helper/subagent calls, premature compaction or provider overflow.
## Inputs
Before/after request traces, parent transcript delta, provider usage and runtime code path.
## Preconditions
Capture a baseline run without auxiliary inference.
## Allowed tools
Read-only traces, deterministic checker, token metrics and source inspection.
## Procedure
1. Record parent occupancy immediately before auxiliary call.
2. Record child request/usage separately.
3. Record parent transcript delta and next parent occupancy.
4. Run checker.
5. Test hypotheses: rolled-up iterations, cache-token double count, local underestimate, stale meter.
6. Change one accounting source; replay identical workload.
7. Stop after two failed attempts and restore baseline.
## Expected output
Facts, evidence, hypotheses tested, decision, before/after metrics and verification status.
## Metrics
Occupancy drift, compactions/task, overflow errors, tokens and latency.
## Verification
Independent benchmark verifier repeats trace replay.
## Failure handling
Rollback and escalate ambiguous provider semantics.
## Stop conditions
Invariant verified or two failed iterations.