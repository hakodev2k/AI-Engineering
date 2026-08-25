# Skill: Matched-Control Triage

## Purpose
Turn an ambiguous regression into a differential investigation using a nearby passing control.

## Trigger
A failure recurs, differs by version/surface/runtime, or survives one repair attempt.

## Inputs
Failing reproduction, environment/version manifest, logs, candidate controls, budget.

## Preconditions
At least one reproducible failing observation or explicit evidence that reproduction is intermittent.

## Required context
Observable Facts, Evidence references, Assumptions, Differences, Hypotheses, Verification status. Hidden chain-of-thought is neither requested nor stored.

## Allowed tools
Read/search, tests, version queries, logs, rollback in a safe test environment, `git bisect`, and `triage_ledger.py`.

## Constraints
MUST preserve the failing case while searching controls. MUST NOT edit production merely to create a control. MUST bound experiments.

## Procedure
1. Freeze the failing-case manifest: version, surface, model/tool mode, OS/runtime, configuration relevant to reproduction.
2. Search nearest controls in order: same environment/different surface; same surface/last-known-good version; same code/minimal configuration; known passing test.
3. Run enough control repetitions to establish signal; record evidence.
4. Compute the explicit difference set between failing and passing cases.
5. Form hypotheses only from differences or cited evidence; each must include a falsification test.
6. Rank experiments by discrimination value and cost.
7. Run one experiment at a time; record outcome and new evidence.
8. Reject or support hypotheses; do not silently rewrite them.
9. After at most three experiments, either isolate a repair target or escalate with remaining uncertainty.
10. Have an independent reviewer verify the evidence and replay final control/failing checks.

## Decision points
No control after bounded search => document search and proceed with lower confidence; duplicate experiment without new evidence => stop; hypothesis without discriminator => reject.

## Expected output
A ledger that passes the repair gate and names the smallest evidence-supported repair boundary.

## Metrics
Control-search cost, experiments, rejected hypotheses, repeated-attempt blocks, time to isolation.

## Verification
Final repair must preserve the control and make the failing case pass using independent evidence.

## Failure handling
Maximum three experiments before re-scope. Escalate if the difference set remains too broad.

## Stop conditions
No reproducible failure, exhausted experiment budget, unsafe rollback requirement, or evidence contradiction that invalidates the baseline.