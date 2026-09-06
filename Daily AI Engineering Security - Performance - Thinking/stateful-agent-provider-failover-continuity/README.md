# Stateful Agent Provider Failover Continuity

**Category:** Performance

## Problem
Long-lived AI agents can stall or lose continuity when a model provider degrades. Simple retries or cross-provider fallback are not enough once a run contains provider-specific response IDs, streamed tool calls, approvals and side effects. The recovery mechanism must improve latency without replaying actions, corrupting credential state or losing task progress.

## Evidence
See `evidence/research.md`. Current signals include the September 3, 2026 OpenAI and Anthropic incidents, a provider-agnostic silent-stall report in OpenClaw, fallback credential-state contamination in Hermes Agent, and resumable tool-call state bugs in OpenAI Agents SDKs.

## Existing approach
Common systems use request timeouts, exponential backoff, API gateways, model fallbacks and provider-specific resume APIs.

## Existing limitations
Retry layers can multiply; failover can carry incompatible IDs or error state; partial streaming can leave ambiguous tool calls; and an apparently successful fallback response can still leave the task incomplete. Side effects are especially dangerous to replay blindly.

## Proposed improvement
Separate portable task state from provider-local protocol state. Use one retry budget, a circuit breaker, a durable provider-neutral checkpoint, a side-effect ledger, compatibility checks and independent post-recovery verification.

## Architecture
- `evidence/research.md` — observed evidence, interpretation, current approaches and root causes.
- `rules/failover-continuity.md` — enforceable recovery invariants.
- `skills/failover-state-analysis.md` — measurement and decision procedure.
- `subagents/recovery-verifier.md` — independent verifier.
- `workflows/measure-recover-verify.md` — bounded performance workflow.
- `hooks/pre-failover-check.md` — deterministic blocking gate.
- `scripts/failover_analyzer.py` — dependency-free trace analyzer.
- `tests/test_failover_analyzer.py` — deterministic recovery-decision tests.

## Installation
Python 3.9+ is sufficient for the reference analyzer. Integrate the rules into the orchestrator/gateway that owns retries and provider selection.

## Configuration
Define a shared retry budget, stall threshold, provider capability matrix, portable checkpoint schema and durable tool-side-effect ledger. Keep credentials and provider health independently keyed by provider/account.

## Usage
Analyze a JSONL trace:

`python scripts/failover_analyzer.py --trace run.jsonl --max-retries 3 --stall-ms 30000 --output decision.json`

Trace events can include `provider_error`, `retry`, `tool`, and `terminal_response`; provider-error `code` values such as `503`, `timeout`, `429`, `401`, or `schema` are classified deterministically.

Run tests with `python tests/test_failover_analyzer.py`.

## Workflow
Observe → measure baseline stall/retries/task state → diagnose failure → form recovery hypothesis → apply one bounded action → measure again → if not improved, re-evaluate once → independent verification → complete or stop.

## Metrics
Track p50/p95 provider-call and recovery latency, total stall time, retries/run, failover success rate, terminal-response coverage, task completion rate, provider-error attribution and duplicate side effects. Never claim improvement without before/after evidence.

## Verification
**Implemented:** one shared recovery state machine and portable checkpoint are integrated. **Measured:** before/after latency, retry and task-state evidence are captured. **Verified:** injected failures recover within the target SLO or stop safely, with zero duplicate side effects, no provider-state contamination, intact approvals and complete required outputs.

## Safety
Failover MUST NOT broaden permissions, tools, data exposure or network reach. Ambiguous side effects require reconciliation rather than replay. Provider-specific IDs and credentials never cross provider boundaries. Security and correctness requirements take precedence over latency recovery.

## Failure handling
Detection: stall deadline, provider error burst, incomplete stream or missing terminal response. Evidence: trace, checkpoint, provider health and tool ledger. Retry policy: maximum two recovery actions per incident and one shared retry budget. Fallback: preserve checkpoint and stop further calls. Escalation: human operator for ambiguous side effects, incompatible fallback or policy mismatch. Stop condition: exhausted budget, invalid checkpoint, unresolved side effect or second failed recovery.

## Definition of Done
Evidence documented; baseline captured; current limitations identified; recovery mechanism implemented; tests pass; before/after metrics collected; provider state remains isolated; required tools/results are reconciled; no duplicated side effect occurs; independent verification is complete; no blocking issue remains.

## Customization
Extend the trace classifier for provider-specific status/error taxonomies and add compatibility checks for structured outputs, tool schemas, images, reasoning controls and context windows. Preserve the portable/local-state separation and bounded retry invariant.
