# Browser Security Rules
## Purpose
Prevent frontend code from becoming a path for script injection, credential theft, or unsafe navigation.
## Scope
DOM rendering, HTML, URLs, CSP-sensitive behavior, third-party scripts, and browser trust boundaries.
## MUST
- Untrusted content MUST be encoded or sanitized with an approved context-aware mechanism before dangerous DOM insertion.
- External navigation and resource URLs MUST be validated according to allowed schemes and origins when user-controlled.
- Security headers and CSP requirements MUST be preserved by frontend changes.
- Third-party scripts MUST have explicit business need, data-impact review, and approved loading policy.
## MUST NOT
- Dynamic code execution such as eval-like behavior MUST NOT process untrusted input.
- Security controls MUST NOT be weakened merely to make a library work.
## SHOULD
- Prefer framework-safe rendering APIs over raw HTML escape hatches.
## Exceptions
Raw trusted HTML requires documented provenance, sanitization boundary, tests, and security review where risk is material.
## Verification
Security tests, dependency scanning, CSP reports, code review, and malicious-input test cases.