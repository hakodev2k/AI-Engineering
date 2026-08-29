# Skill: No-Progress Diagnosis

## Purpose
Determine whether an agent run is making measurable progress before changing prompts, models, tools, or orchestration.

## Trigger
Use when tool/model-call count, latency, token consumption, recursion-limit errors, repeated failures, or duplicate side effects exceed the expected baseline.

## Inputs
A timestamped trace containing tool name, canonicalizable arguments, result/error, model step, optional application-state fingerprint, latency, tokens, and completion outcome.

## Preconditions
- The trace covers at least one successful control run and one suspected failing run when available.
- Side-effecting tools are identified.
- Secrets are redacted before traces are shared.

## Required context
Framework/runtime version, model, tool registry, retry policy, hard limits, and expected completion condition.

## Allowed tools
Trace viewers, deterministic scripts, log queries, benchmark runners, diff tools, and read-only repository inspection.

## Constraints
- MUST measure before changing behavior.
- MUST NOT infer a model loop when evidence shows runtime replay.
- MUST NOT automatically re-execute a side-effecting call to reproduce a failure in production.
- SHOULD reproduce in an isolated fixture when possible.

## Procedure
1. Capture baseline: calls/task, tokens/task, latency, success rate, and expected state transitions.
2. Canonicalize each `(tool, args, outcome)` and compute fingerprints independent of call IDs or timestamps.
3. Classify repetition: exact streak, short cycle, repeated error class, stagnant application state, runtime replay, or productive repeated calls.
4. Check whether the model actually emitted each repeated call. If not, investigate runtime replay/message reentry before prompt changes.
5. Form one explicit hypothesis linking a repetition signature to a root cause.
6. Test the hypothesis on a minimal fixture.
7. Choose the least invasive control: fix root cause first; add progress guard as a backstop/detection layer.
8. Measure guarded vs baseline workload with identical task set and limits.

## Decision points
- If state changes meaningfully between repeated calls, do not classify as no-progress solely by call count.
- If a side-effecting tool repeats, block automatic retry until idempotency/state evidence is available.
- If the loop occurs below the model layer, prioritize runtime repair over prompt tuning.

## Expected output
A diagnosis record with Facts, Evidence, Hypothesis, Root cause status, Loop signature, Risk, Proposed control, and Verification plan.

## Metrics
Detection lead time before hard limit, duplicate-call count avoided, tokens avoided, latency avoided, false-positive stop rate, task-success delta.

## Verification
A separate verifier must confirm that the claimed signature appears in raw traces and that successful long-run fixtures are not incorrectly stopped.

## Failure handling
If trace fields are insufficient, mark the diagnosis `insufficient_evidence` and instrument the missing fields. Do not guess.

## Stop conditions
Stop diagnosis after two failed hypotheses or once a reproducible root cause and measurable guard criterion are established; escalate with captured evidence thereafter.
