# Privileged Response Actions Rules

## Purpose
Control high-risk security operations actions that can materially affect production, access, or evidence.

## Scope
Account suspension, credential rotation, production configuration changes, broad blocking, destructive cleanup, and other privileged response actions.

## MUST
- Privileged actions MUST identify operator, target, reason, incident reference, expected effect, and verification method.
- High-risk or irreversible actions MUST require accountable human approval unless explicitly covered by an approved emergency playbook.
- Actions MUST use least-privileged credentials and approved administrative paths.
- Resulting state MUST be verified and recorded after execution.

## MUST NOT
- MUST NOT use shared or unidentified administrator credentials when individual accountability is available.
- MUST NOT perform destructive cleanup solely to accelerate incident closure.
- MUST NOT weaken security controls to simplify response without explicit risk approval.

## SHOULD
- Privileged actions SHOULD be reversible, time-bounded, and peer-reviewed where incident urgency allows.

## Exceptions
Emergency execution before approval requires material-risk justification, complete audit logging, and retrospective review.

## Verification
Review privileged-session logs, approvals, incident records, change history, resulting state, and retrospective reviews.