# Agent Streamed Tool-Call Argument Integrity Guard

## Topic
Prevent silent semantic corruption when streamed tool-call arguments are truncated, malformed, or destructively repaired.

## Category
Security

## Problem
A streamed function/tool call can arrive incomplete. If a runtime substitutes `{}` or otherwise repairs it into a different valid payload, a side-effecting tool may execute with lost semantics or appear successful when the intended action never happened.

## Evidence
See `evidence/research.md` for August 2026 public incident reports and interpretation.

## Existing approach
Typical runtimes use JSON repair, schema validation, transport retries, and provider-specific fallbacks. These help availability but do not prove semantic completeness.

## Existing limitations
A syntactically valid replacement can still be semantically wrong. Optional-field schemas can accept `{}`. Blind retries are unsafe after uncertain side effects.

## Proposed improvement
Attach explicit integrity provenance to every streamed invocation and enforce it at the execution boundary. Lossy-repaired or incomplete side-effecting calls retry only before execution and within a fixed budget; otherwise they fail closed with a model-visible error.

## Architecture
- `evidence/research.md` — current signals, approaches, gaps, root causes.
- `config/policy.json` — safe defaults and side-effect classifications.
- `skills/tool-call-integrity-analysis.md` — reusable diagnosis procedure.
- `rules/tool-call-integrity-rules.md` — enforceable runtime rules.
- `subagents/integrity-verifier.md` — independent verifier contract.
- `workflows/observe-validate-recover.md` — bounded execution/recovery flow.
- `hooks/pre-tool-integrity-check.md` — deterministic pre-execution integration point.
- `scripts/argument_integrity_gate.py` — executable reference gate.

## Installation
Requires Python 3.10+ for the reference script; otherwise the Markdown contracts are framework-independent. Copy the directory intact and map host tool names into `config/policy.json`.

## Configuration
Classify every write/delete/deploy/publish/send/execute/secret-read operation as side-effecting. Keep `max_retries_before_execution` bounded. Add application-specific tools rather than removing safe defaults.

## Usage
Create an input JSON containing `tool`, `raw_arguments`, `stream_complete`, `repair`, `schema_required`, `executed`, and `retry_count`, then run:

`python scripts/argument_integrity_gate.py input.json --policy config/policy.json`

Exit codes: `0 allow`, `3 retry`, `4 block`, `2 invalid`.

## Workflow
Observe raw fragments → validate completeness/provenance → diagnose loss → retry only before execution → execute only on `allow` → verify outcome → audit.

## Metrics
Track malformed/truncated rate, lossy-execution count, silent-success count, recovery rate, false blocks for legitimate no-arg tools, and provider/model distribution.

## Verification
Replay truncated large-argument fixtures, mid-stream drops, malformed JSON, valid normal calls, and legitimate zero-argument calls. A side-effecting executor must receive zero invocations for blocked fixtures.

## Safety
Never guess missing arguments. Never treat schema validity as proof of completeness. Never replay an unknown-outcome side effect without an idempotency/reconciliation contract. Do not log sensitive raw payloads; hashes/lengths are preferred.

## Failure handling
Detection is deterministic via integrity metadata. Retry at most twice before execution. After exhaustion, emit an explicit failure and preserve the task as incomplete. Unknown execution outcome escalates to reconciliation/human approval rather than blind retry.

## Definition of Done
**Implemented:** integrity metadata reaches the execution gate and lossy repairs are identified.

**Measured:** baseline and post-change malformed/retry/block metrics exist.

**Verified:** adversarial fixtures cannot reach side-effect execution, legitimate zero-argument tools still work, no secrets are exposed, retries are bounded, and an independent verifier confirms the result.

## Customization
Extend side-effect classifications and host adapters while preserving the invariant: non-empty argument semantics that were lost in transit must never be silently converted into executable success.
