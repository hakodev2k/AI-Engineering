# Transient vs Terminal Retry Classification Gate

**Category:** Performance  
**Run date:** 2026-09-05 (UTC+7)

## Problem
AI-agent runtimes often handle retries at the wrong abstraction layer. Some repeatedly retry persistent server/tool failures until a user interrupts them, while other long-running jobs abort on a transient network failure after consuming substantial compute. Both failure modes waste latency, tokens, tool/model calls, and infrastructure time.

## Evidence
See `evidence/research.md`. The package separates observed evidence, interpretation, and the proposed engineering mechanism.

## Existing approach
SDKs and agent frameworks commonly provide fixed retry counts, exponential backoff, global max-turn limits, provider-specific retries, and manual interruption. These controls are useful but do not consistently distinguish retryable transient failures from terminal authentication, validation, policy, or repeatedly unchanged failures.

## Existing limitations
Retry logic is frequently split across SDK, transport, orchestration, and agent loops. A fixed count can be too aggressive for expensive long-running jobs and too permissive for deterministic failures. Global iteration limits do not prevent costly retry storms early in a run, and immediate aborts can discard recoverable work.

## Proposed improvement
Introduce a deterministic post-error gate that classifies the error, tracks attempt count, elapsed retry time, repeated error fingerprints, and observable state change, then emits exactly one of `RETRY` or `STOP`. Retryability is explicit, unknown classes fail closed, and retry budgets are bounded by attempts, elapsed time, and repeated-no-progress fingerprints.

## Package tree
- `evidence/research.md`
- `skills/retry-path-performance-analysis.md`
- `rules/retry-budget-rules.md`
- `subagents/retry-verifier.md`
- `workflows/measure-diagnose-retry.md`
- `workflows/failure-recovery.md`
- `hooks/post-error-retry-gate.md`
- `scripts/retry_guard.py`
- `config/retry-policy.example.json`
- `tests/test_retry_guard.py`

## Installation
Python 3.10+. Standard library only.

## Configuration
Configure explicit retryable and non-retryable error classes plus maximum attempts, elapsed retry time, repeated identical-error count, and bounded exponential backoff. Security/permission/policy errors must remain non-retryable unless an external authorized state change occurs and the error is reclassified by policy owners.

## Usage
`python scripts/retry_guard.py config/retry-policy.example.json <event.json>`

The event file describes the current retry episode. Exit 0 permits exactly one retry. Exit 4 means terminal STOP. Exit 1 means invalid input/configuration and blocks automatic retry.

## Workflow
Measure baseline -> classify failures -> diagnose retry path -> form hypothesis -> add deterministic gate -> replay controlled fixtures -> measure again -> compare retry cost and recovery rate -> independently verify. Optimization is limited to two tuning cycles.

## Metrics
Retries/task; repeated identical errors; time-to-terminal; retry latency; model/tool calls; tokens/task; cost/task; transient recovery rate; false-retry rate; false-stop rate; end-to-end task success.

## Verification
**Implemented:** deterministic classification gate, enforceable rules, bounded workflows, tests.  
**Measured:** baseline and guarded workloads record retry calls, elapsed retry time, recovery, and task success.  
**Verified:** transient fixtures recover within budget; terminal and repeated-no-progress failures stop deterministically; before/after retry cost improves without reducing accepted task-success quality.

## Safety
Never retry authorization, permission, policy, or security failures to bypass controls. Side-effecting calls may only be retried when idempotency or reconciliation is proven and required approval remains valid. Unknown error classes stop rather than guessing.

## Failure handling
Malformed events/configuration block automatic retry. Policy tuning may be attempted at most twice using measured evidence. Persistent failure after the second cycle terminates the retry episode and escalates with its error fingerprint and metrics; budgets must not be repeatedly raised to hide the problem.

## Definition of Done
Current evidence documented; baseline captured; retry classes explicit; budgets configured; tests pass; before/after metrics recorded; transient recovery preserved or improved; repeated/terminal failures stop inside budget; security boundaries remain intact; independent reviewer verifies results.

## Customization
Map provider-specific error codes to the organization’s normalized classes before invoking the gate. Keep the gate itself provider-neutral so orchestration behavior remains testable and comparable across models, tools, and transports.