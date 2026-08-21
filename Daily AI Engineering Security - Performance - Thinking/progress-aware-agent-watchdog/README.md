# Progress-Aware Agent Watchdog

## Topic
Progress-Aware Agent Watchdog

## Category
Performance

## Problem
Fixed inactivity watchdogs can kill healthy long-running agents, while weak recovery and blind retries can hang or repeat expensive work. A watchdog must distinguish transport silence, slow reasoning, active tools, real task progress, and genuine no-progress loops.

## Evidence
See `evidence/research.md`. Fresh July–August 2026 reports from Claude Code, Hermes Agent, and OpenAI Codex show false-positive kills, hard-coded timeout behavior, repeated no-progress restarts, and real silent transport stalls. Current observability projects such as AgentTrace and Datadog Trajectory measure retries, stalls, latency, tokens, and progress markers, reinforcing the need for behavior-based diagnosis.

## Existing approach
Common implementations use a fixed idle timeout, reset the timer on stream/tool activity, retry after failure, and cap total retries.

## Existing limitations
A single timer conflates multiple execution phases. Stream chatter can mask loops; slow reasoning can look dead; retries often discard expensive setup; repeated identical failures are not compared across attempts; and raising timeout values globally increases genuine hang time.

## Proposed improvement
Use multiple observable signals and phase-specific patience. Preserve verified checkpoints before retry, compare retry signatures across attempts, and trip a circuit breaker when repeated attempts produce no new verified progress. Keep hard time/token/attempt budgets so recovery remains finite.

## Architecture
- **Skill:** evidence-driven liveness diagnosis.
- **Rules:** enforce finite budgets, phase awareness, checkpoint reuse, and measurable regression evidence.
- **Verifier subagent:** independently classifies healthy-slow vs stalled/looping.
- **Workflow:** Measure → Diagnose → Hypothesize → Checkpoint → Recover → Measure again.
- **Hook:** blocks blind watchdog retries.
- **Script:** deterministic multi-signal decision gate.
- **Tests:** exercise healthy-slow, true-stall, checkpoint, circuit-breaker, and hard-budget cases.

## Package tree
```text
progress-aware-agent-watchdog/
├── README.md
├── config/
│   └── watchdog-policy.json
├── evidence/
│   └── research.md
├── hooks/
│   └── pre-retry-progress-check.md
├── rules/
│   └── watchdog-retry-policy.md
├── scripts/
│   └── liveness_guard.py
├── skills/
│   └── progress-aware-liveness-diagnosis.md
├── subagents/
│   └── liveness-verifier.md
├── tests/
│   └── test_liveness_guard.py
└── workflows/
    └── adaptive-watchdog-recovery.md
```

## Installation
Requires Python 3.9+ and no third-party packages. Integrate liveness signal collection into the agent runtime and call the pre-retry hook before watchdog-triggered restart/reconnect operations.

## Configuration
`config/watchdog-policy.json` defines phase patience, hard task timeout, total attempts, identical-signature breaker, token budget, checkpoint requirement, signals, and weights. Calibrate these values from production traces; do not globally relax them without before/after evidence.

## Input contract
The script accepts JSON with:
- `phase`
- `idle_seconds`
- `total_elapsed_seconds`
- `attempt_number`
- `tokens_used`
- `signals`: mapping of signal name to age in seconds or null
- `checkpoint_hash`
- `previous_checkpoint_hash`
- `identical_signature_count`

## Usage
```bash
python scripts/liveness_guard.py \
  --input liveness.json \
  --policy config/watchdog-policy.json
```

Exit codes:
- `0`: continue/wait
- `2`: invalid input/configuration
- `3`: checkpoint retry
- `4`: stop/circuit breaker

Run tests:
```bash
python -m unittest tests/test_liveness_guard.py
```

## Workflow
1. Measure baseline false-kill rate, stall-detection latency, retry cost, and recovery success.
2. Classify execution phase.
3. Collect transport/tool/artifact/checkpoint/verification signals.
4. Compute retry signature and budgets.
5. Run deterministic guard.
6. Continue/wait if still inside healthy phase budget.
7. If patience expires, checkpoint and retry only when safe and budgeted.
8. Require the next attempt to show new verified progress.
9. Stop on repeated identical signatures or hard budget exhaustion.
10. Measure candidate behavior against the baseline workload.

## Metrics
- False-positive watchdog terminations / 100 long tasks.
- P50/P95 genuine-stall detection time.
- Wasted retry tokens.
- Retry-from-scratch rate.
- Checkpoint-resume rate.
- Recovery success rate.
- Identical no-progress signatures.
- Useful progress per 1k tokens and per minute.

## Verification
### Implemented
The package contains a policy, deterministic liveness gate, checkpoint/retry hook, workflow, independent verifier role, enforceable rules, and executable tests.

### Measured
Adopters must collect baseline and candidate measurements on the same representative workload.

### Verified
An optimization is verified only when tests pass and measurements show fewer false-positive kills and/or lower wasted retry cost without unacceptable regression in genuine-stall detection time or hard safety budgets.

## Safety
The package keeps finite hard time, token, attempt, and repeated-signature limits. It never recommends disabling watchdogs globally. It validates observable runtime evidence only and does not request hidden chain-of-thought.

## Failure handling
Detection comes from the guard decision and runtime trace. Before destructive retry, preserve checkpoint/log/signature evidence. Retry at most the configured total-attempt budget (default 3). Repeated identical no-progress signatures trip the circuit breaker. If a safe checkpoint cannot be established or all budgets are exhausted, stop and escalate rather than looping.

## Definition of Done
- Current evidence documented.
- Baseline workload metrics captured.
- Phase-aware policy configured.
- Liveness signals instrumented.
- Checkpoint/resume path implemented where supported.
- Deterministic tests pass.
- Retry signatures recorded and bounded.
- Before/after metrics collected.
- False-positive or wasted-cost improvement demonstrated without masking genuine stalls.
- No hard budget weakened without evidence.
- Verification complete and no blocking issue remains.

## Customization
Add domain-specific phases such as database migration, package installation, browser automation, GPU inference, or external deployment. New progress signals should be deterministic where possible and should have explicit evidence semantics rather than simply counting activity.