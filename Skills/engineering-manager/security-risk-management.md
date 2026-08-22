# Security Risk Management

## Purpose
Integrate security risk into engineering decisions, ownership, planning, and delivery without requiring the manager to replace security specialists.

## When to use
Use for sensitive features, architecture changes, vulnerability remediation, access changes, vendor integrations, and security findings affecting engineering priorities.

## Inputs
Threat models, vulnerability findings, data classification, architecture, identity model, compliance obligations, incident history, and remediation options.

## Context to inspect
Inspect asset sensitivity, exploitability, blast radius, existing controls, internet exposure, privileges, dependency risk, and remediation lead time.

## Core knowledge
Security decisions are risk decisions. Severity labels alone are insufficient; context determines exposure. Defense in depth, least privilege, secure defaults, and reducing attack surface are durable principles.

## Procedure
1. Clarify the asset, threat, and potential impact.
2. Validate the finding or risk with appropriate specialists when needed.
3. Assess exposure, exploitability, existing controls, and affected scope.
4. Prioritize remediation relative to business and operational risk.
5. Choose mitigation, redesign, isolation, monitoring, or explicit acceptance.
6. Assign accountable engineering ownership and deadline.
7. Include regression tests or automated controls where feasible.
8. Track temporary mitigations and exceptions.
9. Verify remediation independently where risk warrants it.
10. Feed recurring classes of findings into engineering standards and training.

## Decision points
Escalate high-impact or uncertain risks to security specialists. Prefer eliminating vulnerability classes over repeatedly patching instances when feasible.

## Common failure patterns
Treating security as a final review, accepting risk without authority, prioritizing only CVSS, permanent temporary exceptions, and remediation without verification.

## Verification
Verify the control addresses the actual threat path, affected assets are covered, tests or evidence confirm remediation, and residual risk has an authorized owner.

## Expected output
A prioritized security-risk decision with mitigation, ownership, verification evidence, and residual risk.

## Stop conditions
Escalate immediately for active exploitation, suspected breach, regulated notification requirements, or risk acceptance beyond delegated authority.