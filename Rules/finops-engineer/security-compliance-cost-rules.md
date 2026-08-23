# Security and Compliance Cost Rules

## Purpose
Prevent cost optimization from weakening mandatory security, privacy, resilience, or compliance controls.

## Scope
Security services, logging, retention, encryption, backups, network controls, identity, audit, regulatory storage, and compliance tooling.

## MUST
- Identify mandatory controls and data obligations before recommending cost reduction.
- Treat security and compliance requirements as explicit constraints in optimization analysis.
- Obtain security or compliance owner approval before changing controls with material protection or evidence impact.
- Preserve required auditability and retention evidence after optimization.

## MUST NOT
- Disable security monitoring, encryption, backups, access controls, or required logging merely to reduce spend.
- Shorten regulated retention without authoritative approval.
- Characterize mandatory controls as waste solely because they do not generate direct product revenue.

## SHOULD
- Optimize implementation efficiency while preserving the required control objective and assurance level.

## Exceptions
Equivalent alternative controls may replace existing controls when formally assessed and approved.

## Verification
Review control requirements, risk assessments, approvals, configuration diffs, audit evidence, and post-change security/compliance validation.