# Prompt Contract Rules

## Purpose
Define prompts as explicit behavioral contracts rather than informal prose.

## Scope
System prompts, developer prompts, reusable templates, and prompt fragments that influence model behavior.

## MUST
- Every production prompt MUST state its objective, scope, required outputs, and non-goals.
- Required constraints MUST be expressed in testable language where practical.
- Conflicting instructions MUST be resolved by documented precedence rather than accidental wording order.
- Inputs whose meaning affects behavior MUST have documented assumptions or validation rules.

## MUST NOT
- MUST NOT rely on vague phrases such as “do the right thing” for critical behavior.
- MUST NOT encode hidden business rules only in examples when they are mandatory requirements.
- MUST NOT mix unrelated responsibilities into one prompt when they require independent evolution.

## SHOULD
- Prompts SHOULD expose stable behavioral contracts while allowing implementation wording to evolve.
- Important constraints SHOULD have corresponding evaluation cases.

## Exceptions
Any intentionally underspecified behavior requires a documented reason, bounded risk, and reviewer approval.

## Verification
Review prompt text against product requirements, trace mandatory requirements to evaluation cases, and inspect conflict-resolution tests.