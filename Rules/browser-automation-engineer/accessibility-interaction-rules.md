# Accessibility Interaction Rules

## Purpose
Use browser automation in ways that respect and validate accessible interaction contracts where accessibility is relevant.

## Scope
Applies to roles, accessible names, keyboard navigation, focus, forms, dialogs, and semantic interaction used by automated workflows.

## MUST
- Automation that relies on accessible roles or names MUST treat them as user-facing contracts and report semantic regressions clearly.
- Keyboard-critical workflows MUST verify focus movement and operability when keyboard accessibility is part of acceptance criteria.
- Dialogs, forms, and interactive controls MUST be targeted through semantics when those semantics are the stable intended contract.
- Accessibility assertions MUST distinguish deterministic violations from heuristic findings.
- Automation changes that bypass inaccessible UI behavior MUST NOT conceal a product defect when accessibility is in scope.

## MUST NOT
- Tests MUST NOT use force-click or script-driven DOM manipulation merely to bypass an element that is not normally operable unless the bypass itself is explicitly under test.
- Accessible-name assertions MUST NOT depend on accidental text from unrelated descendants when a defined label exists.
- Accessibility checks MUST NOT be represented as complete conformance evidence when their coverage is partial.

## SHOULD
- Critical journeys SHOULD include semantic and keyboard checks appropriate to project requirements.
- Automated accessibility scanning SHOULD complement, not replace, targeted interaction checks and human review where required.

## Exceptions
Purely visual or non-user-facing automation may use alternate hooks when semantics are irrelevant; document the scope boundary.

## Verification
Inspect accessibility trees, execute keyboard paths, run configured accessibility checks, review focus behavior, and compare automation claims with the actual accessibility scope.