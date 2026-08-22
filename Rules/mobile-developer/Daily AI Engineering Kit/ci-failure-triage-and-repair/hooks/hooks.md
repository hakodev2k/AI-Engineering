# Hooks

Adapt commands to your agent/tool. Hooks describe portable trigger contracts.

| Hook | Trigger | Action | Command | Failure behavior |
|---|---|---|---|---|
| PreTriage | CI evidence received | Normalize log and redact common credential assignment patterns | `python scripts/normalize-ci-log.py ci.log --output ci.normalized.log` | Stop if input cannot be read or output cannot be produced |
| PostTriage | Manifest created/updated | Validate structure and invariants | `python scripts/verify-failure-manifest.py failure-manifest.json` | Block repair on validation failure |
| PreEdit | Before first repair edit | Re-run manifest validator and confirm selected action is `repair` | same validator | Block editing if gate is not repair-authorized |
| PreVerify | After repair | Inspect diff and run project-specific targeted command | configure locally | Stop on unexplained changed files or deterministic failure |
| PreComplete | Before success | Validate final manifest; run required build/tests | validator + repository commands | Never declare verified if any required check fails |

## Recommended repository adapters
Add commands beneath this section after installation, for example `dotnet test`, `npm test`, `pytest`, or project-specific lint/build commands. Do not invent commands if the repository does not define them.

## Test failure behavior
A deterministic test failure returns to triage with the new evidence. Transient command failures may be retried at most twice. Retry counters never reset within the same run.
