# Browser Security Rules

## Purpose
Reduce browser-originated security risk.
## Scope
XSS, CSRF, CORS, CSP, redirects, uploads, and third-party scripts.
## MUST
- Encode untrusted output according to rendering context.
- Configure CORS to explicit trusted origins when credentials are involved.
- Protect state-changing cookie-authenticated requests against CSRF.
- Validate redirects, uploads, and externally sourced URLs.
## MUST NOT
- Disable browser security controls merely to unblock integration.
- Inject unsanitized untrusted HTML or script.
## SHOULD
- Apply restrictive CSP and minimize third-party script privileges.
## Exceptions
Relaxed controls require threat analysis, bounded scope, compensating controls, and approval.
## Verification
Use security tests, headers inspection, dependency review, and browser security tooling.