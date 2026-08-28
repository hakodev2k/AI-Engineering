# Hermetic Build Rules

## Purpose
Ensure builds depend only on declared, controlled inputs so results can be reproduced and trusted.

## Scope
Applies to compiler inputs, environment variables, network access, filesystem reads, timestamps, locale, random values, and external tools.

## MUST
- Build steps MUST declare every file, tool, configuration value, and environment dependency required for execution.
- Build environments MUST pin or otherwise control toolchain versions used to produce release artifacts.
- Network access during build execution MUST be disabled or explicitly mediated through controlled dependency-fetch stages.
- Time, locale, hostname, user profile, and machine-specific paths MUST NOT influence artifact content unless intentionally declared.
- Hermeticity regressions MUST be treated as build correctness defects.

## MUST NOT
- MUST NOT read undeclared files from developer machines.
- MUST NOT depend on mutable remote resources during compilation or packaging.
- MUST NOT silently fall back to globally installed tools when a declared toolchain is unavailable.

## SHOULD
- Builds SHOULD run successfully in isolated ephemeral environments.
- External inputs SHOULD be content-addressed or checksum-verified where practical.

## Exceptions
Exceptions require documented necessity, bounded scope, reproducibility risk, compensating controls, and a plan to remove the non-hermetic dependency.

## Verification
Run builds in clean isolated environments, compare dependency traces, inspect network access, and verify undeclared input detection where supported.