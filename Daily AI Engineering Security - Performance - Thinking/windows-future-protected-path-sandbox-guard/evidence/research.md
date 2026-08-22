# Research

## Topic
Windows Future-Protected-Path Sandbox Guard

## Category
Security

## Problem
Filesystem sandbox enforcement can be object-existence dependent: a sensitive child path that is absent when ACL/policy state is constructed may inherit a writable parent and become creatable by the agent.

## Why it matters now
### Observed evidence
- OpenAI Codex issue #37082, opened **2026-08-05**, reports that native Windows sandbox logic only inserts protected `.git`/`.codex`/`.agents` deny paths when they already exist. A missing protected directory therefore receives no deny rule while its parent workspace is writable, enabling later creation and poisoning. https://github.com/openai/codex/issues/37082
- OpenAI Codex issue #32872, opened **2026-07-10**, reports the inverse workaround hazard: materializing a missing `.git` directory so the sandbox can attach a deny ACL changes repository-discovery behavior and breaks Visual Studio workflows. https://github.com/openai/codex/issues/32872
- OpenAI Codex issue #31265, opened **2026-07-06**, reports native Windows read-deny policy becoming silently ineffective while write-deny still works, showing why desired policy must be verified against effective runtime enforcement rather than assumed from configuration. https://github.com/openai/codex/issues/31265

### Interpretation
The durable abstraction is not “attach an ACL to every current sensitive directory.” It is “deny operations whose resolved target falls inside a protected logical path, whether that object exists yet or not,” with platform ACL/sandbox enforcement independently attested.

## Affected users
Windows coding-agent users, IDE-integrated agents, enterprise platform teams, repositories where `.git`, agent config, hooks, generated control directories, or security metadata may appear after session start.

## Existing approaches
- Windows ACL/DACL deny entries.
- Workspace-write sandbox roots.
- Hard-coded protected subpath lists.
- Materializing directories before attaching ACLs.

## Remaining limitations
ACLs cannot protect a filesystem object that is not represented safely by the backend. Creating sentinel directories solely for protection can itself change application semantics. Configuration may also diverge from effective ACL state.

## Root-cause analysis
1. Protection model is coupled to current filesystem existence.
2. Writable-parent inheritance is evaluated independently from future protected descendants.
3. Policy construction and tool authorization are separated without a final target-path invariant.
4. Desired policy lacks deterministic runtime attestation.

## Improvement opportunity
Add an existence-independent pre-tool target guard using canonical workspace-relative paths, while retaining native sandbox controls. Test every protected path in both absent and present states.

## Goal
Block creation, write, rename-into, and delete operations targeting protected control paths without materializing those paths or weakening the native sandbox.

## Metrics
100% protected fixtures blocked; 0 allowed-fixture false positives; all configured paths covered in absent/present tests; failures produce auditable reason codes.

## Trigger / Inputs / Outputs
Trigger: before filesystem-mutating tool execution. Inputs: workspace root, requested path, operation, policy. Output: allow/deny with canonical path and matched protected rule.

## Relevant sources
- https://github.com/openai/codex/issues/37082
- https://github.com/openai/codex/issues/32872
- https://github.com/openai/codex/issues/31265
