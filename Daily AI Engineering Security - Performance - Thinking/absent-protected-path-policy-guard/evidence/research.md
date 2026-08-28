# Research — Absent Protected Path Policy Guard

**Category:** Security  
**Research date:** 2026-08-28 (UTC+7)

## Topic
Sandbox and permission policies can fail to protect sensitive metadata paths that do not exist when the sandbox is constructed, allowing an agent to create and poison them for later trusted consumption.

## Problem
Many filesystem policy engines snapshot or materialize protection rules at sandbox setup time. If a protected path such as `.git`, `.codex`, `.agents`, Git worktree metadata, hooks, or configuration does not exist yet, the runtime may omit the deny rule or lack a portable way to express a deny for that future path. A writable parent then permits the agent to create the protected child. A later Git/Codex/tooling step can trust or execute the newly created metadata.

## Why it matters now
Two current Codex reports independently describe the same class across multiple platforms. On 2026-08-05, Codex issue #37082 reported that the native Windows sandbox only inserted deny entries for protected paths when those paths already existed, allowing creation of `.git`, `.codex`, or `.agents` under a writable root. On 2026-08-25, issue #40685 reported that permission profiles also cannot portably protect absent nested Git metadata across macOS Seatbelt and Linux/WSL bubblewrap. This turns a path-existence edge case into a persistence and trust-boundary problem.

## Affected users
Developers running coding agents with workspace-write access, agent-platform builders implementing filesystem policies, CI/remote-agent operators, and teams relying on protected repository metadata boundaries.

## Current public evidence

### Observed evidence
1. OpenAI Codex issue #37082, opened 2026-08-05, reports that Windows sandbox code gates deny insertion on `p.exists()`. A missing `.git`, `.codex`, or `.agents` therefore receives no deny ACE while the parent workspace remains writable. The report demonstrates a create-then-poison path and points to an existing test that codifies the empty-deny behavior for missing protected subdirectories.  
   https://github.com/openai/codex/issues/37082
2. OpenAI Codex issue #40685, opened 2026-08-25, reports that custom permission profiles lack a portable mechanism to protect exact nested metadata targets that are absent at sandbox construction time across macOS Seatbelt and Linux/WSL bubblewrap. The affected Git metadata includes missing hooks/modules directories and files such as `config.worktree` and `.lfsconfig`, which can redirect trusted behavior after creation.  
   https://github.com/openai/codex/issues/40685
3. Codex issue #32324, opened 2026-07-11, shows the inverse implementation hazard on Windows: materializing a missing `.git` merely to attach a deny ACL can itself mutate workspace semantics and trigger repeated Git probes/Defender activity. This means "just create the path first" is not a safe generic fix.  
   https://github.com/openai/codex/issues/32324
4. Codex sandbox documentation describes workspace-write as writable within the workspace while keeping protected paths such as `.git/` read-only. The observed absent-path behavior violates the intended invariant rather than merely a convenience expectation.  
   https://openai-codex.mintlify.app/concepts/sandboxing

### Interpretation
The core defect is temporal: the authorization policy is defined over a namespace of possible paths, but enforcement is derived only from the namespace that exists at setup time. Existence-sensitive expansion creates a time-of-policy-construction gap. Materializing missing paths to attach platform ACLs can introduce a second failure mode by altering repository/tool semantics.

## Existing approaches
- Protected-path lists for `.git`, `.codex`, `.agents`, and configured deny subpaths.
- Platform sandbox backends such as Windows ACLs, macOS Seatbelt and Linux bubblewrap.
- Permission profiles that grant writable parents while denying sensitive descendants.
- Pre-start glob/path expansion.
- Creating directories and applying ACLs before execution.

## Remaining limitations
- Snapshot-based expansion cannot deny a future exact path unless the backend supports namespace rules independent of existence.
- Materializing absent paths can itself change application behavior and create unwanted repository sentinels.
- Cross-platform policy backends differ in path semantics, so a policy that is secure on one platform may silently degrade on another.
- Configuration review alone cannot prove the effective runtime boundary.
- A later trusted consumer may execute or load poisoned metadata long after the untrusted write occurred.

## Root-cause analysis
1. Policy compilation depends on `exists()` rather than the declared protected namespace.
2. Parent-write permissions are broader than child-path protections.
3. Runtime backends expose different primitives for future-path denial.
4. Setup validation checks current filesystem state instead of future create capability.
5. Security verification usually tests reading/writing existing protected files, not first-time creation followed by trusted consumption.

## Improvement opportunity
Add a deterministic preflight and regression guard that models protected paths as namespace invariants independent of current existence. The guard must refuse configurations where a writable ancestor can create an absent protected descendant unless the selected backend can prove future-path denial without materializing the path. Verification should test both states: path absent and path present. It should also test a harmless create attempt in an isolated fixture and confirm that no protected sentinel is created as a side effect of policy setup.

## Relevant sources
- Codex #37082 — absent protected directory receives no deny rule on Windows: https://github.com/openai/codex/issues/37082
- Codex #40685 — absent nested metadata cannot be portably protected across Seatbelt/bubblewrap: https://github.com/openai/codex/issues/40685
- Codex #32324 — materializing missing `.git` to apply deny ACL changes workspace behavior: https://github.com/openai/codex/issues/32324
- Codex sandbox concepts: https://openai-codex.mintlify.app/concepts/sandboxing
