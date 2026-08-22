# Gesture and Interaction Rules
## Purpose
Make touch and gesture interactions discoverable, accessible, and resistant to accidental destructive actions.
## Scope
Tap, swipe, drag, long press, multi-touch, haptics, and gesture conflicts.
## MUST
- Critical actions triggered by gestures MUST have sufficient feedback and protection against accidental activation.
- Gesture-only functionality MUST provide an accessible alternative when required.
- Competing gestures MUST have deterministic precedence and cancellation behavior.
## MUST NOT
- Hidden gestures MUST NOT be the sole path to essential functionality.
- Destructive actions MUST NOT execute from ambiguous gesture recognition without confirmation or easy undo proportional to risk.
## SHOULD
- Prefer platform-standard interaction patterns unless product value justifies deviation.
## Exceptions
Specialized creative/game experiences may rely more heavily on gestures with appropriate onboarding and accessibility scope.
## Verification
Test one-handed use, assistive technologies, gesture conflicts, interrupted gestures, edge navigation, and accidental activation.