# Workflow: Flaky Test Gate

## Trigger
A test fails unexpectedly, a rerun disagrees with a prior result, or an AI agent proposes retrying a failed test.

## Entry conditions
Original failure output and repository revision are available. A narrow test selector can be identified. Production access is not required.

## Inputs
Test id, original command/output, revision, changed files, test environment facts.

## Flow

```text
Failure detected
  ↓
Preserve first failure
  ↓
Narrow test target
  ↓
Bounded probe (max 5 by default)
  ↓
Classify
  ├─ consistent-failure → normal defect workflow
  ├─ tool-failure → repair environment, then one bounded probe
  ├─ flaky → investigate nondeterminism
  └─ passed → retain historical failure; verify broader context
                     ↓
              root-cause fix?
              ├─ yes → independent verification
              └─ no  → quarantine decision → human approval
```

## Stages
1. **Capture** — Workflow owner stores first failure and revision. Artifact: original failure log.
2. **Triage** — Flake Investigator follows `skills/triage-flaky-test.md`. Tool: `scripts/run_flake_probe.py`. Artifact: `.ai/flake-gate/<test>/result.json` and run logs.
3. **Classify** — Use only statuses from `schemas/flake-result.schema.json`.
4. **Investigate** — For `flaky`, test one hypothesis at a time; preserve experiment evidence. Maximum two hypothesis-changing experiment rounds after the initial probe. Each round still obeys the configured per-probe maximum.
5. **Remediate** — Prefer a root-cause fix. Any quarantine path follows `skills/quarantine-decision.md` and stops for approval before edits.
6. **Verify** — Verification Agent reviews the diff and reruns the narrow test with the configured bounded probe, then relevant surrounding tests once.
7. **Complete** — Produce the investigation report and final verification status.

## Checkpoints
- C1: first failure preserved before reruns.
- C2: pass/fail classification supported by evidence.
- C3: no automatic quarantine or assertion weakening.
- C4: independent verification completed after a fix.

## Retry rules
- Test probe: at most `max_probe_runs` per probe, default 5.
- Tool/environment failure: repair cause and retry the bounded probe once.
- Hypothesis experiments: at most two rounds; one controlled variable per round.
- Verification failure: return once to investigation with new evidence; if verification fails again, stop and escalate.

## Evidence preserved
Original failure, every probe stdout/stderr, exit codes, durations, revision, experiment changes, verification output, and approval record if applicable.

## Approval points
Explicit human approval is required before test quarantine/skip/ignore changes, weakening assertions, changing CI blocking semantics, increasing test timeouts globally, or changing shared infrastructure/configuration.

## Failure paths
- `consistent-failure`: exit this workflow and debug deterministic defect.
- `tool-failure`: preserve evidence; repair environment; one retry maximum.
- Insufficient evidence: `inconclusive`; stop rather than retry indefinitely.
- Approval denied: leave CI behavior unchanged and escalate.

## Stop conditions
Configured retry limits reached; production access required; quarantine approval missing; test selector cannot be isolated safely; repeated verification failure.

## Definition of Done
The original failure is preserved; classification has evidence; any fix/quarantine is scoped; required approval exists; relevant tests were run; independent verification status is `verified`; unresolved risk is documented; no blocking failure remains hidden.
