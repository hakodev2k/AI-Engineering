# Privacy by Design Rules

## Purpose
Embed privacy constraints into architecture and defaults rather than relying on post-release remediation.

## Scope
Applies to new systems, material feature changes, data migrations, integrations, and platform capabilities involving personal data.

## MUST
- Privacy risks MUST be considered during design, before irreversible architecture or schema commitments are made.
- Default configurations MUST expose the least personal data necessary for the primary use case.
- Privacy controls MUST be enforced at system boundaries, not only through user-interface conventions.
- Designs MUST identify data flows, trust boundaries, processors, retention points, and deletion paths.
- Material privacy trade-offs MUST be documented with alternatives and residual risk.

## MUST NOT
- Privacy controls MUST NOT depend solely on operator memory or undocumented manual steps.
- A feature MUST NOT ship with intentionally overbroad data access while promising future minimization.
- Sensitive defaults MUST NOT be opt-out merely for implementation convenience when safer defaults are practical.

## SHOULD
- Privacy-preserving architecture patterns SHOULD be preferred when they meet functional and operational requirements.
- Reversible designs SHOULD be favored when uncertainty about future privacy requirements is material.

## Exceptions
Exceptions require documented rationale, risk, mitigations, planned verification, and accountable approval.

## Verification
Review architecture documents, threat models, defaults, data-flow diagrams, schema changes, access policies, and test evidence. Confirm privacy controls exist at enforceable technical boundaries.