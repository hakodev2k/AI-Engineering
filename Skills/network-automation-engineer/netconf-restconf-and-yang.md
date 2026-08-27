# NETCONF, RESTCONF, and YANG

## Purpose
Automate model-driven network configuration and state retrieval using standardized management protocols and YANG schemas.

## When to use
Use when platforms expose reliable NETCONF/RESTCONF and structured models are preferable to CLI automation.

## Inputs
Device capabilities, YANG modules, datastore semantics, authentication, target configuration, and validation requirements.

## Context to inspect
Supported models/revisions, candidate/running datastores, locking, confirmed commit, vendor deviations, and RPC errors.

## Core knowledge
YANG defines data structure and constraints; NETCONF provides transactional RPC/datastore operations; RESTCONF maps model data to HTTP. Capability discovery is mandatory because support varies.

## Procedure
1. Discover protocol and model capabilities.
2. Retrieve relevant schema revisions/deviations.
3. Map desired intent to modeled paths.
4. Read current state and normalize namespaces.
5. Validate edits against schema constraints.
6. Use candidate/locking/confirmed commit when available and appropriate.
7. Apply minimal edits.
8. Parse structured RPC errors.
9. Verify running state and operational state.
10. Record unsupported deviations.

## Decision points
Prefer transactional NETCONF for coordinated configuration where supported; use RESTCONF for HTTP-native integrations; fall back to vendor APIs only when model coverage is insufficient.

## Common failure patterns
Ignoring namespaces, assuming model parity across vendors, replacing entire containers unintentionally, no datastore lock strategy, and treating operational state as configuration.

## Verification
Schema-validate payloads, confirm committed state, test rollback/confirmed-commit timeout, and compare intended versus operational results.

## Expected output
Model-driven adapter/workflow with capability checks, safe edits, error handling, and verification.

## Stop conditions
Stop when model deviations make intent ambiguous or transaction safety cannot be established.