# Agent Dependency Provenance Install Guard

## Topic
A deterministic security gate for dependencies proposed or executed by AI coding agents.

## Category
Security

## Problem
AI coding agents can hallucinate package names, select fresh or unsafe versions, or follow poisoned instructions that cause autonomous package installation. Once a plausible hallucinated name is registered by an attacker, a simple "does this package exist?" check is no longer sufficient. Installation is especially dangerous because lifecycle scripts and package-manager source mechanisms can execute package-controlled code before conventional review catches up.

## Evidence
Current evidence is documented in `evidence/research.md`. It includes a 2026 frontier-model replication showing persistent package hallucinations, a production-traffic hallucination corpus, Tencent Xuanwu Lab's ghost-dependency analysis, and GitHub/npm's 2026 supply-chain hardening work. These signals establish both recurring agent behavior and an actively defended package-consumption attack surface.

## Existing approach
Teams commonly rely on human review, registry existence checks, vulnerability scanners, lockfiles, popularity/reputation signals, provenance/signatures, and package-manager safety flags. These are valuable but fragmented. npm itself notes that valid provenance establishes source/build linkage rather than proving the package contains no malicious code.

## Existing limitations
- Registry existence becomes ineffective against already-registered slopsquats.
- Advisory databases may not contain a newly published malicious release.
- Post-install verification may occur after lifecycle code has executed.
- Manual review does not reliably cover nested agents, generated scripts, CI edits, or package-exec commands.
- Popularity alone can reject legitimate niche libraries or accept manipulated ones.
- Prompt-only instructions are bypassable if the shell/package-manager boundary does not enforce them.

## Proposed improvement
Treat dependency installation as a privileged state transition:

`proposal -> normalize -> registry evidence -> policy decision -> human boundary if required -> restricted install -> post-install verification -> independent completion gate`

The package provides deterministic npm/PyPI preflight checks, explicit exit codes, an auditable policy, fail-closed workflows, safe-install guidance, independent verification, and regression tests.

## Architecture
1. **Orchestrator/Hook** detects an install-capable action.
2. **Dependency Evidence Analyst** gathers authoritative registry metadata without installing anything.
3. **`dependency_guard.py`** applies deterministic policy and emits `allow/review/deny/error`.
4. **Human Approver** handles fresh/exception paths; autonomous agents cannot self-approve.
5. **Install Controller** executes only exact approved identities with restricted package-manager behavior.
6. **Independent Verifier** checks resolution, integrity/lock evidence, security checks, and tests before completion.

## Package structure
```text
agent-dependency-provenance-install-guard/
├── README.md
├── guide-intergration.md
├── config/
│   └── policy.json
├── evidence/
│   └── research.md
├── skills/
│   └── core-skills.md
├── rules/
│   └── engineering-rules.md
├── subagents/
│   └── subagents.md
├── workflows/
│   └── workflows.md
├── hooks/
│   └── hooks.md
├── scripts/
│   └── dependency_guard.py
├── tests/
│   └── test_dependency_guard.py
└── verification/
    └── verification.md
```

## Installation
Requirements: Python 3.10+ and network access to the authoritative npm/PyPI registry endpoints used by your project. No third-party Python packages are required.

From the package root, validate the implementation:

`python -m unittest tests/test_dependency_guard.py`

## Configuration
Edit `config/policy.json`:
- `require_exact_version`: default true for unapproved dependencies.
- `minimum_package_age_hours`: default 72-hour cooldown.
- `approved_packages` / `blocked_packages`: explicit per-ecosystem catalog.
- `block_deprecated_npm`: reject npm deprecated versions.
- `block_yanked_pypi`: reject PyPI versions whose release files are all yanked.
- `require_repository_url_for_unapproved`: ambiguous/new dependencies require review when source metadata is absent.
- non-registry sources are denied by default.
- `audit_log`: JSONL decision log path.

Do not make `--human-approved` available as an autonomous model-controlled boolean. Bind it to an actual external authorization mechanism.

## Usage
npm exact version:

`python scripts/dependency_guard.py --policy config/policy.json --ecosystem npm --spec 'some-package@1.2.3'`

PyPI exact version:

`python scripts/dependency_guard.py --policy config/policy.json --ecosystem pypi --spec 'some-package==1.2.3'`

Exit codes:
- `0`: allow
- `2`: human review required
- `3`: deny
- `4`: technical/policy processing error

Only exit `0` should permit package-manager execution.

## Workflow
Use `workflows/workflows.md` as the operational contract. The primary flow captures the current manifest/lockfile baseline, executes preflight, blocks review/deny/error outcomes, performs a restricted exact-version install after allow, collects lock/integrity/security/test evidence, and requires independent verification.

The install-path audit workflow validates that generated shell scripts, nested agents, CI edits, Dockerfiles, and package-exec commands cannot bypass the gate. The incident workflow handles packages that later become suspicious, yanked, deprecated, compromised, or blocked.

## Metrics
At minimum track:
- dependency actions total vs guarded;
- unguarded install actions (target: 0);
- allow/review/deny/error counts;
- nonexistent package blocks;
- fresh-release reviews;
- resolved identity mismatches;
- verification failures;
- guard latency and registry error rate.

Security success is not "the package looked safe." It is: the install boundary was enforced, disallowed paths were blocked, the exact approved identity was resolved, required security checks ran, and independent verification completed.

## Verification
See `verification/verification.md`. The package explicitly separates **Implemented**, **Measured**, and **Verified** states. Unit tests exercise deterministic policy decisions, while integration verification must demonstrate that the actual agent runtime cannot bypass the guard.

For npm, use provenance/signature verification such as `npm audit signatures` when supported, but retain defense in depth: valid provenance is attributable origin/build evidence, not proof of benign behavior.

## Safety
- Fail closed on registry/network/parser errors.
- Do not install a package to decide whether it is safe to install.
- Deny git/URL/local-path dependencies by default.
- Disable package lifecycle scripts during initial restricted installation whenever possible.
- Never log credentials or authorization headers.
- Do not let implementing agents self-approve high-risk exceptions.
- Do not automatically retry security failures with weaker settings.

## Failure handling
**Detection:** nonzero guard exit, registry mismatch, package freshness, deprecated/yanked release, disallowed source, post-install identity mismatch, signature/provenance/security test failure.

**Evidence:** preserve decision JSON, manifest/lock baseline and diff, package-manager output, resolved identity/integrity, and verifier record.

**Retry policy:** one bounded retry for transient registry/network failure; zero automatic retries for policy/security denials; maximum two remediation cycles for integration defects.

**Fallback:** block autonomous installation and require a human-reviewed alternative or an already-approved dependency.

**Escalation:** security owner/human approver for fresh packages, non-registry sources, ambiguous identity, or unresolved verification failure.

**Stop condition:** verified success or explicit human acceptance of residual risk; never weaken controls merely to make the task pass.

## Definition of Done
- Current evidence is documented and sourced.
- Policy is configured for the target runtime.
- Unit tests pass.
- 100% of known install-capable paths are gated.
- Nonexistent and disallowed-source fixtures cannot reach package-manager execution.
- Fresh-package fixture requires external approval.
- Exact approved direct dependency is the one resolved.
- Lock/integrity/hash evidence is captured.
- Required security/provenance/signature and project checks run where applicable.
- Independent verifier records `verified`.
- No blocking bypass remains.

## Customization
Add ecosystem adapters by preserving the same contract: canonical identity, authoritative registry evidence, exact version, age/freshness, yanked/deprecated state, source/provenance/integrity evidence, deterministic policy decision, restricted installation, and post-install verification. Extend policy rather than embedding project-specific exceptions in prompts. Keep package selection and human approval separate from package-manager execution.
