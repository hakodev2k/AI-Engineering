# Security Posture Rules

## Purpose
Continuously reduce exploitable Azure configuration and platform risk.

## Scope
Defender for Cloud, secure score, vulnerability findings, recommendations, resource hardening, and security baselines.

## MUST
- Triage security findings by exploitability, exposure, asset criticality, and evidence.
- Assign owners and remediation expectations to material findings.
- Maintain secure baseline configurations for production resource classes.
- Validate remediation rather than closing findings from intent alone.
- Escalate critical exposed weaknesses promptly.

## MUST NOT
- Disable security recommendations or scanners merely to improve reported scores.
- Treat secure score as proof of security.
- Suppress a finding permanently without documented risk acceptance and review.

## SHOULD
- Automate baseline enforcement for deterministic controls.
- Track recurring root causes across teams and templates.

## Exceptions
Accepted findings require scope, rationale, compensating controls, owner, expiry, and appropriate approval.

## Verification
Review Defender findings, policy compliance, vulnerability evidence, suppression records, remediation validation, and baseline drift.