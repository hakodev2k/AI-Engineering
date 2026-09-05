# Skill: Package Quarantine Assessment

## Purpose
Assess an MCP/agent package before any untrusted code executes.

## Trigger
New package, version upgrade, registry/source change, publisher change, advisory, or agent-requested install.

## Inputs
Exact package name/version, resolved hash, publisher, package scripts, file list, advisory/denylist snapshot, source URL.

## Preconditions
Artifact metadata must be inspectable without running install/import code. Secrets must not be exposed to the inspection environment.

## Required context
Expected publisher/source and intended capabilities.

## Allowed tools
Registry metadata readers, tarball listing/extraction in an isolated no-secret environment, advisory databases, hash tools, `quarantine_scan.py`.

## Constraints
MUST NOT execute package lifecycle scripts, native builds, binaries, or imports during quarantine.

## Procedure
1. Resolve an immutable package/version/hash.
2. Verify source/publisher against expected identity.
3. Query current malware/advisory sources and local denylist.
4. Inspect scripts and package files without execution.
5. Flag lifecycle scripts, native build files, executable/binary payloads, downloaders, obfuscated launchers, or unexpected network bootstrap logic.
6. Run deterministic scanner.
7. If pass, perform a sandbox install with no production credentials and network controls.
8. Record observed filesystem/network/process behavior.
9. Hand to independent reviewer when elevated risk exists.

## Decision points
Known malicious/advisory match = block. Unknown identity or unresolved artifact = quarantine. Suspicious execution surface = require review. Clean, immutable, expected publisher + passing sandbox = eligible for normal approval.

## Expected output
Evidence record, finding list, PASS/QUARANTINE/BLOCK, approval requirements.

## Metrics
Pre-execution detection rate, overrides, false positives, time-to-decision, unexpected sandbox behaviors.

## Verification
Known malicious fixtures block and approved clean fixture passes.

## Failure handling
Retry metadata retrieval twice. Missing evidence never becomes implicit approval.

## Stop conditions
Stop immediately on malware match, secret access attempt, unexpected executable launch, or unresolved provenance.