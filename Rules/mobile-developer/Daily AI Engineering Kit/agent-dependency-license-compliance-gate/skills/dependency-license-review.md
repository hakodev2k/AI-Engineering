# Dependency License Review Skill

## Purpose
Evaluate third-party dependency license risk before an AI agent adds, upgrades, or keeps a package.

## When to use
Use for dependency additions, upgrades, security fixes that change packages, generated dependency updates, release preparation, or SBOM review.

## Inputs
CycloneDX JSON SBOM, repository dependency manifests, target distribution model, and `config/license-policy.yaml`.

## Preconditions
The SBOM reflects the dependency state being reviewed. Package metadata must be obtained from trusted package/SBOM tooling; the agent must not invent missing license data.

## Allowed tools
Repository read/search, package-manager metadata commands, SBOM generation, `scripts/license_gate.py`, tests, and official license/package documentation.

## Constraints
1. Do not install or upgrade packages merely to discover metadata unless the task explicitly allows dependency changes.
2. Keep facts, hypotheses, and unresolved license metadata separate.
3. Run the deterministic gate before approval or merge recommendations.
4. Treat `blocked` as a hard stop and `approval_required` as not approved.
5. Never rewrite license metadata to make a package pass.

## Procedure
1. Identify changed direct and relevant transitive dependencies.
2. Generate or obtain the CycloneDX JSON for the exact candidate dependency graph.
3. Confirm component names, versions, purl/bom-ref, and license declarations.
4. Run `python scripts/license_gate.py --sbom <sbom.json> --policy config/license-policy.yaml --output license-gate-result.json`.
5. For `passed`, record the result and continue normal build/test verification.
6. For `approval_required`, collect authoritative license text/metadata, usage context, linking/distribution implications when relevant, and hand off to the license exception workflow.
7. For `blocked`, do not add/merge the dependency; identify an alternative or escalate to a human legal/compliance owner.
8. Re-run the gate after any dependency graph change.

## Expected output
Gate status, affected packages and versions, evidence source, policy decision, unresolved metadata, and recommended next action.

## Verification
The SBOM matches the candidate graph; the gate result was generated from that SBOM; no blocked package is represented as approved; any exception references an exact package/version.

## Failure handling
SBOM generation transient failure may be retried once. Missing or ambiguous license metadata does not get guessed; follow policy and escalate. Permission failures stop rather than causing broader access requests.

## Stop conditions
Blocked license, missing required metadata, stale SBOM, unresolved package identity, or approval-required result without explicit human approval.
