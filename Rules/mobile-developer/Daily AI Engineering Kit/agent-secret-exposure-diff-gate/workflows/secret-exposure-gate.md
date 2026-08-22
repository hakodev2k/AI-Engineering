# Secret Exposure Gate Workflow

## Trigger
Run after agent edits, before commit, before pull-request preparation, and whenever generated content may contain credentials.

## Entry conditions
Git repository is available; changed files are inspectable; policy exists; Python 3.10+ and PyYAML are installed.

## Inputs
Working-tree or staged diff, `config/secret-policy.yaml`, optional `.secret-scan-allowlist.json`.

## Stages
1. **Context** — workflow owner identifies intended commit scope and repository secret conventions.
2. **Deterministic scan** — run `python scripts/secret_diff_gate.py --policy config/secret-policy.yaml --output secret-scan-result.json`; use `--staged` for commit verification.
3. **Investigation** — Secret Investigator classifies each blocking finding without exposing values.
4. **Remediation** — implementation owner replaces confirmed literals with external configuration and adjusts tests/fixtures.
5. **Build/test** — execute project-specific checks affected by remediation.
6. **Rescan** — rerun the exact scanner scope.
7. **Independent verification** — Independent Verifier checks scan result, diff, tests and exception evidence.
8. **Complete** — only `verified` may proceed to commit/PR.

## Checkpoints
- Scanner command completed with result JSON.
- Blocking findings are classified.
- Remediation diff is limited to required files.
- Tests/build evidence exists where code changed.
- Final scan is clean or narrowly approved.

## Retry rules
- Scanner/environment transient failure: maximum 1 retry after correcting environment.
- Remediation causing build/test failure: maximum 1 corrective retry.
- A second failure in the same class stops the workflow and preserves command output.

## Approval points
Explicit human approval is required before production secret rotation, secret-store/CI permission changes, Git history rewriting, force push, detector weakening, or adding a high/critical exception when safer remediation exists.

## Failure paths
- Tool/permission failure: stop, preserve stderr and command.
- Confirmed secret already pushed: stop and escalate for rotation/history response.
- Unresolved high/critical finding: status `blocked`.
- Approval-required action: status `needs-approval`.

## Definition of Done
The exact intended diff scope scans clean; required tests/build pass; no secret values appear in reports; no unintended changes remain; verifier returns `verified`; no blocking approval remains.
