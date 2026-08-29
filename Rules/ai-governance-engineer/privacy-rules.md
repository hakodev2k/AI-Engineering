# AI Privacy Rules

## Purpose
Protect personal data and privacy rights throughout AI system design, deployment, operation, and retirement.

## Scope
Applies to personal data in prompts, training, fine-tuning, retrieval, telemetry, user feedback, generated outputs, profiling, automated decisions, and vendor processing.

## MUST
- Personal-data processing MUST have a documented purpose, authorized basis, data categories, recipients, retention period, and applicable user rights before production use.
- AI systems MUST collect and retain only personal data necessary for the approved purpose.
- Sensitive personal data MUST receive enhanced access, logging, retention, and review controls.
- Privacy impact MUST be reassessed when purpose, data category, jurisdiction, model behavior, vendor, or automation level changes materially.
- User deletion, correction, access, or objection obligations MUST be operationally implementable where applicable.
- Prompts, outputs, telemetry, and feedback MUST be classified according to the personal data they can contain, not merely their storage location.

## MUST NOT
- MUST NOT repurpose personal data for training, evaluation, personalization, or analytics without confirmed authorization.
- MUST NOT expose personal data in logs, traces, debugging artifacts, or evaluation datasets beyond approved need.
- MUST NOT assume de-identification is effective without evaluating realistic re-identification risk.
- MUST NOT use model-generated inferences about individuals as established facts without appropriate evidence and review.

## SHOULD
- Privacy-preserving alternatives SHOULD be preferred when they achieve the same objective with less data exposure.
- Data retention SHOULD be technically enforced rather than dependent only on manual cleanup.
- Privacy testing SHOULD include prompt leakage, memorization, retrieval leakage, and cross-user isolation scenarios when relevant.

## Exceptions
Exceptions MUST document necessity, affected data, duration, controls, residual risk, and approval from the appropriate privacy authority. Production shortcuts that bypass privacy review are not valid exceptions.

## Verification
Inspect data-flow diagrams, privacy assessments, retention settings, access controls, vendor terms, deletion workflows, logs, test evidence, and sampled system behavior. Confirm declared privacy controls match implementation.