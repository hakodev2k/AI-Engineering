# Extension and Dependency Rules
## Purpose
Control PostgreSQL extension risk and lifecycle compatibility.
## Scope
Extensions, procedural languages, native libraries, versions, and upgrade dependencies.
## MUST
- Assess security, support, replication, backup, upgrade, and platform compatibility before adopting an extension.
- Pin or control extension versions through an explicit lifecycle process.
- Test major PostgreSQL upgrades with all required extensions.
## MUST NOT
- Install unreviewed native-code extensions in production.
- Assume extension objects are automatically portable across environments.
## SHOULD
- Minimize extensions whose benefits do not justify operational coupling.
## Exceptions
Experimental extensions must remain isolated from production-critical data unless approved.
## Verification
Inventory pg_extension, package versions, upgrade rehearsals, restore tests, and vulnerability/support status.