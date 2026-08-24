# Red Teaming Rules

## Purpose
Use controlled adversarial testing to discover realistic safety failures before attackers or users do.

## Scope
Covers model behavior, agents, tool use, prompt injection, jailbreaks, data exposure, and abuse workflows.

## MUST
- Define authorized scope, test environment, handling rules, escalation paths, and stop conditions before testing.
- Prioritize attacks by plausible impact and exploitability.
- Preserve reproducible evidence for material findings while protecting sensitive exploit details.
- Retest fixes against original and variant attacks.

## MUST NOT
- Conduct destructive or production-impacting tests without explicit authorization.
- Publish actionable high-severity exploit details before remediation coordination.
- Treat a single failed exploit attempt as proof of robustness.

## SHOULD
- Use diverse attacker strategies and independent testers for high-risk releases.
- Convert validated findings into durable regression tests where safe.

## Exceptions
Production testing requires explicit approval, blast-radius controls, monitoring, rollback readiness, and defined emergency contacts.

## Verification
Review authorization, test logs, findings, severity rationale, remediation evidence, and retest results.
