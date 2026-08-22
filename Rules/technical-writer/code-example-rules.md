# Code Example Rules
## Purpose
Prevent sample code from teaching insecure, obsolete, or nonfunctional patterns.
## Scope
Snippets, sample applications, commands, configuration, and copy-paste examples.
## MUST
- Make examples syntactically valid and behaviorally aligned with supported versions.
- Use secure defaults, placeholder secrets, least-privilege permissions, and explicit error handling appropriate to the teaching goal.
- State omitted production concerns when simplification could otherwise be copied unsafely.
- Test executable examples automatically where practical.
## MUST NOT
- Embed real credentials, tokens, private endpoints, personal data, or dangerous production identifiers.
- Use deprecated APIs without clearly documenting the reason and replacement path.
## SHOULD
- Keep examples minimal while preserving the behavior needed to teach the concept correctly.
## Exceptions
Intentionally failing examples must be labeled and explain the expected failure.
## Verification
Compile, lint, execute, scan for secrets, and test examples against supported environments or fixtures.