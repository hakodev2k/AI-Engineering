# Skill: Semantic Structure

**Purpose:** ensure structure and controls expose correct meaning programmatically.

**Inputs:** rendered UI, component code, DOM/accessibility tree, design intent.

**Procedure:** inspect landmarks/headings; verify native controls and labels; check relationships, names/roles/values/states; validate tables/lists/forms; confirm dynamic content preserves semantics; review ARIA only where native HTML cannot express intent.

**Decision rules:** prefer native semantics; a visually correct UI fails if the accessibility tree communicates the wrong control, hierarchy, relationship, or state.

**Output:** semantic findings with selector/component, expected behavior, actual evidence, severity, remediation guidance.

**Verification:** inspect accessibility tree plus keyboard/screen-reader behavior for stateful controls.

**Common failures:** clickable divs, skipped heading hierarchy used as styling, duplicate IDs, unlabeled icons, incorrect `aria-hidden`, stale `aria-expanded`, inaccessible custom widgets.

**Stop condition:** semantics match intended interaction across supported states or unresolved blockers are escalated.