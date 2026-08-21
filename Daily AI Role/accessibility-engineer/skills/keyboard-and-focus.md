# Skill: Keyboard & Focus

**Purpose:** make complete workflows operable without pointer input and keep focus understandable.

**Procedure:** traverse with Tab/Shift+Tab; exercise Enter/Space/arrows/Escape according to control pattern; verify no traps; verify focus order follows logical task order; test modal/menu/dialog focus entry, containment, restoration, and dismissal; ensure focus indicator remains visible; verify SPA route and dynamic updates intentionally manage focus.

**Inputs:** critical journeys, supported browsers, interaction specs.

**Output:** reproducible interaction findings and remediation guidance.

**Quality gate:** every actionable control can be reached and operated, focus never disappears unexpectedly, and focus movement is predictable.

**Trade-offs:** programmatic focus can improve context but harms users when overused; move focus only when the task context truly changes.

**Production consideration:** retest after responsive/layout changes because DOM reordering and portals often alter focus behavior.