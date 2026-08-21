# Agent Capability Supply-Chain Verifier

## Category
Security

## Problem
Agents can discover convincing but malicious Skills, MCP servers, plugins, and repositories. Names, READMEs, registry placement, and popularity are attacker-influenceable and should not become installation authority.

## Evidence
See `evidence/research.md` for July–August 2026 public evidence from Island, UK AISI, and containment guidance from Anthropic.

## Existing approach and limitations
Registry curation, user approval, post-download scanning, and sandboxing are useful but leave a gap before installation: the agent may select the wrong capability based on manipulated discovery metadata. Approval is weak when it is not bound to immutable identity.

## Proposed improvement
Separate discovery from trust. Canonicalize identity, resolve immutable refs, hash the artifact, evaluate policy deterministically, and bind any required human approval to the exact digest/ref. Execution remains sandboxed after approval.

## Architecture
- `evidence/research.md` — current evidence, gap, root causes, metrics.
- `config/policy.json` — allow/deny, immutable-ref, approval, size, and sandbox policy.
- `skills/capability-verification.md` — reusable evidence-driven verification procedure.
- `rules/supply-chain-trust.md` — enforceable trust rules.
- `subagents/security-verifier.md` — independent verifier responsibility and handoff.
- `workflows/discover-verify-install.md` — bounded end-to-end workflow.
- `hooks/pre-install-gate.md` — deterministic blocking hook.
- `scripts/verify_capability.py` — executable identity/hash/approval gate.

## Installation
Requires Python 3.10+ and only the Python standard library. No secrets are required. Place candidate artifacts in an isolated staging directory.

## Configuration
Edit `config/policy.json`. Populate `allowed_owners` only with owners your organization has independently verified. Keep denied identities explicit. Do not disable immutable refs, digesting, or sandbox requirements merely to reduce friction.

## Usage
Create `candidate.json` with `source_url`, `owner`, `immutable_ref`, `artifact_path`, `install_command`, and an `approval` object. Run:

`python scripts/verify_capability.py candidate.json --policy config/policy.json`

Exit codes: `0` allow, `2` invalid evidence/input, `4` human approval required, `5` deny.

## Workflow
Follow `workflows/discover-verify-install.md`. Discovery agents may propose candidates but cannot approve them. The verifier does not execute candidates. The installer receives only an allowed, digest-bound artifact and retains sandbox/egress restrictions.

## Metrics
Track immutable-pin coverage, SHA-256 coverage, approval-to-digest binding, malicious-fixture block rate, benign-fixture pass rate, and post-install digest mismatches.

## Verification
### Implemented
The package implements deterministic URL/domain/owner checks, immutable commit validation, artifact-size validation, SHA-256 hashing, dangerous-install-pattern detection, and digest-bound expiring approval.

### Measured
Run a fixture suite that includes approved benign artifacts, lookalike owners, denied owners, mutable refs, artifact swaps, stale approvals, wrong-digest approvals, oversized artifacts, and shell-pipe install commands. Record pass/block rates.

### Verified
A topic deployment is verified only when malicious/lookalike fixtures are blocked before execution, benign allowlisted fixtures pass, unknown-owner fixtures require approval, artifact swaps invalidate approval, and the installed ref/digest matches the approved evidence.

## Safety
Never execute candidate code during verification. Never provide production secrets to staging. Treat README and package descriptions as untrusted. Sandboxing, filesystem restrictions, and network egress controls remain mandatory defense layers after trust verification.

## Failure handling
Evidence lookup/hash failures retry at most twice. Unresolved identity/digest failures fail closed. Approval expiration or artifact change requires a new approval. Deterministic policy denies do not auto-retry.

## Definition of Done
Evidence documented; source canonicalized; immutable ref captured; digest recorded; policy evaluated; required approval bound to digest/ref; pre-install hook passed; sandbox preserved; installed identity rechecked; independent verifier confirms audit evidence; no blocking discrepancy remains.

## Customization
Extend policy with organization-specific trusted registries, signing/provenance requirements, publisher identities, or package-manager-specific checks. Add checks without replacing immutable identity, digest binding, or sandbox boundaries.