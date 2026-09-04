# Privacy Compliance Evidence Rules

## Purpose
Ensure privacy assertions are supported by current, reviewable engineering evidence rather than confidence or documentation alone.

## Scope
Applies to privacy reviews, audits, production readiness, control attestations, risk acceptance, and remediation closure.

## MUST
- Claims that a privacy control is effective MUST reference verifiable evidence such as tests, configuration, access policies, logs, data-flow inspection, or runtime behavior.
- Evidence MUST identify the system scope, environment, control version, and observation date when those factors affect validity.
- Control failures and known limitations MUST be recorded alongside successful evidence.
- Remediation items MUST remain open until the corrective control is implemented and verified.
- Significant privacy decisions MUST retain rationale, alternatives considered, risk, and accountable approval where required.

## MUST NOT
- Agent confidence, developer assertion, or design intent MUST NOT be treated as proof that a control works.
- Screenshots or isolated samples MUST NOT be generalized beyond what they actually demonstrate.
- Audit evidence MUST NOT contain unnecessary sensitive personal data or secrets.

## SHOULD
- Evidence collection SHOULD be automated and reproducible where practical.
- High-risk controls SHOULD have freshness expectations so stale evidence cannot silently satisfy current review.

## Exceptions
Where deterministic evidence is impossible, the reviewer MUST document the inspection method, uncertainty, compensating evidence, and approval basis.

## Verification
Inspect control-to-evidence mappings, CI artifacts, configuration snapshots, test results, audit logs, review records, and remediation status. Confirm evidence is current, scoped, and sufficient for each claim.