# Research — Agent Dependency Provenance Install Guard

## Problem
AI coding agents sometimes suggest or install package names that are nonexistent, newly created, typosquatted, compromised, or otherwise insufficiently verified. Autonomous install steps convert a model error or poisoned instruction into executable supply-chain code before a developer reviews it.

## Category
Security

## Why it matters now
The problem is not theoretical. A 2026 replication study across frontier code-capable models measured package-name hallucinations at roughly 4.62%–6.10% and found 127 invented names shared across all five tested models, creating a predictable cross-model squatting surface. A public production-traffic dataset also records recurring hallucinated names across multiple coding agents and package ecosystems. Meanwhile GitHub/npm have continued shipping new supply-chain controls in 2026, including staged publishing, install-source restrictions, package cooldowns, and publish-time malware scanning, indicating that package-consumption risk remains an active engineering concern.

## Current public signals
1. **2026 frontier-model replication:** Churilov, *The Range Shrinks, the Threat Remains* (May 2026) tested 199,845 paired Python/JavaScript prompts across five frontier models. It reports non-zero package hallucination rates and a shared set of hallucinated names across models. Source: https://arxiv.org/abs/2605.17062
2. **Production agent traffic corpus:** DepScope's public dataset says it tracks verified hallucinated package names observed in production AI coding-agent traffic across 19 ecosystems, with repeated occurrences and likely-real alternatives. Source: https://github.com/cuttalo/depscope-hallucinations-dataset
3. **Ghost dependency research:** Tencent Xuanwu Lab describes "Ghost Package Names" and "Ghost Versions" in agentic coding and frames them as a supply-chain threat caused by autonomous dependency decisions. Source: https://xlab.tencent.com/en/2026/02/28/ghost-dependency-agentic-coding-supply-chain-threat/
4. **Registry hardening is still evolving:** GitHub's July 28, 2026 supply-chain update describes staged publishing, npm v12 install-script restrictions, and a default three-day Dependabot package cooldown designed to reduce exposure to malicious releases. Source: https://github.blog/security/supply-chain-security/disrupting-supply-chain-attacks-on-npm-and-github-actions/
5. **npm provenance:** npm documents provenance attestations and `npm audit signatures`, while explicitly warning that provenance establishes origin/build linkage but does not prove a package contains no malicious code. Source: https://docs.npmjs.com/generating-provenance-statements/ and https://docs.npmjs.com/viewing-package-provenance/

## Existing approaches
- Human review of agent-generated `npm install`, `npx`, `pip install`, manifest edits, and lockfile changes.
- Registry lookup and package popularity checks.
- Vulnerability scanners such as `npm audit` after dependency resolution.
- npm provenance/signature verification with `npm audit signatures` for installed packages that expose attestations/signatures.
- Lockfiles, exact versions, integrity hashes, package-manager script controls, and source restrictions.
- Repository-specific allowlists or approved dependency catalogs.
- New tools such as `slopcheck` that detect nonexistent npm package references in documentation/configuration.

## Observed limitations
- **Existence is not trust.** Once an attacker registers a hallucinated name, a simple registry-existence check changes from protective to permissive.
- **Vulnerability databases are reactive.** A freshly published malicious package may have no advisory yet.
- **Provenance is useful but incomplete.** npm's own docs state that provenance does not guarantee absence of malicious code.
- **Post-install scanning can be too late.** Package installation may execute lifecycle scripts unless explicitly restricted.
- **Manual review does not scale with autonomous agents.** Agents can propose dependencies repeatedly, in nested subagents, scripts, docs, or generated commands.
- **Popularity-only heuristics are brittle.** Legitimate niche packages can be low-volume, while malicious packages can manufacture signals.

## Root-cause hypotheses
1. Package choice is often treated as ordinary code generation rather than a privileged supply-chain decision.
2. Agent runtimes do not consistently distinguish "reference a package" from "execute package-controlled code".
3. Controls are fragmented across prompt rules, package managers, CI, and human review instead of enforced at a single install boundary.
4. Dependency identity, age, source, version, integrity, and provenance are not captured as one auditable decision record.
5. Retry or delegated execution can repeat install attempts without preserving the prior trust decision.

## Improvement target
Create a reusable pre-install gate that makes dependency installation a controlled transition:

`proposal -> normalize -> registry verify -> freshness/cooldown check -> source/integrity checks -> policy decision -> safe install mode -> post-install verification -> audit record`

The gate should fail closed on nonexistent packages, ambiguous identities, disallowed sources, unpinned high-risk requests, or policy errors; quarantine newly published dependencies for review; preserve an explicit approval record; and never claim that provenance alone means a dependency is safe.

## Success metrics
- 100% of new dependency-install actions pass through the guard in the integrated workflow.
- 0 nonexistent package names reach package-manager execution in adversarial tests.
- 0 disallowed git/remote/file sources reach execution.
- Newly published packages inside the configured cooldown are blocked or require explicit approval.
- Exact requested versions are recorded when available; floating versions are rejected when policy requires pinning.
- Every allow/deny/review decision produces machine-readable evidence.
- Security regression tests cover nonexistent, fresh, yanked/deprecated, direct URL, git, typo-similar, and allowlisted cases.

## Sources
- https://arxiv.org/abs/2605.17062
- https://github.com/cuttalo/depscope-hallucinations-dataset
- https://xlab.tencent.com/en/2026/02/28/ghost-dependency-agentic-coding-supply-chain-threat/
- https://github.blog/security/supply-chain-security/disrupting-supply-chain-attacks-on-npm-and-github-actions/
- https://github.blog/changelog/2026-05-22-staged-publishing-and-new-install-time-controls-for-npm/
- https://github.blog/changelog/2026-07-28-npm-publish-time-malware-scanning-and-dual-use-metadata/
- https://docs.npmjs.com/viewing-package-provenance/
- https://docs.npmjs.com/generating-provenance-statements/
