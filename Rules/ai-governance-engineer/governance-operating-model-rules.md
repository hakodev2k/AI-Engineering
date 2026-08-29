# Governance Operating Model Rules

## Purpose
Establish a durable governance operating model for AI systems so ownership, accountability, decision rights, and escalation paths are explicit before material risk is introduced.

## Scope
Applies to AI governance frameworks, role definitions, control ownership, policy enforcement, cross-functional review, and lifecycle accountability for AI-enabled products and internal systems.

## MUST
- Every governed AI system MUST have a named business owner, technical owner, risk owner, and operational owner, with responsibilities documented before production use.
- Governance controls MUST define who can approve, reject, defer, or escalate a use case at each lifecycle stage.
- Control ownership MUST be separated from implementation ownership when independent challenge is required.
- Governance requirements MUST be mapped to observable controls, required evidence, review frequency, and accountable reviewers.
- Material risk decisions MUST record rationale, alternatives considered, accepted residual risk, and the approving authority.
- Governance forums MUST distinguish advisory review from binding approval.
- Escalation criteria MUST be defined for unresolved safety, privacy, security, fairness, legal, regulatory, and operational risks.

## MUST NOT
- MUST NOT rely on informal team convention as the sole source of governance authority.
- MUST NOT allow a system owner to self-approve a high-risk exception when independent review is required.
- MUST NOT treat completion of a checklist as evidence that the underlying risk is controlled.
- MUST NOT create governance controls that cannot be verified or assigned to an accountable owner.

## SHOULD
- The operating model SHOULD minimize duplicate reviews by reusing trustworthy evidence across control domains.
- Low-risk use cases SHOULD follow a proportionate path that preserves mandatory safeguards without unnecessary bureaucracy.
- Governance responsibilities SHOULD align with existing security, privacy, architecture, compliance, and production processes where that improves accountability.

## Exceptions
Exceptions MUST identify the affected control, business reason, duration, compensating safeguards, residual risk, evidence, and approver. Permanent exceptions SHOULD be converted into an explicit policy decision rather than renewed indefinitely.

## Verification
Review governance charters, RACI or equivalent ownership records, approval matrices, exception registers, lifecycle gates, and sampled AI system records. Confirm that required evidence exists and that decisions are traceable to authorized reviewers.