# Text Direction and Bidirectional Text Rules

## Purpose
Protect readability and security when left-to-right and right-to-left scripts appear together.

## Scope
Applies to UI direction, bidirectional isolation, mixed-script content, identifiers, logs, code-like strings, and user-generated text.

## MUST
- Direction-sensitive layouts MUST derive direction from the active content context rather than visual assumptions.
- User-generated or variable text embedded in opposite-direction messages MUST be isolated with appropriate bidirectional mechanisms.
- Identifiers, account references, URLs, numbers, and code-like values MUST remain unambiguous in mixed-direction interfaces.
- Mirrored layout behavior MUST be explicitly defined for navigation, icons, progressions, and directional controls.
- Security-sensitive text MUST be reviewed for Unicode bidirectional control abuse and visual spoofing risk.

## MUST NOT
- RTL support MUST NOT be implemented only by reversing strings or DOM order.
- Invisible directional controls from untrusted input MUST NOT be accepted without validation appropriate to the context.
- Directional icons MUST NOT be mirrored when mirroring changes their semantic meaning.

## SHOULD
- Components SHOULD inherit direction naturally unless a contained value requires explicit isolation.
- Test data SHOULD combine RTL text, LTR identifiers, numbers, punctuation, and nested content.

## Exceptions
Exceptions require documented semantic reasons, affected scripts, visual evidence, and accessibility review where applicable.

## Verification
Use RTL locales, mixed-direction fixtures, screenshot/visual regression tests, keyboard navigation tests, Unicode security inspection, and human review by fluent users where risk is material.