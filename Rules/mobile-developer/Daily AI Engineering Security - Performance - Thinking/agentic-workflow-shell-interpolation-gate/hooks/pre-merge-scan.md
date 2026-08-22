# Hook: Pre-Merge Workflow Security Scan

## Trigger
Before completing a change that touches `.github/workflows/*.yml`, `.github/workflows/*.yaml`, or a composite action used by an agentic workflow.

## Preconditions
Repository snapshot and `config/policy.json` are available; Python 3.9+ is installed.

## Action
Run:

```bash
python scripts/scan_github_actions.py . --policy config/policy.json --json-out workflow-security-findings.json
```

## Expected result
Exit code `0`, valid JSON report, and no blocking findings. Medium/review findings may remain only with explicit human disposition.

## Failure behavior
Exit code `2` means invalid input/config and blocks completion. Exit code `3` means blocking security findings and blocks completion. Preserve the JSON evidence; do not auto-suppress findings.

## Blocking
Yes. A hook failure blocks completion unless a scoped, reviewed exception identifies the exact finding and compensating control.
