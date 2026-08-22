# Secure Input and Output Rules
## Purpose
Prevent untrusted mobile inputs and accidental output exposure from becoming security or privacy failures.
## Scope
Text input, files, intents, URLs, QR codes, clipboard, sharing, screenshots, and exported content.
## MUST
- All externally supplied data MUST be validated for type, size, format, and allowed destination before privileged use.
- Sensitive output MUST respect masking, clipboard, screenshot, and sharing requirements defined by threat model.
- File handling MUST verify content and destination rather than trusting filename or extension alone.
## MUST NOT
- User-controlled strings MUST NOT be interpreted as executable code, unrestricted paths, or privileged URLs.
- Sensitive data MUST NOT be copied to global clipboard automatically without clear need.
## SHOULD
- Inputs SHOULD be bounded early to reduce memory and parser abuse.
## Exceptions
Explicit developer/debug tooling may accept broader input only in non-production builds with isolation.
## Verification
Fuzz parsers, test oversized/malformed input, hostile files/links, clipboard exposure, screenshots, and share-sheet output.