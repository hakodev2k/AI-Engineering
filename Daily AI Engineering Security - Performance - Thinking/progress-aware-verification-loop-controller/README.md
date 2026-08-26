# Progress-Aware Verification Loop Controller

**Category:** Thinking

## Problem
Long-running coding agents can misclassify legitimate test/edit/verify cycles as loops, or repeatedly re-run verification after the underlying state is already fresh and green. The result is either premature termination or non-convergent token/time burn.

## Evidence
See `evidence/research.md` for recent Qwen Code, Hermes Agent, and Codex reports from August 2026.

## Existing approach
Current systems use loop detectors, stale-verification prompts, reviewer agents, and repeated test gates. These controls are useful but often reason about repeated action shape rather than explicit state advancement and verification freshness.

## Existing limitations
Repeated commands can be productive when repository state advances. Conversely, repeated green verification can be wasteful when state is unchanged. A detector that only counts similar tool calls cannot reliably distinguish the two.

## Proposed improvement
Track an explicit `state_id`, verification freshness, terminal task state, and bounded verification budgets. Stop only when progress stalls, the task reaches a terminal state, or a verified unchanged state exceeds its verification budget.

## Architecture
- `evidence/research.md` — public evidence and root-cause analysis
- `skills/progress-aware-loop-analysis.md` — reusable diagnosis procedure
- `rules/loop-control.md` — enforceable invariants
- `subagents/verification-reviewer.md` — independent verifier
- `workflows/diagnose-and-tune.md` — bounded diagnosis workflow
- `workflows/regression-verification.md` — before/after verification
- `hooks/post-tool-progress-check.md` — deterministic runtime hook
- `scripts/progress_loop_guard.py` — state-aware loop classifier
- `tests/test_progress_loop_guard.py` — executable regression tests

## Installation
Python 3.10+; standard library only.

## Usage
Feed JSONL events containing at least `event` and `state_id`:

`python scripts/progress_loop_guard.py trace.jsonl --max-identical 3 --max-verifications 5`

A non-zero exit is a blocking stop decision, not an instruction to weaken verification.

## Metrics
- duplicate verification runs per unchanged state
- false loop terminations on state-advancing workflows
- maximum stagnant action count
- verified-state reuse rate
- human reactivation count after detector termination

## Verification
Run `python -m unittest tests/test_progress_loop_guard.py`.

## Safety
The controller never suppresses a required security or correctness check merely to reduce latency. Fresh state changes invalidate prior verification. Dangerous or irreversible actions still require their normal approvals.

## Failure handling
Malformed traces fail closed. Diagnosis may be revised at most twice. If state identity cannot be computed reliably, fall back to explicit human review rather than disabling loop protection.

## Definition of Done
**Implemented:** controller, rules, hook, workflow, and tests integrated.  
**Measured:** baseline and post-change loop/verification metrics collected.  
**Verified:** regression tests pass and an independent reviewer confirms both productive-cycle preservation and stagnant-loop termination.

## Customization
Choose `state_id` from deterministic task state such as a content hash, commit/worktree fingerprint, test-result digest, or orchestration checkpoint ID. Do not use free-form model narration as the state identity.
