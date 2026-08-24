# Hook — Pre-Release Oracle Probe

## Trigger
Before releasing a build that changes guardrails, denial text, system prompts, tool/connector definitions or authorization/error behavior.

## Preconditions
A JSONL probe transcript and reviewed protected-surface config exist.

## Action
Run the deterministic disclosure audit and then the unit tests.

## Script / command
```bash
python3 scripts/oracle_probe_audit.py evidence/probe-transcript.jsonl --config config/protected-surface.json --report evidence/oracle-audit.json
python3 -m pytest -q tests/test_oracle_probe_audit.py
```

Hosts may use different transcript/config paths, but both inputs must be versioned evidence for the release.

## Expected result
Both commands exit 0. The report contains `status: pass` and no violations.

## Failure behavior
Any exit code 2 blocks completion and requires disclosure remediation or explicit security-owner reclassification of the matched surface. Exit code 3 blocks completion because evidence/configuration is invalid.

## Blocks completion
Yes. The hook must never be bypassed by broadening permissions, removing required protected entries, or disabling the underlying guardrail.