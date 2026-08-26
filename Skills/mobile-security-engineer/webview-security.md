# WebView Security

## Purpose
Safely embed web content without exposing native capabilities, credentials, files, or navigation control to untrusted content.

## When to use
Use for WebViews, hybrid apps, JavaScript bridges, in-app browsers, or embedded authentication/content.

## Inputs
Allowed origins, navigation requirements, bridge APIs, cookie/session model, content sources.

## Preconditions
Classify content as trusted, semi-trusted, or untrusted and identify native privileges exposed to it.

## Context to inspect
JavaScript settings, bridge handlers, origin validation, file access, mixed content, cookies, navigation delegates, downloads, and debugging flags.

## Core knowledge
Web content is a separate trust domain. A native bridge can turn web injection into native compromise. Minimize bridge surface and validate origin plus message schema.

## Procedure
1. Inventory WebViews and content origins.
2. Disable unnecessary capabilities.
3. Restrict navigation to explicit origins.
4. Design narrow bridge methods with typed validation.
5. Avoid exposing secrets to page JavaScript.
6. Block unsafe file/content access and mixed content.
7. Handle external URLs through safe platform mechanisms.
8. Disable production debugging.
9. Test XSS-to-bridge and navigation abuse cases.

## Decision points
Prefer system browser/custom tabs when native integration is unnecessary. Use a WebView only when product requirements justify its expanded attack surface.

## Common failure patterns
Wildcard origins, generic bridge evaluators, JavaScript injection, file URL access, mixed content, authentication inside unsafe WebViews, and unrestricted redirects.

## Verification
Attempt origin spoofing, malicious navigation, bridge misuse, injected scripts, and file access; verify all fail safely.

## Expected output
A minimal WebView configuration with constrained origins, bridge APIs, and tested navigation policy.

## Stop conditions
Escalate when untrusted content requires privileged native bridge access or origin ownership is uncertain.