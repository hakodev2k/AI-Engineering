# Skill: Screen Reader Compatibility

**Purpose:** verify that non-visual users can discover, understand, operate, and recover from UI interactions.

**Inputs:** critical journeys, semantic review results, supported browser/assistive-technology matrix.

**Procedure:** test browse/read and interaction modes; verify control names/roles/states; inspect form instructions/errors; verify dialogs, menus, tabs, accordions, live updates and async completion announcements; test route/page-title context; confirm decorative content is silent and meaningful content is available.

**Decision rules:** announcements must be timely and sufficient but not noisy; do not add live regions when focus or native semantics already convey the change.

**Output:** step-by-step evidence including environment, spoken result summary, expected result and severity.

**Quality gate:** a user can complete the critical workflow without visual inference.

**Failure:** when AT/browser behavior differs, document the matrix and isolate product defect vs platform limitation before recommending workarounds.