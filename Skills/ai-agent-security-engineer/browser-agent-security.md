# Browser Agent Security

## Purpose
Secure agents that browse websites, follow links, submit forms, download files, or perform authenticated web actions.

## When to use
Use for browser automation, research agents, purchasing/admin workflows, web scraping with credentials, and any agent exposed to arbitrary page content.

## Inputs
Browser architecture, authentication state, allowed sites, action inventory, download policy, network controls, and user-impact criteria.

## Preconditions
Separate browsing for information from browsing that can create authenticated side effects.

## Context to inspect
Browser profile, cookies, extensions, download directory, navigation controls, DNS/network policy, authenticated sessions, form submission, clipboard, local files, and browser-to-tool bridge.

## Core knowledge
Web pages are adversarial input. Browser agents face indirect prompt injection, CSRF-like action confusion, malicious downloads, drive-by navigation, credential leakage, SSRF, deceptive UI, and cross-origin data exposure. Browser automation must not rely on visual interpretation alone for security decisions.

## Procedure
1. Classify browsing sessions as anonymous, authenticated-read, or authenticated-write.
2. Use separate browser profiles for materially different privilege levels.
3. Restrict origins and outbound destinations when workflows permit.
4. Block local-network and metadata-service access unless explicitly required.
5. Treat page text, accessibility trees, scripts, and downloaded content as untrusted.
6. Require deterministic policy before sensitive form submissions or purchases.
7. Validate final origin, target account, amount, and action parameters before committing.
8. Isolate downloads and scan or sandbox risky file types.
9. Avoid exposing unrelated cookies, saved passwords, clipboard data, or local files.
10. Detect unexpected redirects and domain changes.
11. Log navigations and high-impact interactions without capturing sensitive fields unnecessarily.
12. Test malicious pages, deceptive links, redirect chains, SSRF targets, and injection content.

## Decision points
Prefer API integrations over browser automation when stable APIs provide stronger authentication and authorization guarantees. Use authenticated browsing only for workflows that cannot be served safely otherwise.

## Common failure patterns
One persistent browser profile for all users, unrestricted intranet access, trusting displayed domain text, auto-submitting forms after page instructions, and executing downloaded files.

## Verification
Demonstrate that malicious pages cannot trigger protected side effects, reach prohibited network targets, or access unrelated authenticated sessions.

## Expected output
A browser-agent security profile, origin/action policies, isolation controls, and adversarial browser tests.

## Stop conditions
Escalate when the workflow requires unrestricted authenticated browsing into sensitive environments without enforceable action controls.