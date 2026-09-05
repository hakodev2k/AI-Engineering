# Workflows

## Quality review — READ
`sonarqube.project.search` → `sonarqube.branch.list` → `sonarqube.quality_gate.status.get` → `sonarqube.issue.search` → `sonarqube.rule.get`.

## Security review — READ → HIGH_RISK
Search and inspect hotspots first. A status change executes only after a human configures the exact fingerprint `sonarqube.security_hotspot.status.change:<hotspotKey>:<status>:<resolution>`.

## Issue triage — READ → WRITE
Search the issue and review its rule, then approve `sonarqube.issue.status.change:<issueKey>:<status>` when write approvals are enabled.
