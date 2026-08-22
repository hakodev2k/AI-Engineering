# Design System Rules
## Purpose
Preserve coherent interaction patterns while allowing controlled evolution.
## Scope
Tokens, shared components, visual primitives, interaction patterns, and design-system changes.
## MUST
- Existing approved primitives MUST be reused when they satisfy the requirement.
- Shared component changes MUST assess backward compatibility and affected consumers.
- New variants MUST represent a recurring semantic need rather than a one-screen styling exception.
- Accessibility and interaction behavior MUST be part of component contracts.
## MUST NOT
- Product screens MUST NOT fork shared components merely to bypass review when extension is appropriate.
- Semantic meaning MUST NOT be encoded only through raw visual tokens.
## SHOULD
- Separate design tokens, primitives, patterns, and product composition into clear layers.
## Exceptions
Local exceptions require documented reason and should not silently become precedent.
## Verification
Review design-system usage, consumer diffs, visual regression, accessibility tests, and API compatibility.