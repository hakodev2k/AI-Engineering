# Policy and Compliance

## Purpose
Translate mandatory infrastructure controls into reviewable and preferably automated guardrails.

## Scope
Policy-as-code, organizational standards, regulatory controls, tagging, regions, encryption, and prohibited configurations.

## MUST
- Mandatory controls MUST be identified before design and encoded as automated policy where practical.
- Policy failures MUST identify the violated control and affected resource.
- Exceptions to mandatory controls MUST be time-bounded, owned, documented, and approved by the appropriate authority.
- Compliance evidence MUST be retained according to applicable policy.

## MUST NOT
- Policy checks MUST NOT be disabled merely to obtain a green pipeline.
- Passing automated policy MUST NOT be claimed as complete compliance when required human/process controls remain.
- Generic modules MUST NOT silently bypass organizational constraints.

## SHOULD
- Policies SHOULD favor clear, deterministic checks and actionable diagnostics.
- Preventive controls SHOULD be complemented by drift/detective controls where out-of-band changes are possible.

## Exceptions
Document control objective, reason, compensating controls, risk, owner, expiry, verification, and approval.

## Verification
Inspect policy definitions, CI enforcement, exception registers, cloud configuration, audit findings, evidence retention, and sampled plans for required controls.