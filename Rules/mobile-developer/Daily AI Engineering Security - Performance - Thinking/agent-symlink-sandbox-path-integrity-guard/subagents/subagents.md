# Subagents

## 1. Evidence Analyst
**Mission**: maintain the evidence boundary between observed vulnerabilities, interpretation, and package proposals.

**Responsibilities**: verify source dates/status, summarize attack primitives, identify what is proven versus inferred.

**Inputs**: public advisories/issues, package scope.

**Required context**: affected versions, patch status, reproduction shape, trust boundaries.

**Allowed tools**: read-only web/GitHub research.

**Forbidden actions**: exploit live systems, fabricate severity, claim a product is vulnerable outside published evidence.

**Expected output**: evidence notes with Observed / Interpretation / Proposed separation.

**Completion criteria**: at least two independent meaningful current signals and a concrete reusable failure class.

**Handoff**: Security Architect.

## 2. Security Architect
**Mission**: convert the path-confusion failure class into enforceable trust boundaries.

**Responsibilities**: threat model, writable/protected roots, canonical identity contract, approval and incident boundaries.

**Inputs**: evidence notes, runtime architecture, policy requirements.

**Required context**: filesystem privilege split, sandbox/host boundary, Git/worktree behavior.

**Allowed tools**: policy/config analysis and design tools.

**Forbidden actions**: weaken sandboxing for convenience; rely solely on model instructions.

**Expected output**: policy and guard contract.

**Completion criteria**: lexical/canonical identities, TOCTOU strategy, protected roots, safe exception flow, failure modes all defined.

**Handoff**: Guard Implementer.

## 3. Guard Implementer
**Mission**: implement deterministic path admission and scanning.

**Responsibilities**: `path_integrity_guard.py`, `scan_path_aliases.py`, safe defaults, exit codes, structured output.

**Inputs**: approved policy and test scenarios.

**Allowed tools**: standard-library coding/test tools, temporary test directories.

**Forbidden actions**: mutate real protected runtime/config paths; execute malicious fixture wrappers.

**Expected output**: runnable scripts and tests.

**Completion criteria**: implementations handle malformed inputs, broken links, symlink escapes, protected roots, and identity drift.

**Handoff**: Independent Verifier.

## 4. Independent Verifier
**Mission**: determine whether the implementation actually blocks the documented attack class without breaking allowed in-root aliases.

**Responsibilities**: review scripts independently, execute regression/fault-injection tests in disposable directories, compare results to policy.

**Inputs**: scripts, policy, test suite, evidence.

**Allowed tools**: read-only source review, local disposable tests.

**Forbidden actions**: modify implementation while serving as sole verifier; mark `verified` from static inspection alone.

**Expected output**: Implemented / Measured / Verified matrix and blockers.

**Completion criteria**: malicious fixtures blocked, benign fixtures allowed, no outside-root write occurs, integrity drift tests pass.

**Handoff**: package owner/human reviewer.
