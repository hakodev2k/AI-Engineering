# Research — Agent Sandbox Host-Object Membrane Verifier

## Topic
Prevent untrusted agent-generated code from escaping an in-process sandbox through live host objects, cross-realm prototype chains, or unsafe bridges.

## Category
Security

## Problem
Agent frameworks increasingly execute model-generated JavaScript/Python in embedded sandboxes while exposing selected host objects for tool discovery or orchestration. A sandbox can appear isolated while a single live host object, error object, schema instance, proxy invariant, or language bridge exposes constructors or host capabilities that recover arbitrary code execution in the server process.

## Why it matters now
In 2026, multiple independent advisories demonstrate this exact boundary failure in agent/MCP runtimes. The failure is not hypothetical: it can turn one agent tool call into host-process code execution and credential access.

## Affected users
MCP server authors, coding-agent runtime developers, plugin/framework maintainers, platform security teams, and operators running model-generated code near OAuth tokens, API keys, filesystem access, or network credentials.

## Current public evidence
### Observed evidence
1. **FrontMCP / CVE-2026-67531, published 2026-08-06.** The sandboxed `codecall:execute` path exposed live host Zod schema instances. Zod v4's `_zod` property and ECMAScript Proxy invariants forced the security membrane to return a raw host object; untrusted code could reach a host `Function` constructor and execute in the server process. Fixed in FrontMCP 1.5.7. Source: https://github.com/agentfront/frontmcp/security/advisories/GHSA-mp29-fxh8-92px
2. **enclave-vm / CVE-2026-22686, published 2026-01-13.** A host-side `Error` object crossed into sandboxed JavaScript with its host prototype chain intact, allowing traversal to the host `Function` constructor and arbitrary host execution. Fixed in enclave-vm 2.7.0. Source: https://github.com/advisories/GHSA-7qm7-455j-5p63
3. **mcp-run-python / CVE-2026-25905, published 2026-02-09.** Pyodide-executed Python retained access to the JavaScript bridge, allowing executed code to modify the host JS environment and shadow MCP tools. The project was archived and no patch was available; isolation in a separate container/WASM boundary was recommended. Source: https://github.com/advisories/GHSA-pfv4-wmph-5gc6

## Existing approaches
- JavaScript Proxy/membrane wrappers around host values.
- In-process VM/sandbox libraries.
- AST validation before execution.
- Pyodide/WASM-style runtime isolation.
- Container/process isolation for untrusted code.
- Patching known sandbox libraries and removing unsafe bridges.

## Remaining limitations
A patched sandbox does not prove the application exposes only clone-safe values. New host object types, library upgrades, error paths, getters, symbols, prototypes, or non-configurable properties can reopen the boundary. AST validation cannot protect against an already-exposed host capability. In-process isolation shares a language runtime and therefore has a much smaller failure margin than a separate OS/process/container boundary.

## Root-cause analysis
- Trust boundary represented by object wrapping rather than capability elimination.
- Live host objects cross into untrusted code instead of data-only serialization.
- Cross-realm prototypes and constructors remain reachable.
- Error and exceptional paths receive less boundary testing than successful paths.
- Language bridges are enabled for convenience but effectively expose ambient authority.
- Security testing focuses on expected API calls rather than reflective/prototype traversal.

## Interpretation
The reusable engineering problem is broader than any one CVE: agent code sandboxes need a deterministic boundary contract that can be tested whenever host-facing libraries, schemas, tool descriptors, or runtime bridges change.

## Improvement opportunity
Adopt a **data-only crossing rule** plus deterministic membrane probes. Before exposing a value to untrusted code, classify it as primitive/structured-clone-safe data or reject it. Explicitly reject functions, constructors, prototypes, errors, class instances, accessors, symbols, weak collections, proxy-backed objects, and known bridge objects. For high-risk execution, move the code to a separate process/container with restricted filesystem/network/secrets. Run regression probes on normal and error paths.

## Goal
Make host capability leakage observable and release-blocking before model-generated code reaches production.

## Metrics
- live host-object exposures per sandbox API
- forbidden-value rejection coverage
- error-path probe coverage
- sandbox escape regression tests passed/total
- percentage of execution moved to separate process/container for high-risk workloads
- secrets visible to sandbox process

## Trigger
Any new/changed code-execution feature, tool/schema exposure, sandbox library upgrade, language bridge, or host object crossing.

## Inputs
Sandbox API inventory, exposed values, runtime/library versions, execution policy, test fixtures, process/network/secret boundary description.

## Outputs
Boundary inventory, deterministic probe report, blocked exposures, remediation decision, independent verification record.

## Proposed solution
See the package skill, rules, workflow, hook, policy, executable verifier, and tests. The proposed package is defense-in-depth; it does not claim an in-process membrane can be made equivalent to OS isolation.

## Relevant sources
- https://github.com/agentfront/frontmcp/security/advisories/GHSA-mp29-fxh8-92px
- https://github.com/advisories/GHSA-7qm7-455j-5p63
- https://github.com/advisories/GHSA-pfv4-wmph-5gc6
