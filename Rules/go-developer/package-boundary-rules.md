# Package Boundary Rules

## Purpose
Keep Go packages cohesive, acyclic, and independently understandable.

## Scope
Package structure, imports, visibility, dependency direction, and shared code.

## MUST
- Packages MUST have a coherent responsibility and stable dependency direction.
- Cyclic design pressure MUST be resolved architecturally rather than through global state or duplication.
- Exported identifiers MUST be justified by external callers.
- Cross-package contracts MUST minimize coupling to implementation details.

## MUST NOT
- MUST NOT create catch-all utility packages that become uncontrolled dependency hubs.
- MUST NOT expose internals merely to make tests convenient.
- MUST NOT move domain behavior into infrastructure packages to avoid dependency design.

## SHOULD
- Package names SHOULD describe capability rather than technical taxonomy when practical.
- Internal implementation SHOULD use `internal` boundaries when external consumption is unsupported.

## Exceptions
A broader boundary requires documented consumers, compatibility impact, and ownership.

## Verification
Inspect import graphs, exported API surface, architecture tests where available, and code-review evidence.