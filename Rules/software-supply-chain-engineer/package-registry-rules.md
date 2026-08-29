# Package Registry Rules

## Purpose
Protect the integrity and availability of package sources used by builds and releases.

## Scope
Applies to public registries, private registries, mirrors, proxies, and package publication workflows.

## MUST
- Approved registries MUST be explicitly configured and documented.
- Private package namespaces MUST be protected against unintended resolution from public sources.
- Package publication MUST require authenticated, authorized identities and immutable version semantics where supported.
- Registry outages and integrity failures MUST have documented fallback or stop conditions.

## MUST NOT
- MUST NOT silently fall back to an unapproved registry.
- MUST NOT reuse released version identifiers for different package contents.

## SHOULD
- External packages SHOULD be cached or mirrored when reliability or control requirements justify it.
- Registry access SHOULD be logged and reviewed for privileged publication activity.

## Exceptions
Exceptions MUST identify the registry, reason, risk, duration, compensating controls, and approval.

## Verification
Inspect package-manager configuration, registry permissions, namespace controls, publication logs, and artifact hashes. Confirm released versions are immutable and resolve only from approved sources.