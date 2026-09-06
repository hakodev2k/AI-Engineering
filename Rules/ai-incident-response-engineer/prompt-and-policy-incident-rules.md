# Prompt and Policy Incident Rules

## Purpose
Control incidents caused by prompt changes, instruction conflicts, policy regressions, or safety-control configuration.

## Scope
Applies to system prompts, templates, guardrails, classifiers, policy engines, output filters, and instruction hierarchies.

## MUST
- Incident investigation MUST identify prompt and policy versions active at the time of affected requests.
- Changes to high-impact instructions or safety policy during an incident MUST be reviewable and reversible.
- Prompt injection or instruction-conflict incidents MUST evaluate trust boundaries between system, developer, user, retrieved, and tool-provided content.
- Policy mitigations MUST be tested against the triggering case and representative legitimate traffic before broad rollout when time permits.
- Emergency policy changes MUST record intended protection, expected false-positive impact, owner, and rollback condition.

## MUST NOT
- Untrusted retrieved or external content MUST NOT be elevated to privileged instruction status as a mitigation.
- Responders MUST NOT remove safety controls merely to restore completion rates.
- Prompt text containing secrets or privileged credentials MUST NOT be introduced as an incident workaround.

## SHOULD
- Prompt and policy artifacts SHOULD be versioned and diffable.
- High-risk policy changes SHOULD use staged rollout or shadow evaluation where feasible.

## Exceptions
Immediate restrictive changes may bypass normal rollout when credible harm is ongoing, but require post-change validation and retrospective review.

## Verification
Inspect prompt/policy diffs, version records, injection tests, safety regression results, rollout telemetry, and rollback readiness.