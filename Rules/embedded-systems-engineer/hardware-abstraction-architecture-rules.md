# Hardware Abstraction and Architecture Rules

## Purpose
Keep hardware-specific code controlled while preserving efficient access to platform capabilities.

## Scope
Drivers, BSPs, HALs, middleware, application logic, module boundaries, and dependency direction.

## MUST
- Define ownership and dependency direction between application, platform, driver, and hardware-specific layers.
- Keep register-level details out of unrelated business/control logic.
- Make cross-layer contracts explicit about timing, ownership, errors, and concurrency.

## MUST NOT
- Introduce abstractions that hide safety-critical timing or resource behavior from callers.
- Duplicate peripheral ownership across modules.

## SHOULD
- Abstract at stable behavioral boundaries rather than wrapping every hardware API mechanically.

## Exceptions
Performance-critical boundary violations require measurement, rationale, and architecture review.

## Verification
Use dependency review, architecture tests where feasible, interface inspection, and target measurements for abstraction overhead.