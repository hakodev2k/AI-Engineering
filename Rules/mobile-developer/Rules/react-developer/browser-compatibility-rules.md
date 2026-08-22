# Browser Compatibility Rules

## Purpose
Ensure the application behaves predictably across the browsers and devices the product explicitly supports.

## Scope
Applies to browser APIs, CSS capabilities, polyfills, responsive behavior, input methods, and supported-browser policy.

## MUST
- Supported browsers and minimum versions MUST be explicitly defined by the project or product requirements.
- Use of browser APIs outside the supported baseline MUST include feature detection, fallback, or approved incompatibility.
- Critical workflows MUST be tested on representative supported browsers and viewport classes.
- Responsive behavior MUST preserve essential functionality, not only visual layout.
- Polyfills MUST be scoped to actual compatibility requirements and reviewed for bundle impact.

## MUST NOT
- MUST NOT assume developer-browser behavior represents all supported clients.
- MUST NOT silently drop critical functionality on supported browsers.
- MUST NOT add broad legacy polyfills without evidence they are needed.

## SHOULD
- Prefer progressive enhancement where feasible.
- Prefer automated cross-browser tests for critical journeys and manual exploratory testing for complex interactions.

## Exceptions
Unsupported behavior requires documented affected environments, user impact, workaround, and approval.

## Verification
Use compatibility data, feature detection tests, cross-browser E2E tests, device/viewport testing, and production telemetry segmented by browser when available.