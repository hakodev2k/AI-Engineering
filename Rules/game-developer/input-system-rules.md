# Input System Rules

## Purpose
Ensure responsive, remappable, device-independent, and accessible player input.

## Scope
Keyboard, mouse, controllers, touch, input actions, rebinding, focus, and device changes.

## MUST
- Gameplay logic MUST consume semantic actions rather than hard-coded physical controls where rebinding is expected.
- Input sampling and consumption MUST have defined timing relative to simulation updates.
- Focus loss, disconnect, reconnect, and device switching MUST have safe behavior.
- Rebinding MUST prevent or resolve unusable critical-control configurations.

## MUST NOT
- MUST NOT assume one controller layout, keyboard locale, or input device unless the product explicitly requires it.
- MUST NOT trigger irreversible actions from stale buffered input without defined semantics.

## SHOULD
- Input systems SHOULD support accessibility options such as hold/toggle alternatives where applicable.

## Exceptions
Fixed-control experiences require documented platform/product constraints.

## Verification
Test supported devices, rebinding, focus transitions, low/high frame rates, simultaneous inputs, and accessibility configurations.