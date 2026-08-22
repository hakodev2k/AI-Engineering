# Workflow: Interrupt Recovery Verification

## Trigger
A change or incident involving stop/abort handling, input routing, scheduler ownership, tools, background work, subagents, subprocesses, transcript persistence, checkpoints, or resume.

## Goal
Prove that a user interrupt becomes effective promptly, blocks further side effects, drains owned descendants, and leaves a safe resumable state.

## Inputs
`config/policy.json`, synthetic fixture, lifecycle JSONL, current execution tree, transcript/checkpoint snapshots, and implementation diff.

## Baseline
Before any fix, run the same synthetic fixture and record acknowledgement latency, effective-cancel latency, descendant drain latency, post-cancel side effects, orphan count, transcript validity, and resume behavior.

## Context
The control plane is distinct from model reasoning: interrupt delivery, cancellation propagation, side-effect fences, persistence, and replay are runtime invariants observable through events.

## Stages
1. **Observe** — map ingress → scheduler → active run → descendants → persistence/resume.
2. **Measure baseline** — inject interrupt while a safe long-running fixture is active.
3. **Diagnose** — identify the first missing/late lifecycle transition.
4. **Form hypothesis** — choose one root cause: queue priority, token propagation, side-effect fence, descendant ownership, transcript repair, or resume reconciliation.
5. **Implement** — make the smallest change preserving user control and data integrity.
6. **Measure again** — rerun the identical fixture and policy.
7. **Boundary fixtures** — test interrupt during tool, child/subagent, and post-tool/pre-persist boundary.
8. **Independent verify** — `subagents/interrupt-verifier.md` reviews evidence.
9. **Complete** only if all blocking invariants pass.

## Responsible agent
Runtime implementation owner for stages 1–7; independent Interrupt Verifier for stage 8.

## Tools
Synthetic fixture, event/log parser, process/subagent inventory, transcript validator, checkpoint dry-run resume, and `scripts/interrupt_liveness_guard.py`.

## Outputs
Before/after lifecycle reports, root-cause statement, implementation diff, test results, reviewer decision, and residual-risk record.

## Checkpoints
- Baseline captured before changing thresholds.
- Same policy used before and after.
- Side-effect fence is exercised explicitly.
- Descendant inventory includes processes and subagents.
- Transcript and resume checks are complete.
- Independent reviewer is not the implementation agent.

## Metrics
Ack latency, effective-cancel latency, drain latency, post-cancel side effects, orphans, transcript violations, replay violations, and recovery attempts.

## Retry policy
Transient fixture failure: maximum 2 retries. Root-cause remediation: maximum 2 attempts per hypothesis and maximum 3 distinct hypotheses per run. Each retry must introduce new evidence or a changed implementation.

## Stop conditions
- Immediate block on any post-cancel side effect.
- Immediate block when a dangerous descendant remains active after grace.
- Stop after bounded remediation attempts and escalate with evidence.
- Never extend deadlines simply to hide a control-path regression without documented capacity evidence and human approval.

## Failure path
Preserve sanitized event timeline, mark partial side effects ambiguous until reconciled, disable unsafe auto-resume for the affected path when feasible, and escalate to runtime owner.

## Verification
`Implemented`: cancellation change exists. `Measured`: lifecycle tests ran against the effective runtime. `Verified`: all fixtures meet deadlines and integrity rules, no post-cancel side effects/orphans exist, resume is safe, and independent review passes.

## Definition of Done
Evidence current; baseline exists; root cause identified; implementation measured; boundary fixtures pass; no post-cancel side effects; no orphans; transcript valid; resume does not replay canceled work; independent verification complete; no blocking issue remains.
