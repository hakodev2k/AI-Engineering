# Control Framework Mapping Rules

## Purpose
Ensure compliance obligations are translated into explicit, testable security controls rather than treated as documentation-only requirements.

## Scope
Applies to laws, regulations, contracts, internal policies, and security frameworks used to define compliance obligations.

## MUST
- Every in-scope obligation MUST map to one or more named controls, owners, systems, evidence sources, and validation methods.
- Control mappings MUST distinguish preventive, detective, corrective, and compensating controls where that distinction affects assurance.
- Conflicting obligations MUST be identified and escalated before implementation decisions are finalized.
- Control mappings MUST record assumptions and applicability decisions.

## MUST NOT
- Controls MUST NOT be declared compliant solely because a policy document exists.
- Framework identifiers MUST NOT be copied without verifying that the mapped control actually satisfies the requirement.
- Equivalent controls MUST NOT be assumed across environments without evidence.

## SHOULD
- Reuse canonical controls across multiple frameworks to reduce duplicated assurance work.
- Maintain traceability from obligation to control to evidence to finding.

## Exceptions
Any unmapped obligation requires documented rationale, risk, interim mitigation, target resolution date, and accountable approval.

## Verification
Review the control matrix, sample source obligations, inspect evidence links, and confirm each mapping has an owner and validation procedure.