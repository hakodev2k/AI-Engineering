# Stored Program Rules

## Purpose
Keep stored procedures, functions, triggers, and database-side programs predictable and governable.

## Scope
Stored modules and executable database logic.

## MUST
- Stored programs MUST have explicit contracts for inputs, outputs, side effects, permissions, and transaction behavior.
- Error handling MUST preserve diagnostic context and leave data in a valid state.
- Trigger logic MUST account for multi-row operations and recursion/cascade behavior.
- Changes MUST assess callers and backward compatibility.

## MUST NOT
- MUST NOT silently swallow unexpected errors.
- MUST NOT assume row-at-a-time trigger execution when the engine supports statement-level multi-row effects.
- MUST NOT hide uncontrolled remote calls or high-cost work in implicit database hooks.

## SHOULD
- Keep database-side logic focused on responsibilities that benefit from proximity to data, atomicity, or centralized enforcement.
- Prefer set-based implementations where they preserve clarity and semantics.

## Exceptions
Complex stored logic requires documented rationale versus application-side alternatives, ownership, test strategy, and operational impact.

## Verification
Unit/integration test normal and failure paths, inspect permissions and dependencies, test multi-row behavior, review plans, and verify transaction outcomes.