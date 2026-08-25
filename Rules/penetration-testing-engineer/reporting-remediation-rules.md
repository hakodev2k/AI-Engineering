# Reporting and Remediation Rules

## Purpose
Turn validated security findings into accurate, actionable remediation decisions.

## Scope
Applies to technical findings, executive communication, remediation guidance, and report quality.

## MUST
- MUST state affected assets, preconditions, evidence, impact, reproduction steps, and remediation guidance for each material finding.
- MUST clearly distinguish confirmed facts, reasonable inferences, and untested possibilities.
- MUST make remediation address the root security control failure rather than only the demonstrated payload.
- MUST redact secrets and unnecessary sensitive data.
- MUST communicate urgent findings through the agreed escalation channel before waiting for final-report delivery.
- MUST ensure recommendations are technically feasible or explicitly identify trade-offs and dependencies.

## MUST NOT
- MUST NOT include exploit detail beyond what authorized recipients need when it increases unnecessary exposure.
- MUST NOT use vague remediation such as "improve security" without an actionable control objective.
- MUST NOT claim remediation is complete without verification evidence.
- MUST NOT conceal limitations that materially affect confidence.

## SHOULD
- SHOULD provide prioritized remediation options when multiple valid controls exist.
- SHOULD explain systemic patterns when several findings share a root cause.

## Exceptions
Reduced technical detail requires agreement on audience and a secure path for authorized maintainers to obtain necessary evidence.

## Verification
Peer-review findings against raw evidence, reproduce critical issues, inspect redactions, validate remediation against the failure mode, and reconcile all report assets with scope.