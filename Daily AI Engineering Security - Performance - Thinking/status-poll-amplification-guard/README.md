# Status Poll Amplification Guard

**Category:** Performance

## Problem
Long-running agent workflows often poll subagents, commands, CI, or external jobs at short fixed intervals. If every timeout/no-change result becomes a new model turn, the system can repeatedly reprocess a large accumulated context while learning nothing new. Stale `running` states or deterministic failures can keep the loop alive far beyond useful work.

## Evidence
See `evidence/research.md`. Recent Codex issue reports include measured wait/status amplification and a separate multi-hour identical-retry loop after a deterministic hook failure.

## Existing approach
Common approaches are fixed waits, manually increasing timeout values, repeated status/list calls, generic retry helpers, or manual user intervention.

## Existing limitations
Longer fixed waits trade cost for responsiveness; generic retries do not prevent unchanged results from reaching model context; noisy status payloads can appear changed even when semantic state is unchanged; stale lifecycle state can defeat natural termination.

## Proposed improvement
Put a deterministic status controller outside the model loop. Normalize material fields, fingerprint state, suppress unchanged non-terminal polls, apply bounded backoff, reset on real state change, emit terminal events immediately, and circuit-break poll/failure budgets.

## Architecture
```text
external job/subagent
  -> poll status
  -> normalize material fields
  -> poll_guard.py
     -> suppress + backoff
     -> emit + reset
     -> terminal + stop
     -> circuit-break + escalate
  -> only meaningful events reach model context
```

## Actual package tree
```text
status-poll-amplification-guard/
├── README.md
├── evidence/research.md
├── config/poll-policy.json
├── skills/poll-loop-optimization.md
├── rules/polling-rules.md
├── subagents/poll-verifier.md
├── workflows/measure-optimize-verify.md
├── hooks/pre-model-status-emission.md
├── scripts/poll_guard.py
└── tests/test_poll_guard.py
```

## Installation
Requires Python 3.10+. Integrate the controller in the orchestration layer that receives status results before those results are appended to model-visible context.

## Configuration
Edit `config/poll-policy.json`. Choose `material_fields` that represent meaningful progress; exclude volatile timestamps or verbose messages unless they genuinely change the next decision. Set initial/max interval, maximum polls, wall-clock budget, and identical-failure limit based on workload SLOs.

## Usage
```bash
python scripts/poll_guard.py \
  --config config/poll-policy.json \
  --status '{"state":"running","progress":10}' \
  --previous-fingerprint "$LAST_FP" \
  --poll-count 4 \
  --elapsed-seconds 45 \
  --current-interval 20
```
Normal decisions return exit `0`; budget/failure circuit breaks return `2`; invalid input/config returns `3`.

## Workflow
Follow `workflows/measure-optimize-verify.md`: Measure → Diagnose → Hypothesize → Configure → Replay → Canary → Measure again → Independent verify. Optimization is incomplete without before/after metrics.

## Metrics
- raw polls/task;
- model-visible poll events/task;
- no-change suppression ratio;
- model calls/task;
- input/cached-input tokens/task;
- terminal-state detection latency;
- p50/p95 poll interval;
- stale-running and circuit-break counts;
- wall-clock completion time.

## Verification
```bash
python -m unittest tests/test_poll_guard.py
```
Then replay a representative baseline trace and run a live canary. Verify that unchanged results are suppressed, changed/terminal states are emitted, poll budgets terminate, model-visible turns fall, and detection latency remains within the accepted SLO.

## Safety and correctness
The controller must never suppress a material status change purely to reduce tokens. Unknown/invalid status is escalated rather than treated as unchanged or successful. Cancellation and terminal states should remain immediately visible.

## Failure handling
Invalid inputs retry once at the collection boundary; then autonomous polling stops with `status-unknown`. Identical deterministic failure signatures circuit-break after the configured limit. Poll count and wall-clock limits prevent infinite loops.

## Definition of Done
- evidence/current approaches/limitations documented;
- baseline captured;
- material fields explicitly defined;
- controller and bounded policy implemented;
- unit tests pass;
- representative replay and canary measurements completed;
- model-visible no-change turns/model calls are reduced;
- terminal detection latency remains within SLO;
- independent verifier approves;
- no material state change is hidden.

## Implemented / Measured / Verified
**Implemented:** reusable deterministic controller, policy, workflow, rules, hook, verifier, tests.

**Measured:** requires adopter baseline and post-change telemetry.

**Verified:** only after tests and a before/after workload prove measurable reduction without correctness/detection-latency regression.

## Customization
Add duration classes, service-specific jitter, semantic status normalizers, or stale-progress heuristics. Keep the core invariants: unchanged state does not require a model turn, retries are bounded, and material state changes remain observable.