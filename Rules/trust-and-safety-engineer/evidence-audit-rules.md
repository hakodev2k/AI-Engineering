# Evidence and Audit Rules

## Purpose
Ensure consequential trust-and-safety decisions can be reconstructed, reviewed, challenged, and improved using reliable evidence.

## Scope
Applies to case evidence, decision provenance, audit logs, reason codes, investigative notes, and quality reviews.

## MUST
- Consequential enforcement decisions MUST preserve the policy version, evidence references, decision reason, decision actor or system, timestamp, and resulting action.
- Evidence provenance MUST distinguish original source data, derived signals, reviewer interpretation, and later-added information.
- Audit records MUST be tamper-resistant enough for the risk level and access-controlled against unauthorized modification or disclosure.
- Investigative conclusions MUST distinguish verified facts from hypotheses, inference, and model output.
- High-impact automated decisions MUST retain enough decision context to support human review without requiring disclosure of sensitive anti-abuse internals to unauthorized parties.
- Audit retention MUST align with legal, privacy, safety, and operational requirements, with documented deletion or archival rules.
- Material control changes MUST leave a reviewable trail connecting rationale, approval, implementation, and validation evidence.

## MUST NOT
- MUST NOT treat agent, model, or analyst confidence as evidence by itself.
- MUST NOT overwrite prior decision records to make a later outcome appear to have been the original decision.
- MUST NOT fabricate, backfill, or infer missing evidence without marking its provenance and uncertainty.
- MUST NOT expose sensitive investigative methods, reporter identities, or private data through audit access beyond legitimate need.

## SHOULD
- Audit tooling SHOULD support chronological reconstruction of complex cases and incidents.
- Evidence identifiers SHOULD remain stable across appeals and remediation workflows.
- Quality reviews SHOULD sample both confirmed abuse and legitimate cases to detect asymmetric decision defects.

## Exceptions
Emergency response MAY operate with temporarily incomplete documentation when immediate harm containment is required. Missing records MUST be completed as soon as operationally safe, and the exception MUST itself be recorded.

## Verification
Inspect sampled enforcement records, audit permissions, provenance fields, policy-version links, incident timelines, appeal cases, and retention configuration. Confirm a reviewer can reconstruct why representative high-impact decisions occurred and identify what evidence was known at the time.