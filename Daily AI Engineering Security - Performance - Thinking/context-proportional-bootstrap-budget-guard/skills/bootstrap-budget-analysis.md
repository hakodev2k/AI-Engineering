# Skill: Bootstrap Budget Analysis

## Purpose
Measure and right-size first-turn agent context against the active model window without removing correctness-critical instructions.

## Trigger
Model change, capability-manifest change, prompt-template change, or bootstrap ratio regression.

## Inputs
Context-window size, component manifest, budget policy, representative eval results when comparing changes.

## Preconditions
Token counts MUST come from provider/tokenizer telemetry when available; estimates MUST be labeled as estimates.

## Required context
Model context window, component provenance, required/optional classification, output reserve requirement.

## Allowed tools
Tokenizer/usage telemetry, local scripts, configuration readers, benchmark/eval runner.

## Constraints
MUST NOT remove security, authorization, task requirements, or output contracts solely for token savings. MUST preserve an explicit output reserve.

## Procedure
1. Capture baseline component tokens and total bootstrap tokens.
2. Compute bootstrap cap and task/output reserves from policy.
3. Mark mandatory components and verify all required kinds are represented.
4. Rank optional components by priority, then token contribution.
5. If over budget, remove/defer only optional components; recalculate.
6. Repeat at most two adjustment iterations.
7. Run representative tasks on baseline and candidate configuration.
8. Accept only if budget passes and quality regression is within tolerance.

## Decision points
- Unknown context window: produce advisory report; do not claim enforcement.
- Required components alone exceed cap: escalate to larger model or redesign required prompt; do not drop them.
- Quality regresses above tolerance: restore affected context and try a different selector/compression strategy.

## Expected output
Baseline/post-change token table, eviction decisions, pass/fail, quality comparison and residual risks.

## Metrics
Bootstrap ratio, remaining task budget, evicted tokens, task quality, latency, overflow/compaction incidence.

## Verification
Independent reviewer confirms required components remained and reruns the deterministic checker.

## Failure handling
Maximum two adjustment attempts; then stop and escalate with evidence.

## Stop conditions
Budget passes with quality preserved, or two failed adjustment iterations, or required-only context exceeds cap.