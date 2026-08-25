# Productive Subagent Stall Discriminator

**Category:** Performance

## Problem
Long-running AI subagents can be killed by fixed silence watchdogs while still healthy, especially during slow high-effort inference. Blind restarts repeat repository exploration/setup, waste tokens, leak temporary resources, and misreport failure causes.

## Evidence
See `evidence/research.md` for current August 2026 public evidence.

## Existing approach and limitation
Fixed timeouts, tool-in-flight exemptions and automatic retry are useful, but a single silence clock cannot reliably distinguish dead work from slow inference. Blind retry amplifies the cost.

## Proposed improvement
Combine multiple observable progress signals, soft/hard thresholds, typed termination reasons, bounded retry and durable-progress preservation. No hidden chain-of-thought is used.

## Package tree
```
README.md
evidence/research.md
config/policy.json
scripts/stall_discriminator.py
tests/test_stall_discriminator.py
skills/stall-investigation.md
rules/liveness-and-retry.md
subagents/performance-verifier.md
workflows/measure-diagnose-recover.md
hooks/pre-retry-gate.md
```

## Installation
Python 3.9+; no third-party dependencies.

## Usage
Provide JSONL events with numeric `ts` and `type`: `model_event`, `tool_event`, `protocol_event`, `durable_progress`, `human_cancel`, `policy_denied`, or `provider_timeout`.

`python3 scripts/stall_discriminator.py trace.jsonl --now <epoch-seconds>`

Exit codes: 0 not confirmed stalled; 1 confirmed stall; 2 invalid evidence.

## Metrics
False-positive watchdog rate, true-stall recovery latency, tokens lost per kill/retry, duplicate tool/setup calls, retry convergence and completion rate.

## Verification
Run `python3 -m unittest tests/test_stall_discriminator.py`, then replay representative production traces and compare before/after metrics.

## Safety
The script reads telemetry only. Non-idempotent external side effects MUST NOT be automatically replayed based on this classifier. Approval/security boundaries MUST NOT be weakened.

## Failure handling
Malformed/missing telemetry returns exit 2 and blocks automatic retry. Retry is bounded. Human cancel and policy denial are terminal.

## Definition of Done
**Implemented:** classifier, policy, rules, workflow and gate exist. **Measured:** baseline/post-change metrics are captured. **Verified:** an independent verifier confirms fewer false kills without unacceptable true-stall recovery regression, and tests pass.
