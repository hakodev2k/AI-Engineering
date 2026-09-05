# MCP HTTP Auth + Bind Guard

**Category:** Security  
**Run date:** 2026-09-05 (UTC+7)

## Problem
MCP servers that expose command execution, filesystem, browser, cloud, or repository tools can become remotely reachable with no authentication when transport defaults bind broadly and authentication middleware is optional. CVE-2026-81735 made this failure mode concrete in ByteDance UI-TARS-desktop: MCP command/filesystem servers could bind to every interface without credentials.

## Evidence
See `evidence/research.md`. The package separates observed evidence from interpretation and from the proposed guard.

## Existing approach and limitation
Patching the affected project or changing the bind address mitigates one implementation. Firewalls and loopback-only listeners reduce reachability, while authentication and permission gateways constrain callers. The recurring engineering gap is that these controls are often optional, configured in different layers, and are not deterministically checked together before an MCP service starts.

## Proposed improvement
A fail-closed preflight policy combines four invariants: network exposure, authentication, dangerous-tool capability, and explicit exception approval. It blocks broad binds for unauthenticated services and blocks dangerous tools whenever authentication is absent, even on loopback unless a documented local-only exception exists.

## Architecture
- `skills/mcp-exposure-assessment.md` — evidence-driven assessment procedure.
- `rules/mcp-server-security.md` — enforceable security invariants.
- `subagents/security-reviewer.md` — independent review role.
- `workflows/research-diagnose.md` — observe and diagnose.
- `workflows/harden-verify.md` — implement and independently verify.
- `hooks/preflight.md` — deterministic blocking hook.
- `scripts/check_mcp_exposure.py` — executable policy checker.
- `config/policy.example.json` — example input.
- `tests/test_check_mcp_exposure.py` — regression tests.
- `evidence/research.md` — current public evidence.

## Installation
Requires Python 3.10+ and no third-party packages.

## Configuration
Copy `config/policy.example.json` and describe each MCP listener. Set `auth_required` from the actual transport path, not from an assumed upstream proxy. Mark tools such as shell execution, arbitrary filesystem writes, credential access, browser automation, deployment, and repository writes as dangerous.

## Usage
Run `python scripts/check_mcp_exposure.py config/policy.example.json`. Exit code 0 means the declared configuration satisfies the guard; exit code 2 means a blocking finding; exit code 1 means invalid input or runtime failure.

## Workflow
Observe actual listeners and middleware -> establish trust boundaries -> run baseline checker -> diagnose violations -> harden bind/auth/tool permissions -> rerun checker -> execute negative tests -> independent security review.

## Metrics
Track externally reachable unauthenticated listeners, dangerous tools reachable without auth, approved exceptions, failed negative-auth tests, and policy violations per deployment.

## Verification
**Implemented:** guard, rules, workflow, and tests exist.  
**Measured:** checker reports concrete violations from the supplied deployment model.  
**Verified:** all regression tests pass; no dangerous unauthenticated tool path remains; permission boundaries and required approvals remain intact.

## Safety
Never weaken authentication or listener restrictions to improve convenience. Never embed credentials in policy files. Dangerous or irreversible tool execution requires explicit human approval outside this checker.

## Failure handling
Detection is a nonzero checker result or failed negative test. Fix configuration/code and retry at most twice. If still failing, keep deployment blocked and escalate to a security owner. Never convert a blocking finding into a warning merely to ship.

## Definition of Done
Evidence documented; current deployment modeled; checker passes; negative authentication tests pass; dangerous tool authorization is verified; exceptions are explicit and approved; independent reviewer signs off; no secrets are present in repository artifacts.

## Customization
Extend `DANGEROUS_CAPABILITIES` in the script or add organization-specific policy checks while preserving fail-closed behavior.