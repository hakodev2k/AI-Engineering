# Skill: Accessibility and Device Experience
Purpose: ensure affected flows remain perceivable, operable, understandable, and robust across device conditions.

Trigger: UI/navigation/input/media/layout changes.
Inputs: design, content, supported OS/device matrix, accessibility requirements.
Procedure:
1. Define semantic roles, names, values, states, actions, headings, and focus order.
2. Verify dynamic type/font scaling, contrast-dependent behavior, touch targets, orientation/layout changes, keyboard/external input where relevant, and reduced-motion alternatives.
3. Test screen reader navigation and error recovery.
4. Check localization expansion, RTL-sensitive layout when applicable, date/number/time formatting, and device-size extremes.
5. Avoid gesture-only or color-only meaning without alternatives.
6. Record exceptions and approval needs.
Output: accessibility/device test evidence and fixes.
Quality gate: critical flow is operable without relying on precise vision, color, or custom gestures alone.
Stop: affected flow passes defined accessibility/device matrix.