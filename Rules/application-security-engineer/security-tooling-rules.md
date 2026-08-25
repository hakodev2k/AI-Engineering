# Security Tooling Rules

## Purpose
Use SAST, DAST, SCA, secret scanning, IaC scanning, and related tools as reliable evidence sources without confusing tool output with security truth.

## Scope
Applies to automated security scanners, CI gates, baselines, suppressions, custom rules, and finding ingestion.

## MUST
- Security tools MUST have documented scope, ownership, execution point, and finding-handling process.
- Release-blocking rules MUST be tuned enough that teams can distinguish actionable failures from known accepted noise.
- Suppressions MUST record rationale, scope, evidence, owner, and review/expiry criteria for material findings.
- Scanner configuration and rule changes that reduce detection coverage MUST be reviewed as security changes.
- High-confidence findings affecting exposed or privileged code paths MUST receive timely human triage.

## MUST NOT
- MUST NOT treat a clean scanner result as proof that an application is secure.
- MUST NOT globally disable a rule because one project has a false positive when narrower suppression is possible.
- MUST NOT hide tool failures by converting scanner execution errors into passing security checks.
- MUST NOT expose source, secrets, or sensitive findings to unapproved external scanning services.

## SHOULD
- SHOULD prioritize tools and rules that provide reproducible findings with low remediation friction.
- SHOULD measure useful signal, recurrence, time-to-triage, and escaped vulnerability classes rather than raw finding count alone.

## Exceptions
Exceptions require documented gap, alternative control, risk, owner, duration, and security approval.

## Verification
Inspect CI configuration, scanner health, rule sets, suppression metadata, sample findings, trend metrics, access controls, and evidence that failed scans fail visibly.