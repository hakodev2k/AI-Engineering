# Input and Output Safety Rules

## Purpose
Prevent injection, parser abuse, unsafe interpretation, and output-context vulnerabilities at application boundaries.

## Scope
Applies to user input, files, headers, serialized data, templates, queries, commands, markup, redirects, and data passed to interpreters or external systems.

## MUST
- Untrusted input MUST be validated against the business and protocol contract before privileged processing.
- Data sent to SQL, shell, template, LDAP, expression, or similar interpreters MUST use safe parameterization or context-specific APIs.
- Output encoding MUST match the destination context such as HTML text, attribute, JavaScript, URL, or structured serialization.
- File uploads MUST enforce explicit type, size, storage, naming, and processing constraints appropriate to risk.
- Parser limits MUST bound depth, size, expansion, and resource consumption where attacker-controlled structured data is accepted.

## MUST NOT
- MUST NOT build interpreter commands or queries by concatenating untrusted data.
- MUST NOT rely solely on client-side validation for security decisions.
- MUST NOT use generic escaping as a substitute for context-specific encoding or parameterization.
- MUST NOT render attacker-controlled active content in a trusted origin without an explicit isolation design.

## SHOULD
- SHOULD use allowlists when the valid input space is enumerable.
- SHOULD reject ambiguous or duplicate representations when canonicalization affects security.

## Exceptions
Exceptions require documented data flow, parser/interpreter behavior, compensating control, adversarial test evidence, and security approval.

## Verification
Use code review, static analysis, fuzzing, injection tests, upload tests, parser-boundary tests, and browser security testing. Verify both accepted and rejected cases.