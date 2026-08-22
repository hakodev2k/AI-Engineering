# Code Review Rules

## Purpose
Set Senior-level review standards for infrastructure, pipeline, automation, and operational code.

## Scope
Applies to infrastructure-as-code, CI/CD definitions, deployment automation, scripts, platform configuration, and policy code.

## MUST
- Reviews MUST evaluate behavior, blast radius, security, recoverability, observability, and compatibility—not only syntax.
- High-impact infrastructure changes MUST include plan or preview evidence where supported.
- Reviewers MUST verify that secrets, privileged permissions, public exposure, and destructive actions are intentional and controlled.
- Changes introducing new operational failure modes MUST include corresponding validation or monitoring.
- Review feedback that identifies safety or correctness risks MUST be resolved or explicitly accepted by an authorized reviewer.

## MUST NOT
- MUST NOT approve changes whose effect cannot be understood from the available diff and supporting evidence.
- MUST NOT treat generated infrastructure plans as trustworthy without checking the actual proposed actions.
- MUST NOT approve permanent bypasses of security or quality gates without explicit justification and approval.

## SHOULD
- Prefer focused changes that can be reviewed independently.
- Request domain specialists for networking, security, data, or platform changes when risk exceeds reviewer expertise.

## Exceptions
Expedited review during incidents is allowed only with recorded context and mandatory follow-up review.

## Verification
Inspect pull-request history, review comments, plan artifacts, policy checks, security findings, and evidence that blocking feedback was addressed.