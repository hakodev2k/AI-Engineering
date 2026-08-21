# Secret Exposure Response Workflow

## Trigger
A credential detector, reviewer, coding agent, CI job, or developer reports a possible secret in repository content.

## Entry conditions
Repository root is readable, target scope is known, and the workflow can execute non-destructive local commands.

## Inputs
Repository root, optional changed-file scope, scanner configuration, optional allowlist, relevant build/test commands.

## Flow
```text
Trigger
  ↓
Capture repository state
  ↓
Deterministic scan
  ↓
Classify findings
  ↓
Assess exposure surface
  ↓
Plan smallest remediation
  ↓
Approval checkpoint (if rotation/history/prod action is needed)
  ↓
Implement safe source/config change
  ↓
Re-scan + test/build + diff review
  ↓
Independent verification
  ↓
Complete / blocked
```

## Stages
### 1. Baseline — workflow owner
Run `git status --short`; record branch/commit when available. Do not alter the working tree.

### 2. Scan — workflow owner
Run `scripts/scan-secrets.py`. Store its JSON report outside tracked source by default or in the CI artifact area.

### 3. Triage — workflow owner
Use `skills/secret-exposure-triage.md`. Separate facts, hypotheses, and decisions. Determine whether exposure exists only locally or also in history, CI, PRs/issues, artifacts, or deployed configuration.

### 4. Approval checkpoint — human
Required before credential rotation/revocation, history rewriting/force push, production config or secret-store changes, deletion of remote artifacts, or weakening security controls. If approval is absent, mark `blocked` or complete only the safe local remediation while documenting unresolved exposure.

### 5. Remediation — implementation agent/tool
Make the smallest code/config change that removes the embedded value and uses the project's established secret mechanism. Do not introduce a new secret manager unless required.

### 6. Validation — workflow owner
Re-scan; run relevant build/tests; run `git diff --check`; inspect changed-file list.

### 7. Independent verification — Secret Verification Agent
Follow `subagents/secret-verifier.md`. The verifier must not be the sole implementation actor.

## Produced artifacts
- Scanner JSON report.
- Redacted triage summary.
- Approval request if needed.
- Repository patch, if safe remediation is possible.
- Verification result.

## Checkpoints
- After initial scan: findings are redacted and classified.
- Before dangerous action: explicit approval exists.
- After remediation: scanner and relevant tests/build run.
- Before completion: independent verification is `passed`.

## Retry rules
- Scanner/tool transient failure: maximum 2 retries.
- Build/test failure after remediation: maximum 1 fix-and-retest cycle when evidence points to the patch.
- Verification failure: maximum 1 remediation cycle, then escalate.
- Permission/approval failure: no retry; stop and escalate.

Preserve stderr, command exit codes, the previous report, and diff evidence across retries.

## Failure paths
- **Transient tool failure:** retry within bound, then `blocked`.
- **Validation failure:** preserve report and return to remediation once.
- **Permission failure:** stop without privilege escalation.
- **Historical/remote exposure:** local cleanup may continue, but completion status must retain the unresolved exposure until approved actions are performed.
- **Suspected active credential:** do not validate it by making unauthorized provider calls.

## Stop conditions
Approval required but unavailable; retry budget exhausted; raw-secret handling would be necessary; environment cannot execute verification; or remediation would require an unrelated architecture change.

## Definition of Done
- Initial evidence was captured and classified.
- No blocking high/critical secret remains in the verified scan scope, except explicitly documented approved exceptions.
- No raw secret is present in generated reports.
- Relevant tests/build pass when source behavior changed.
- Diff check passes and unintended changes are absent.
- Independent verification passed.
- Required approvals were obtained for any dangerous actions actually performed.
- Any history, CI, artifact, PR/issue, or deployed exposure remaining is explicitly documented as risk and not represented as resolved.
