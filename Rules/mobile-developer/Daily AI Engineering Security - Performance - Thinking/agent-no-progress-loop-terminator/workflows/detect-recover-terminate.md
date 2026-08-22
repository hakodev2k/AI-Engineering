# Workflow — Detect, Recover, Terminate

## Trigger
After every completed or failed tool invocation.

## Goal
Stop repeated no-progress trajectories earlier than the hard outer turn limit while preserving legitimate bounded retries.

## Inputs
Ordered JSONL step events and `config/policy.json`.

## Baseline
Replay representative stuck and productive runs without the guard. Record total steps, tool calls, latency, tokens if available, and final outcome.

## Stages
1. Observe: capture tool, canonical arguments, outcome/error class, state fingerprint, and `progress` flag.
2. Measure baseline.
3. Diagnose the repeated signature/error pattern.
4. Form a hypothesis for the smallest safe threshold/recovery rule.
5. Integrate `scripts/progress_guard.py` after each tool step.
6. Measure again on the same fixtures.
7. If the decision is `recover`, require a changed hypothesis/tool/arguments/prerequisite before retry.
8. Independently verify productive and stuck fixtures.

## Checkpoints
- Baseline reproduced before policy tuning.
- Global hard step limit remains enabled.
- Transient error exemptions are explicitly named and bounded.
- No productive fixture terminates early.

## Metrics
Steps-to-stop, tool/model calls avoided, latency avoided, no-progress steps, recovery success rate, and false-positive termination rate.

## Retry policy
At most two recovery attempts per repeated failure pattern. Transient retries use their own configured limit. Total steps always remain capped.

## Failure path
If progress fields are unavailable or ambiguous, do not infer success from prose. Fall back to the hard step cap and mark verification incomplete.

## Verification
Run `python3 scripts/test_progress_guard.py` and independently inspect the emitted evidence window.

## Definition of Done
Baseline measured; stuck fixtures stop earlier; productive fixtures complete; retries are bounded; termination reasons are observable; hard cap preserved; independent verification passes.
