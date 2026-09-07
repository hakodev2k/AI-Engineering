# Sensitive Data and Privacy Rules

## Purpose
Minimize collection and exposure of personal, customer, regulated, or confidential data during security research.

## Scope
Applies to data encountered through testing, logs, dumps, screenshots, packet captures, storage analysis, account access, vulnerability reproduction, and report preparation.

## MUST
- Research MUST collect only the data required to validate the security hypothesis.
- Real user or customer data encountered unintentionally MUST trigger minimization: stop unnecessary access, preserve only required evidence, and follow applicable incident or privacy procedures.
- Reports MUST redact or substitute personal and confidential values unless the value itself is essential evidence.
- Sensitive datasets used for research MUST have documented authorization, purpose, access controls, and retention limits.
- Cross-border, regulated, or contractually restricted data handling MUST follow applicable requirements.
- Test fixtures SHOULD use synthetic data, but when real data is necessary the researcher MUST document why synthetic data is insufficient.
- Research evidence containing sensitive data MUST be encrypted or protected according to organizational requirements in transit and at rest.
- Deletion obligations MUST be honored after the evidence need and required retention period end.

## MUST NOT
- MUST NOT browse unrelated records after sufficient proof exists.
- MUST NOT copy broad datasets merely to demonstrate that broad access is possible.
- MUST NOT publish identifiable personal data as part of vulnerability disclosure.
- MUST NOT move sensitive evidence to personal devices, public services, or unapproved storage.
- MUST NOT use captured data for unrelated analytics, testing, training, or demonstrations.

## SHOULD
- Prefer record counts, hashes, synthetic substitutes, or narrowly redacted examples over complete records.
- Document accidental sensitive-data exposure separately from deliberate test access.
- Consult privacy or legal owners when data classification or retention obligations are unclear.

## Exceptions
Additional data collection requires a documented technical necessity, proportionality analysis, restricted access, defined retention, and explicit approval from the relevant data or privacy authority.

## Verification
Review evidence samples, storage permissions, report redactions, collection volume, retention records, and access logs. Confirm the quantity and sensitivity of collected data are proportionate to the security conclusion.