# Streaming response cancellation gate

## Trigger
Streaming work continues after caller cancellation/disconnect, or a change touches a long-lived streaming path.

## Entry conditions
Repository and target path are known; non-destructive local verification is possible.

## Inputs
Target entry point, symptom/acceptance criteria, repository root, build/test commands.

## Stages
1. **Preflight** — confirm clean/understood workspace and identify source token.
2. **Scan** — run `python scripts/scan-streaming-cancellation.py <repo> --json`; preserve output.
3. **Trace** — use `skills/investigate-streaming-cancellation.md` to map token propagation and partial-output semantics.
4. **Plan** — list exact boundaries to change and tests to add. Public API changes require approval before editing.
5. **Implement** — propagate cancellation with the smallest safe diff; keep cleanup bounded.
6. **Test** — verify normal completion, pre-first-item cancellation, mid-stream cancellation, downstream-I/O cancellation, and shutdown when applicable.
7. **Independent verify** — `subagents/cancellation-verifier.md` reviews evidence without editing implementation.
8. **Complete** — emit verified status only if all blocking checks pass.

## Checkpoints
After trace, after implementation, and before completion.

## Retry rules
Maximum 2 implementation/test retries. Retry only build/test failures caused by the proposed change or transient local tool failures. Preserve scanner output, failing command, stack trace, and diff each attempt. Escalate after the second failure.

## Approval points
Breaking public API changes, production configuration/timeouts, infrastructure changes, destructive data actions, and security weakening.

## Failure paths
Missing evidence -> blocked. Dependency cannot cancel -> document containment and residual risk. Permission/tool failure -> retry once if transient, otherwise blocked. Business semantics unclear -> do not guess; preserve open question and stop unsafe edits.

## Definition of Done
Source token identified; affected call chain traced; scanner clean or findings justified; required tests pass; cancellation is not converted to success; diff contains no unrelated changes; approvals obtained where required; verifier status is `verified`; residual risks documented.
