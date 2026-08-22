# Cloud and Infrastructure Rules

## Purpose
Ensure infrastructure choices are secure, operable, reproducible, and aligned with workload characteristics.

## Scope
Covers cloud platforms, networking, compute, containers, serverless, storage, identity, and infrastructure-as-code.

## MUST
- Production infrastructure MUST be reproducible through infrastructure-as-code or equivalent controlled configuration.
- Network boundaries, ingress, egress, private connectivity, and exposed endpoints MUST be explicitly documented for critical systems.
- Service selection MUST consider quotas, regional availability, operational model, security, and recovery.
- Environment differences MUST be intentional and documented.
- Infrastructure changes with production impact MUST be reviewed, validated, and reversible where practical.

## MUST NOT
- MUST NOT expose management endpoints publicly without explicit security justification.
- MUST NOT depend on undocumented manual configuration for critical recovery.
- MUST NOT choose Kubernetes or serverless solely because of popularity.

## SHOULD
- Prefer managed services when they meet requirements and reduce undifferentiated operational work.
- Use policy-as-code or automated guardrails for repeatable controls.

## Exceptions
Temporary manual infrastructure requires documented state and migration to controlled configuration.

## Verification
Inspect IaC, network diagrams, platform quotas, security policies, environment diffs, deployment pipelines, and recovery documentation.