# Architecture Review and Verification Rules

## Purpose
Require cloud architecture claims and production readiness decisions to be supported by inspectable evidence before material risk is accepted.

## Scope
Applies to architecture reviews, design gates, proofs of concept, readiness reviews, exception review, and post-implementation validation.

## MUST
- Significant architectures MUST be reviewed against functional requirements, security, reliability, performance, data, operations, cost, compliance, and migration constraints relevant to the workload.
- Review findings MUST distinguish verified facts, assumptions, unresolved risks, and decisions requiring approval.
- Critical architecture claims MUST cite evidence such as configuration inspection, tests, benchmarks, failure exercises, cost data, or operational telemetry.
- Unresolved high-impact risks MUST have an owner, disposition, and deadline or explicit risk acceptance before production release.
- Post-implementation verification MUST confirm that the deployed system still satisfies the assumptions and controls on which approval depended.

## MUST NOT
- MUST NOT approve architecture solely from diagrams, vendor presentations, or agent confidence.
- MUST NOT close review findings without evidence of remediation or explicit risk acceptance.
- MUST NOT treat successful provisioning as proof of production readiness.

## SHOULD
- Use lightweight review for reversible low-risk changes and deeper review for irreversible or high-blast-radius decisions.
- Revalidate architecture after material workload, regulatory, threat, or platform changes.

## Exceptions
Exceptions require documented urgency, skipped evidence, resulting risk, accountable approver, and a scheduled follow-up review.

## Verification
Inspect review records, requirement traceability, test and benchmark artifacts, risk registers, approvals, deployment configuration, and post-release telemetry.