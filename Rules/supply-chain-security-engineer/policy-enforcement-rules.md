# Supply-Chain Policy Enforcement Rules

## Purpose
Turn supply-chain requirements into consistent, reviewable gates that prevent unsafe artifacts from progressing through trusted release paths.

## Scope
Applies to policy-as-code, CI gates, registry admission, deployment admission, vulnerability thresholds, provenance rules, signing requirements, and exception handling.

## MUST
- Release-blocking policy MUST be version-controlled, reviewed, and traceable to an accountable owner.
- Policy evaluation MUST use artifact-specific evidence such as digest, provenance, scan results, signatures, or SBOM data.
- Critical policy failures MUST fail closed on designated protected release paths.
- Policy changes that weaken controls MUST receive explicit review appropriate to the affected risk.
- Policy engines MUST distinguish technical failure from policy denial so operators can respond correctly.

## MUST NOT
- Security gates MUST NOT be bypassed through undocumented environment variables, hidden flags, or manual artifact copying.
- Policies MUST NOT depend on mutable artifact names when immutable identity is available.
- Temporary bypasses MUST NOT become permanent by omission of expiry and ownership.

## SHOULD
- Policy decisions SHOULD produce machine-readable evidence and human-readable reasons.
- Enforcement SHOULD occur at multiple trust boundaries when one gate alone cannot contain risk.

## Exceptions
Exceptions require scope, rationale, risk, compensating controls, approver, expiration, and evidence of later revalidation.

## Verification
Review policy source, change history, gate logs, denial behavior, bypass permissions, exception records, and tests demonstrating unsafe artifacts are rejected.