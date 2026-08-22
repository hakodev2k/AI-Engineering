# Browser Compatibility Rules

## Purpose
Ensure supported users receive correct behavior across the declared browser/device matrix.

## Scope
Browser APIs, CSS features, transpilation, polyfills, mobile browsers, and progressive enhancement.

## MUST
- Supported browser versions MUST be explicitly defined by product or project policy.
- New platform APIs used in critical flows MUST be checked against the support matrix and provided with fallback, polyfill, or deliberate support change.
- Compatibility fixes MUST be validated on representative real engines, not inferred solely from one development browser.
- Unsupported-browser behavior MUST fail gracefully when possible rather than corrupting user data.
- Polyfills MUST be reviewed for scope, security, and bundle cost.

## MUST NOT
- Browser-specific workarounds MUST NOT be added without evidence of the actual incompatibility.
- User-agent sniffing MUST NOT be the default capability-detection strategy when feature detection is reliable.
- A support-matrix change MUST NOT be made implicitly through a dependency/toolchain upgrade.

## SHOULD
- Prefer standards-based progressive enhancement.
- Automate representative cross-browser critical-path tests when risk and usage justify it.

## Exceptions
Dropping an obsolete browser is acceptable with product approval, usage evidence, communication, and documented support policy update.

## Verification
Run compatibility data checks, cross-browser E2E tests, representative device testing, and inspect transpilation/polyfill output.