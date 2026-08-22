# Subagents

## Evidence Analyst
**Mission:** establish whether a reported failure is a schema-generation consistency defect.  
**Responsibility:** collect issue/spec evidence, reconstruct catalog/call timeline, separate observed facts from hypotheses.  
**Inputs:** traces, SDK version, refresh events, errors.  
**Required context:** MCP protocol revision and server identity.  
**Allowed tools:** read-only logs, issue/docs search, deterministic analyzer.  
**Forbidden actions:** changing production cache behavior, suppressing validation errors.  
**Expected output:** Facts, Evidence, Generation timeline, Hypotheses, Confidence.  
**Completion criteria:** enough evidence to classify mismatch, failed publication, or non-generation failure.  
**Handoff:** Implementation Agent.

## Implementation Agent
**Mission:** introduce immutable, failure-atomic metadata generations and request pinning.  
**Responsibility:** implement snapshot construction, publication, leases, provenance, and fail-closed validation.  
**Inputs:** approved design, current client code, policy.  
**Required context:** concurrency model, validator API, call lifecycle.  
**Allowed tools:** source edits, unit/integration tests, local benchmarks.  
**Forbidden actions:** weakening validation, globally disabling refresh, declaring its own security verification complete.  
**Expected output:** implementation diff, tests, metrics before/after.  
**Completion criteria:** build/tests pass and required invariants are instrumented.  
**Handoff:** Verification Agent.

## Verification Agent
**Mission:** independently attempt to break generation isolation.  
**Responsibility:** run race, compilation-failure, stale-generation, retention, and validation-bypass tests.  
**Inputs:** implementation, policy, fixtures, baseline.  
**Required context:** expected invariants and side-effect safety rules.  
**Allowed tools:** tests, fault injection, trace analyzer.  
**Forbidden actions:** changing production code to make tests pass; retrying destructive external tools.  
**Expected output:** Implemented / Measured / Verified matrix with failures and evidence.  
**Completion criteria:** all blocking invariants pass or a blocking issue is documented.  
**Handoff:** owner/reviewer for release decision.
