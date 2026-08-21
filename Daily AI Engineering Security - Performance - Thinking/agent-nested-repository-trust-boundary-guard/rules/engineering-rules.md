# Engineering Rules

## MUST
- MUST treat every nested Git repository and nested agent-config root as an independent trust boundary until attested.
- MUST run `nested_trust_guard.py` before delegation/re-rooting and after changes that can introduce nested roots.
- MUST fail closed when a nested root is unknown, unreadable, or absent from the current attestation.
- MUST require explicit human approval before writing executable Git hooks or agent policy/config files inside nested roots.
- MUST bind approval to exact root, path set, operation class, and current task.
- MUST re-scan after approved metadata changes.
- MUST independently verify high-risk metadata changes; the implementing agent cannot be the sole verifier.
- MUST preserve the stricter parent security baseline unless an explicitly approved exception says otherwise.
- MUST record sanitized evidence: paths, types, policy versions, hashes/identifiers where safe, decisions, and status.
- MUST stop before an out-of-sandbox Git operation if unreviewed nested hooks exist.

## MUST NOT
- MUST NOT assume sandbox, network, filesystem, approval, or tool policy inherits into a nested project because a child file omits those fields.
- MUST NOT execute, source, or import nested hook/config files merely to inspect them.
- MUST NOT follow directory symlinks during discovery.
- MUST NOT add broad workspace-wide exceptions to fix one nested repository.
- MUST NOT auto-approve a nested root solely because it is under `vendor/`, `examples/`, `fixtures/`, or a submodule path.
- MUST NOT silently weaken controls to make Git or agent tooling work.
- MUST NOT store secrets or file contents in the trust report; metadata-only evidence is sufficient for this guard.
- MUST NOT use unlimited retries. Scanner/re-attestation retry maximum is 1 after a transient filesystem race.

## SHOULD
- SHOULD keep the nested-root allowlist empty by default and add narrow entries intentionally.
- SHOULD separate read trust from write/execute trust.
- SHOULD pin submodules/dependencies and re-attest when their commit/root changes.
- SHOULD integrate the guard at pre-task, pre-delegation, pre-metadata-write and pre-finalization checkpoints.
- SHOULD expire or revalidate approvals when policy files, nested Git metadata, or repository topology changes.
- SHOULD measure false positives using representative legitimate nested repositories rather than weakening the default policy globally.
