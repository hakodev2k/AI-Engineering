# Dependency License Safety Rules

## MUST
- Generate or obtain an SBOM for the exact dependency graph under review.
- Run `scripts/license_gate.py` before recommending merge/release of dependency changes.
- Preserve exact package identity and version in findings and approvals.
- Treat missing license metadata according to configured policy; never infer a license from package popularity or repository name.
- Require explicit human approval for every `approval_required` result before adding a policy exception.
- Re-run the gate after dependency, SBOM, or policy changes.
- Keep approval evidence separate from the package metadata itself.

## MUST NOT
- Change `config/license-policy.yaml` merely to make a failing dependency pass.
- Self-approve a package exception.
- Remove or alter SBOM license fields to evade a decision.
- Claim that passing this gate is legal advice or complete legal compliance.
- Add broad license-family allow rules when only one package/version was approved.
- Install, upgrade, remove, or replace dependencies unless the enclosing task authorizes repository changes.
- Expose private registry credentials, tokens, or package feed secrets.
- Merge or release a dependency with `blocked` status.

## SHOULD
- Prefer dependencies with clear SPDX license identifiers and stable purl/bom-ref values.
- Scope exceptions to an exact package and version where practical.
- Review transitive dependencies when they are shipped or otherwise relevant to distribution obligations.
- Reassess exceptions during major upgrades or distribution-model changes.
- Record alternative packages considered when an exception is requested.
