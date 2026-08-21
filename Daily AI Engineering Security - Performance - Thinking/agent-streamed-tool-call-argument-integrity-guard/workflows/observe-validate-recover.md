# Workflow: Observe → Validate → Recover

## Trigger
A streamed tool call is assembled and is about to be parsed/executed.

## Goal
Prevent semantic-loss execution while preserving safe recovery for transient stream failures.

## Inputs
Raw fragments, completion state, tool/schema, repair trace, policy, retry count, execution state.

## Baseline
Before rollout, measure malformed/truncated tool-call rate, silent-success incidents, retries, and zero-argument compatibility failures.

## Stages
1. **Observe** — capture raw hash/length, completion/finish state, provider/model, and tool name.
2. **Validate integrity** — run `scripts/argument_integrity_gate.py` before schema validation/execution.
3. **Diagnose** — classify `complete-valid`, `legitimate-empty`, `incomplete`, `lossy-repair`, or `invalid-schema`.
4. **Recover** — if incomplete/lossy and execution has not occurred, retry the model stream up to 2 times. A retry must start a fresh generation; do not splice guessed bytes.
5. **Execute** — only an `allow` decision reaches the tool executor.
6. **Verify outcome** — side-effecting operations must return normal tool evidence; unknown outcome uses the host idempotency/reconciliation mechanism rather than blind replay.
7. **Audit** — persist decision/reason metadata without sensitive raw payloads.

## Responsible agent
Runtime implementation agent; independent verification is performed by `subagents/integrity-verifier.md`.

## Tools
`config/policy.json`, `scripts/argument_integrity_gate.py`, schema validator, runtime test harness.

## Outputs
Integrity decision, bounded recovery result, tool outcome, verification evidence.

## Checkpoints
- Before retry: confirm tool has not executed.
- Before execution: integrity decision must be `allow`.
- Before completion: no blocked invocation may be represented as successful.

## Metrics
Silent-success count, lossy-execution count, retry recovery rate, malformed rate/provider, zero-arg false block rate.

## Retry policy
Maximum 2 pre-execution generation retries. No automatic post-execution retry for side effects without idempotency evidence.

## Stop conditions
Stop and block after retry budget exhaustion, integrity metadata loss, or unknown side-effect execution outcome.

## Failure path
Emit structured `tool_call_integrity_failure`, preserve the original user goal, and hand off for explicit recovery. Do not mark the intended operation complete.

## Verification
Replay current incidents and synthetic truncation boundaries; assert executor invocation count is zero for blocked fixtures.

## Definition of Done
Implemented gate; baseline captured; adversarial fixtures pass; zero-arg compatibility preserved; silent-success metric is zero; independent verifier signs off.
