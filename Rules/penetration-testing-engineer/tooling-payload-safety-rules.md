# Tooling and Payload Safety Rules

## Purpose
Ensure security tools, scripts, payloads, and dependencies are understood, controlled, and reproducible before they touch authorized targets.

## Scope
Covers scanners, exploit frameworks, custom scripts, binaries, wordlists, extensions, containers, and third-party proof-of-concept code.

## MUST
- MUST understand the relevant behavior, network effects, file changes, privilege requirements, and cleanup of a tool before production use.
- MUST obtain tools from trustworthy sources and verify provenance or integrity where practical.
- MUST pin or record versions and material configuration needed to reproduce results.
- MUST inspect untrusted proof-of-concept code before execution and isolate it when behavior is uncertain.
- MUST configure concurrency, timeouts, retries, and destructive options deliberately.

## MUST NOT
- MUST NOT execute opaque internet-sourced binaries or scripts against engagement targets without review and risk assessment.
- MUST NOT enable destructive, persistence, evasion, or auto-exploitation modes by default.
- MUST NOT assume a popular tool is safe for a fragile target.
- MUST NOT expose target data to unapproved external services through tooling.

## SHOULD
- SHOULD sandbox unfamiliar tools and test payloads against representative lab targets first.
- SHOULD prefer deterministic tooling with auditable output.

## Exceptions
Use of opaque or high-risk tooling requires explicit approval, isolation, monitoring, and a justified absence of safer alternatives.

## Verification
Review tool hashes or provenance, versions, configuration, source where available, sandbox results, network destinations, execution logs, and cleanup evidence.