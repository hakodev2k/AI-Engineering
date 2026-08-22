# WebView and Embedded Content Rules
## Purpose
Contain security, privacy, navigation, and lifecycle risks from embedded web content.
## Scope
WebViews, in-app browsers, JavaScript bridges, cookies, file access, and external navigation.
## MUST
- Trusted origins and navigation policy MUST be explicit for privileged embedded content.
- Native bridges MUST expose the minimum capability and validate origin and input where supported.
- Authentication cookies/tokens MUST follow approved storage and sharing rules.
## MUST NOT
- Arbitrary remote content MUST NOT gain unrestricted native bridge access.
- Dangerous file/content access settings MUST NOT be enabled without a documented requirement and mitigation.
## SHOULD
- Prefer system browsers/authentication sessions for external identity flows when platform guidance recommends them.
## Exceptions
Legacy embedded applications may require broader compatibility with explicit threat review and containment.
## Verification
Test hostile navigation, redirects, injected script, origin checks, bridge inputs, file URLs, cookies, and external-app handoff.