# Hardware Abstraction

## Purpose
Keep device-specific behavior controlled, testable, and replaceable.

## Scope
Registers, peripherals, board support packages, HALs, and device drivers.

## MUST
- Register access MUST use documented widths, ordering, masks, and volatile semantics appropriate to the target.
- Driver APIs MUST define ownership, valid states, timing assumptions, and error outcomes.
- Peripheral initialization MUST establish a known state before use.
- Hardware variants MUST be selected through explicit configuration rather than scattered conditional logic.

## MUST NOT
- Reserved register bits MUST NOT be modified without vendor documentation permitting it.
- Magic register values MUST NOT be used without named definitions or traceable documentation.
- Driver code MUST NOT assume reset defaults when software can establish required state deterministically.

## SHOULD
- Hardware-facing interfaces SHOULD minimize policy decisions.
- Device quirks SHOULD be localized and documented.

## Exceptions
Direct access outside the abstraction requires measured need, constrained scope, documented risk, and review.

## Verification
Inspect datasheet references, register definitions, initialization traces, driver tests, and hardware-in-loop results.