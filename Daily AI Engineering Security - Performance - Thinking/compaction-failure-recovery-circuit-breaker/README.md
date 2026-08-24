# Compaction Failure Recovery Circuit Breaker

**Category:** Thinking  
**Run date:** 2026-08-24 (UTC+7)

## Problem
Long-running AI agents can enter unsafe recovery behavior around context compaction: retry the same oversized summary, persist retry debris that makes the next attempt larger, terminate headless execution after a compaction transition, or lose recoverable state when provider-native compaction happens before the host's checkpoint/memory flush.

## Evidence
See `evidence/research.md`. August 2026 reports across Prime Agent, Claude Code, and OpenClaw show repeated compaction failure loops, headless termination, exhausted teammates that cannot recover in-place, and host/provider compaction thresholds that disagree.

## Existing approach
Agent runtimes commonly implement auto-compaction, reserve-token thresholds, retry-on-overflow, summaries/checkpoints, and model-specific context windows.

## Existing limitations
- retry logic often assumes compaction failure is transient
- failed summary attempts can add durable context and worsen the next retry
- a compaction event may be treated as a terminal boundary in headless mode
- provider-native compaction may occur before host memory/checkpoint policy
- recovery state is not always represented as an explicit finite-state machine with bounded attempts

## Proposed improvement
Normalize compaction lifecycle events, require a durable checkpoint before destructive recovery when possible, count no-progress failures, and open a circuit after a bounded threshold. The circuit produces an explicit recovery/escalation decision rather than silently retrying or claiming completion.

## Architecture
```text
agent/runtime events (JSONL)
        |
        v
scripts/compaction_guard.py <--- config/recovery-policy.json
        |
        +--> continue (0)
        +--> recover/pause (2)
        +--> invalid telemetry (3)
```

## Package tree
```text
README.md
evidence/research.md
config/recovery-policy.json
skills/compaction-failure-diagnosis.md
rules/bounded-compaction-recovery.md
subagents/recovery-verifier.md
workflows/compaction-recovery.md
hooks/post-compaction-event-gate.md
scripts/compaction_guard.py
tests/test_compaction_guard.py
```

## Installation
Python 3.10+; no third-party dependencies.

## Configuration
`config/recovery-policy.json` sets the maximum consecutive compaction failures, maximum retry-debris growth, whether checkpoint evidence is required before retry, and which normalized event names represent start/success/failure/checkpoint/progress/session-end.

## Input event contract
One JSON object per line. Required fields: `type`; optional `session_id`, `ts`, `context_tokens`, `payload_tokens`, `retry_debris_tokens`, `detail`. Adapters SHOULD normalize vendor telemetry before calling the guard.

## Usage
```bash
python scripts/compaction_guard.py --input session-events.jsonl --policy config/recovery-policy.json
```

Exit codes: `0` safe to continue; `2` circuit open/recovery required; `3` invalid input or policy.

## Workflow
Follow `workflows/compaction-recovery.md`: observe → capture baseline → diagnose failure shape → form recovery hypothesis → attach circuit breaker → replay fixtures → verify with an independent agent.

## Metrics
- consecutive compaction failures per session
- no-progress retries before circuit opens
- retry-debris token growth
- percentage of destructive recovery attempts preceded by checkpoint evidence
- false completion/headless termination count
- sessions recovered without rework or state loss

## Verification
```bash
python -m unittest tests/test_compaction_guard.py
```
Tests prove repeated failure opens the circuit, a success resets the failure sequence, missing checkpoint blocks retry when required, and retry-debris growth can independently trip the guard.

## Safety
The guard never requests hidden chain-of-thought. It consumes observable lifecycle telemetry only. It does not modify conversation history or delete context. When evidence is insufficient, it fails closed into recovery/escalation rather than weakening context, verification, or safety constraints.

## Failure handling
Detection: exit 2 with reasons. Evidence: structured JSON. Retry policy: bounded by policy, normally two no-progress failures maximum. Fallback: checkpoint/pause and start a fresh recovery context with an explicit handoff. Escalation: human/operator if checkpoint is unavailable or repeated recovery fails. Stop condition: circuit remains open until explicit progress/success or a new reviewed recovery session starts.

## Definition of Done
**Implemented:** normalized lifecycle gate, rules, recovery workflow, tests, verifier.  
**Measured:** failure/retry/checkpoint metrics captured on real telemetry.  
**Verified:** failure fixtures open the circuit within configured bounds, normal compaction remains unblocked, and host integration does not report completion when recovery is required.

## Customization
Map runtime-specific event names in `config/recovery-policy.json` or pre-normalize logs. Keep retry bounds finite.