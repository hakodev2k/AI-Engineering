# Browser Security Rules

## Purpose
Reduce XSS, injection, data exposure, and unsafe browser capability risks.

## Scope
Templates, DOM APIs, sanitization, URLs, storage, third-party scripts, CSP-sensitive code, and user-controlled content.

## MUST
- Treat external and user-controlled content as untrusted at every HTML, URL, style, script, and DOM boundary.
- Use Angular's safe binding mechanisms and narrowly review any sanitization bypass.
- Minimize sensitive data retained in browser storage, logs, caches, and client state.
- Review third-party scripts for origin, privileges, data access, and compromise impact.

## MUST NOT
- Use `bypassSecurityTrust*`, raw DOM HTML insertion, or equivalent escape hatches merely to suppress security protections.
- Construct executable code from untrusted strings.
- Place secrets in environment files that are shipped in browser bundles.

## SHOULD
- Support restrictive Content Security Policy and Trusted Types-compatible patterns where project constraints allow.

## Exceptions
A sanitization bypass requires documented trusted source, threat analysis, narrow scope, tests, and security approval for material risk.

## Verification
Run security review/scanning, inspect dangerous sinks and bundle config, test hostile payloads, and review CSP/browser reports.