# Agent No-Progress Loop Circuit Breaker

## Topic
Deterministic detection and recovery for long-running coding agents that repeat actions, reads, polls, or continuation turns without durable progress.

## Category
**Thinking**

## Problem
Coding agents can remain active while making no useful progress: repeatedly reading the same file/offset, emitting near-identical continuation messages, replaying post-compaction setup, or polling unchanged state. Because the runtime may treat each model turn as legitimate work, these loops can consume tokens, usage quota, CPU, and wall-clock time until a user intervenes or a coarse timeout fires.

## Evidence
Recent public reports include Claude Code #86291 (2026-08-13) describing repeated `Read` behavior after compaction, Codex #37800 (2026-08-10) describing automatic continuation consuming usage without progress, and Codex #34322/#34248/#27588 describing compaction/goal/pre-write repetition loops. Full evidence and source links are in `evidence/research.md`.

## Existing approach
Common defenses are prompt instructions, global iteration caps, timeouts, manual intervention, and context compaction/checkpointing.

## Existing limitations
These approaches either depend on the looping model to self-diagnose or only measure duration/cost rather than progress. Coarse limits can terminate productive long runs, while compaction can fail to preserve enough trajectory state and become part of the loop itself.

## Proposed improvement
Maintain an external trajectory ledger and define progress through observable state. Normalize tool calls/results into stable fingerprints, track durable progress markers, evaluate repetition/novelty in a sliding window, warn before stopping, and require a materially different recovery trajectory before execution resumes.

The package does not inspect hidden chain-of-thought. It uses tool/action/result events and explicit state transitions.

## Architecture
```text
Tool/turn event
     |
     v
Host normalizer ---> durable progress instrumentation
     |                         |
     +----------+--------------+
                v
      JSONL trajectory ledger
                |
                v
       trajectory_guard.py
        /       |       \
   HEALTHY     WARN     STOP
      |          |        |
   continue   checkpoint   freeze auto-continue
                         |
                         v
                  Recovery Planner
                         |
                  changed recovery key
                         |
                    new progress?
                    /          \
                  yes          no
                  |             |
               clear         bounded retry/
               breaker       escalate
```

## Package structure
```text
agent-no-progress-loop-circuit-breaker/
├── README.md
├── guide-intergration.md
├── config/
│   └── policy.json
├── evidence/
│   └── research.md
├── skills/
│   └── core-skills.md
├── rules/
│   └── engineering-rules.md
├── subagents/
│   └── subagents.md
├── workflows/
│   └── workflows.md
├── hooks/
│   └── hooks.md
├── scripts/
│   └── trajectory_guard.py
└── tests/
    └── test_trajectory_guard.py
```

## Installation
Requires Python 3.9+ and no third-party packages.

Clone/copy this directory into the agent host project, then make the script executable where appropriate:

```bash
chmod +x scripts/trajectory_guard.py
```

## Configuration
Edit `config/policy.json`. Important settings:
- `window_size`: recent action/result window;
- `warn_after_no_progress_turns`: early checkpoint threshold;
- `stop_after_no_progress_turns`: hard no-progress bound;
- `max_identical_action_fingerprint`: repeat allowance;
- `max_identical_result_fingerprint`: unchanged-result allowance;
- `minimum_novelty_ratio`: distinct action ratio floor;
- `max_recovery_attempts`: bounded recovery ceiling.

Calibrate from real traces; do not loosen thresholds solely to suppress warnings.

## Usage
Create/stream an ordered JSONL trajectory and run:

```bash
python scripts/trajectory_guard.py trace.jsonl --config config/policy.json --json
```

Exit codes:
- `0` healthy;
- `2` warn;
- `3` stop;
- `4` invalid trace/config.

Host integrations should evaluate after tool results and before automatic continuation. See `guide-intergration.md`.

## Workflow
Primary flow: Observe → Measure → Classify → Checkpoint → Break → Recover → Verify. Every recovery attempt is bounded and must differ materially from the stopped trajectory. See `workflows/workflows.md`.

## Metrics
Track at minimum:
- actions/turns since last durable progress;
- maximum identical action fingerprint count;
- maximum identical result fingerprint count;
- action novelty ratio;
- tokens/tool calls after detectable loop onset, if available;
- false-stop rate on successful traces;
- recovery success and relapse rate.

A performance/quality claim is valid only when guarded traces show lower wasted execution while representative productive traces remain successful.

## Verification
### Implemented
The package provides external policy, event fingerprinting, threshold evaluation, explicit exit codes, recovery rules, hooks, workflows, and deterministic tests.

### Measured
Integrators must capture baseline and guarded traces in their own runtime and compare loop-stop latency, tool calls/tokens after last progress, and false-stop rate.

### Verified
Verification requires:
1. looping fixture reaches STOP within configured bound;
2. productive fixture stays HEALTHY;
3. changing bounded poll does not accumulate false no-progress state;
4. STOP survives compaction/resume through external state;
5. identical recovery trajectory cannot clear the breaker;
6. a new durable progress event after a changed recovery can clear it.

Run bundled tests:

```bash
python tests/test_trajectory_guard.py
```

## Safety
The detector is read-only and performs no network or repository mutation. Avoid logging full sensitive tool results when hashes/compact summaries suffice. The breaker must not weaken permission, sandbox, verification, or approval boundaries. Dangerous or irreversible recovery actions still require the host’s normal human approval policy.

## Failure handling
- Invalid event/config input: exit 4; disable automatic continuation until instrumentation is repaired.
- WARN threshold: preserve counters and checkpoint; do not pretend progress occurred.
- STOP threshold: freeze automatic continuation and create recovery checkpoint.
- Recovery failure: maximum two attempts by default; then exit/escalate as blocked.
- Missing trace after compaction/resume: do not reset; reconstruct external ledger or keep continuation disabled.

## Definition of Done
A production integration is complete only when:
- evidence and failure mode are documented;
- progress event semantics are explicit;
- baseline successful and looping traces exist;
- policy is calibrated on those traces;
- deterministic tests pass;
- looping traces stop within configured no-progress bound;
- representative productive traces remain successful;
- before/after wasted calls/tokens are measured where available;
- recovery attempts are bounded and require trajectory change;
- compaction/resume cannot erase STOP/counters;
- residual false-positive/false-negative risks are documented;
- no blocking verification issue remains.

## Customization
Add task-specific progress markers rather than embedding domain logic into fingerprinting. For build agents, use changed test outcomes and diffs. For research agents, use new source/evidence IDs and hypothesis elimination. For long external jobs, use explicit task-state transitions plus bounded polling or a model-free wait mechanism. Keep the central rule unchanged: activity is not progress unless observable state changes.
