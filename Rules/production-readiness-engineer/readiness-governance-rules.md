# Readiness Governance Rules
## Purpose
Establish a repeatable Senior-level decision system for determining whether a production-bound change is ready.
## Scope
Software, infrastructure, configuration, data changes, integrations, migrations, and launches.
## MUST
- Every production-bound change MUST have an explicit readiness owner.
- Readiness criteria MUST be defined before final approval and cover functional, reliability, security, operational, data, and recovery concerns when relevant.
- Evidence, assumptions, open questions, and accepted risks MUST be clearly distinguished.
- Failed mandatory criteria MUST block approval unless an authorized risk owner explicitly accepts the exception.
- Scope changes after review MUST trigger re-evaluation of affected criteria.
## MUST NOT
- Readiness MUST NOT be inferred only from passing tests, code review, schedule pressure, or personal confidence.
- Mandatory gates MUST NOT be silently waived.
## SHOULD
- Use risk-tiered readiness criteria so higher-impact changes require stronger evidence.
- Record rationale for disputed or high-risk decisions.
## Exceptions
Exceptions require reason, context, evidence, alternatives considered, residual risk, mitigation, owner, and approval when required.
## Verification
Inspect the readiness record, linked evidence, scope diff, risk register, and approvals.