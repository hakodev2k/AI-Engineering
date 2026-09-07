# Go No-Go Rules

## Purpose
Make the final production decision explicit, evidence-based, accountable, and resistant to schedule pressure.

## Scope
Applies to final release authorization and continuation decisions at material rollout checkpoints.

## MUST
- Go/no-go criteria MUST be agreed before the decision point and include mandatory gates, unresolved risks, production health, dependency readiness, staffing, and recovery readiness.
- The final decision MUST identify the accountable human decision authority and the exact release candidate being considered.
- Open blockers and approved exceptions MUST be presented explicitly with owners and residual risk.
- A go decision MUST be recorded with evidence sufficient to reconstruct why execution was authorized.
- Material deterioration in production or prerequisite conditions after approval MUST trigger reassessment before continuing.

## MUST NOT
- Silence, absence from a meeting, or lack of objection MUST NOT be interpreted as approval where explicit approval is required.
- A Release Manager or AI agent MUST NOT fabricate, infer, or self-grant human authorization.
- A no-go decision MUST NOT be overridden informally without the required authority and new evidence.

## SHOULD
- Decision meetings SHOULD focus on exceptions and changed conditions rather than re-reading already verified evidence.
- Complex rollouts SHOULD define intermediate continue/pause/abort checkpoints.

## Exceptions
Emergency authorization may use an expedited process only when the designated emergency authority accepts documented risk and required compensating controls.

## Verification
Inspect gate evidence, risk register, candidate identifier, production health, dependency confirmations, decision record, named approver, timestamp, and any checkpoint decisions.