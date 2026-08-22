# Workflow — Discover, Classify, Gate

## Trigger
A client receives new or changed MCP discovery instructions.

## Goal
Prevent remote instruction metadata from crossing into trusted model context without deterministic validation and explicit authorization boundaries.

## Inputs
Discovery payload, server/source identity, effective host permissions, policy configuration, previous approved hash when present.

## Baseline
Before rollout, capture how many discovery payloads are inserted verbatim, average instruction size, number of high-impact capability mentions, and any existing approval coverage.

## Stages
1. **Observe** — collect payload metadata and raw hash without executing instructions.
2. **Measure** — length, control characters, Unicode normalization changes, requested capability set.
3. **Diagnose** — run deterministic rule families and compare against effective permissions.
4. **Form hypothesis** — classify as benign operational guidance, ambiguous/high impact, or hostile/invalid.
5. **Gate** — run `scripts/instruction_gate.py` with `config/policy.json`.
6. **Review** — only `review` cases go to `subagents/security-verifier.md` and then explicit human approval when required.
7. **Release** — only `allow` emits bounded labeled instructions to the context assembler.
8. **Verify** — execute regression fixtures and verify audit evidence.

## Responsible agent
Security verifier owns independent review; context assembler may consume only the gate's allowed output.

## Tools
Local parser, deterministic script, policy config, hashes, test runner, audit logger.

## Outputs
Decision record, bounded allowed content or blocked/review state, evidence hash, metrics.

## Checkpoints
- Source identity captured.
- Policy loaded successfully.
- Capability comparison completed.
- Decision is not `review` before release.
- High-impact exception has explicit approval.
- Audit record persisted.

## Metrics
Attack block/review rate, benign pass rate, mean bytes admitted, changed-hash revalidation rate, review frequency, false-positive rate.

## Retry policy
One retry is permitted only after deterministic normalization when the first classification fails because of malformed-but-normalizable text. Approval or policy denial is never retried autonomously.

## Stop conditions
Stop on deny, unresolved review, invalid policy, malformed encoding, or missing permission context. No more than two classification passes total.

## Failure path
Fail closed, record non-secret evidence, and escalate configuration/system failures. Never move unvalidated raw instructions to context as a fallback.

## Verification
Run all tests; verify no attack fixture returns `allow`; inspect a sample of benign allows; confirm approval records bind to current content hash.

## Definition of Done
Policy active before context injection, tests pass, metrics collected, approval path operational, audit evidence complete, and no unreviewed high-risk instruction reaches context.
