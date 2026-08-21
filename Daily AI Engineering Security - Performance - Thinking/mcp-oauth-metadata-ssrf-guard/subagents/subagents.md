# Subagents

## Research & Threat Agent
**Mission:** maintain evidence and attack-path model for MCP OAuth URL trust.

**Responsibility:** collect current spec guidance, issues/advisories and map attacker-controlled fields to URL sinks.

**Inputs:** protocol version, client architecture, public sources.

**Required context:** `evidence/research.md`, current MCP OAuth discovery flow.

**Allowed tools:** web/GitHub research, source read/search.

**Forbidden actions:** no live requests to internal/cloud metadata endpoints; no code mutation.

**Expected output:** Observed Evidence / Interpretation / Risk / Source table and threat-boundary map.

**Completion criteria:** at least two independent meaningful signals and all metadata-derived URL fields classified.

**Handoff target:** Security Implementation Agent.

## Security Implementation Agent
**Mission:** route all relevant URL uses through one deterministic validator and safe-fetch/browser boundary.

**Responsibility:** integration, configuration, reason codes and safe defaults.

**Inputs:** threat map, policy, target client source.

**Required context:** existing HTTP/browser abstraction and deployment exceptions.

**Allowed tools:** source edit, build/test, deterministic scripts.

**Forbidden actions:** cannot add broad private-network allowlists, disable HTTPS checks, or mark its own high-risk implementation verified.

**Expected output:** implementation diff, config changes and test plan.

**Completion criteria:** all identified sinks guarded and builds/tests reach verifier.

**Handoff target:** Adversarial Verification Agent.

## Adversarial Verification Agent
**Mission:** independently prove that unsafe destinations cannot be reached through discovery, redirects or browser navigation.

**Responsibility:** execute safe local fixtures, inspect deny reasons, verify positive interoperability cases.

**Inputs:** implementation, policy, fixtures.

**Required context:** intended production/development exceptions.

**Allowed tools:** tests, local mock HTTP/DNS fixtures, logs, static source inspection.

**Forbidden actions:** no real cloud metadata/internal network probing; no weakening assertions to make tests pass.

**Expected output:** Implemented / Measured / Verified report with failures and residual risks.

**Completion criteria:** all required adversarial fixtures pass or blocking failure is reported.

**Handoff target:** owner/security reviewer.
