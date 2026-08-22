# Orientation and Windowing Rules
## Purpose
Keep mobile UI correct across rotation, resizing, multitasking, foldables, and multiple windows.
## Scope
Orientation, window size, safe areas, fold/posture changes, multitasking, and state preservation.
## MUST
- Layout and state MUST remain valid across every supported orientation and window class.
- Configuration changes MUST preserve or intentionally reconstruct durable user progress.
- Safe-area/inset changes MUST be handled for interactive and critical content.
## MUST NOT
- Device model names MUST NOT be used as the primary layout strategy when responsive capability information exists.
- Rotation/recreation MUST NOT duplicate irreversible operations.
## SHOULD
- UI SHOULD adapt to available space rather than assume fixed phone dimensions.
## Exceptions
A locked orientation may be used when the product experience genuinely requires it and accessibility/platform policy is considered.
## Verification
Test rotation, split screen, resize, fold/unfold, keyboard/insets, process recreation, and state restoration.