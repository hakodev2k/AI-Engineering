# Security Risk Framework

## Finding versus risk

A finding is an observed condition supported by evidence. Risk combines a plausible threat event, affected asset, business or user impact, likelihood under the stated exposure, control effectiveness, and uncertainty. Do not convert a pattern match directly into a confirmed vulnerability.

## Finding record

Record identifier, title, affected scope, evidence reference, reproduction conditions, threat/abuse path, security property affected, impact, likelihood, severity, confidence, remediation, verification, owner, status, and disclosure constraints. Redact secret and personal-data values.

## Severity

- **Critical:** credible near-term path to catastrophic confidentiality, integrity, availability, safety, or uncontrolled privileged AI action; immediate coordination is required.
- **High:** credible exploitation can create material harm, broad exposure, privilege gain, sensitive disclosure, or major control bypass.
- **Medium:** meaningful security weakness with constrained exposure, prerequisites, or impact.
- **Low:** limited impact or defense-in-depth gap that still has a justified remediation outcome.

Severity is not certainty. Report confidence separately as high, medium, or low and state what evidence would change it.

## AI-specific analysis prompts

Consider untrusted instructions/content, model and retrieval data provenance, tool authorization, input/output validation, identity propagation, excessive agency, cross-tenant leakage, memory/state poisoning, unsafe code/content handling, model/prompt supply chain, monitoring/evaluation blind spots, denial of wallet/service, and human override/recovery.

## Risk treatment

Choose mitigate, avoid, transfer, or accept. Acceptance requires the accountable human owner, scope, rationale, duration or review trigger, compensating controls, monitoring, and residual severity. Verification must test the implemented control rather than merely restating the recommendation.
