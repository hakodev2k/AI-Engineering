# Privacy and Compliance Rules

## Purpose
Ensure architecture respects legal, contractual, privacy, residency, audit, and retention obligations.

## Scope
Covers personal data, regulated data, audit trails, retention, deletion, consent, residency, and compliance controls.

## MUST
- Regulated or sensitive data flows MUST identify classification, purpose, storage location, retention, access, and deletion behavior.
- Compliance requirements MUST be translated into concrete technical controls and evidence expectations.
- Data minimization MUST be applied to collection, replication, telemetry, and third-party sharing.
- Audit requirements MUST define event coverage, integrity, retention, and access controls.
- Cross-region or cross-border data movement MUST be reviewed when residency restrictions may apply.

## MUST NOT
- MUST NOT infer legal compliance from use of a compliant cloud provider alone.
- MUST NOT collect or retain sensitive data without defined purpose and lifecycle.
- MUST NOT bypass compliance controls for delivery speed without authorized risk acceptance.

## SHOULD
- Engage legal/security/privacy specialists for ambiguous obligations.
- Prefer architectures that make deletion and access review operationally feasible.

## Exceptions
Only authorized governance owners may approve exceptions, with documented compensating controls.

## Verification
Review data inventories, retention policies, access logs, deletion tests, compliance mappings, residency settings, audit evidence, and approvals.