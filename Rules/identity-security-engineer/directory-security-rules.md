# Directory Security Rules

## Purpose
Protect identity directories as critical security control planes and sources of authorization context.

## Scope
Applies to enterprise directories, cloud identity tenants, groups, administrative units, directory synchronization, and directory-integrated applications.

## MUST
- Directory administrative roles MUST be minimized, separated by function, and periodically reviewed.
- Group ownership and privilege semantics MUST be documented for security-relevant groups.
- Directory synchronization paths MUST authenticate endpoints and protect integrity of synchronized attributes.
- Changes to high-impact groups, roles, domains, or synchronization configuration MUST be auditable and alertable.
- Recovery procedures MUST preserve trusted administrative access after control-plane failure or compromise.

## MUST NOT
- Broad directory write permissions MUST NOT be granted to integrations without demonstrated need.
- Security decisions MUST NOT depend on ungoverned free-form attributes.
- Stale synchronization accounts or connectors MUST NOT retain privilege indefinitely.

## SHOULD
- Separate high-privilege administrative paths from routine directory management.
- Monitor changes to privileged groups and federation settings with elevated severity.

## Exceptions
Exceptions require explicit scope, owner, threat assessment, compensating controls, and approval.

## Verification
Inspect directory roles, group ownership, synchronization configuration, privileged-change logs, connector inventories, and recovery-test evidence.