# Agent Runtime Version Cache Coherence Guard

**Category:** Token

## Problem
A resumable AI coding session can cross an auto-update, switch from IDE to CLI/cron, or be resumed by a stale binary. If the runtime reconstructs a different system/tool/context prefix, provider prompt caching may miss and rewrite hundreds of thousands of tokens even though the user did not materially change the task.

## Evidence
Current evidence is documented in `evidence/research.md`. August 2026 Claude Code reports include one-time full-cache rebuilds after background client updates and repeated ~760k-token rebuilds when a stale standalone CLI resumed a newer VS Code session.

## Existing approach
Teams commonly rely on provider caching, version pinning, and post-hoc usage inspection.

## Existing limitations
Those controls do not establish that the process about to resume a session has the same cache-relevant runtime fingerprint as the process that produced the last stable warm request.

## Proposed improvement
Persist a sanitized runtime fingerprint per session, compare it before expensive resumes, block unexplained high-cost mismatches, allow exactly one intentional re-baseline with a reason, and verify the first two resumed requests.

## Architecture
The package separates deterministic enforcement from investigation:
- policy thresholds in `config/policy.json`;
- executable preflight in `scripts/cache_coherence_guard.py`;
- deterministic integration hook in `hooks/pre-resume-cache-check.md`;
- diagnosis procedure and rules;
- independent investigator contract;
- bounded resume/verification workflow;
- executable regression tests.

## Package tree
```text
agent-runtime-version-cache-coherence-guard/
├── README.md
├── config/policy.json
├── evidence/research.md
├── hooks/pre-resume-cache-check.md
├── rules/cache-coherence.md
├── scripts/cache_coherence_guard.py
├── skills/diagnose-cache-coherence.md
├── subagents/cache-investigator.md
├── tests/test_cache_coherence_guard.py
└── workflows/pre-resume-and-verify.md
```

## Installation
Requires Python 3.9+ and no third-party packages. Copy the directory intact.

## Configuration
Adjust token thresholds and required fingerprint fields in `config/policy.json`. Do not remove safety-relevant fingerprint fields merely to increase cache hits.

## Usage
Construct a JSON input:
```json
{
  "previous": {
    "provider": "anthropic",
    "model": "claude-fable-5",
    "client_version": "2.1.231",
    "entrypoint": "vscode",
    "system_hash": "sha256:...",
    "hook_context_hash": "sha256:...",
    "tool_schema_hash": "sha256:...",
    "cache_policy": "1h"
  },
  "current": {
    "provider": "anthropic",
    "model": "claude-fable-5",
    "client_version": "2.1.207",
    "entrypoint": "sdk-cli",
    "system_hash": "sha256:...",
    "hook_context_hash": "sha256:...",
    "tool_schema_hash": "sha256:...",
    "cache_policy": "1h"
  },
  "estimated_context_tokens": 760000
}
```
Run:
```bash
python3 scripts/cache_coherence_guard.py resume.json --policy config/policy.json
```

## Workflow
Follow `workflows/pre-resume-and-verify.md`: Observe → Measure baseline → Diagnose → Hypothesize → Decide → Reconcile/rebaseline → Measure again → Verify.

## Metrics
Track cache-create tokens, cache-read tokens, reuse ratio, resume latency, predicted rewrite tokens, mismatched resumes, and repeated cold resumes.

## Verification
Run:
```bash
python3 -m unittest tests/test_cache_coherence_guard.py
```
A rollout is **Implemented** when the pre-resume gate executes; **Measured** when before/after cache metrics are captured; **Verified** only when later comparable resumes remain fingerprint-stable and satisfy the configured reuse threshold without security/correctness regression.

## Safety
Fingerprints must store hashes rather than raw prompts or credentials. Never weaken system instructions, tool permissions, hooks, or security controls to preserve cache identity. Large cold resumes are blocked only when the mismatch is unexplained; legitimate security changes must proceed through an intentional re-baseline.

## Failure handling
Detection: missing fingerprint fields, critical mismatch, or repeated low reuse. Evidence: gate JSON plus provider per-request usage. Retry: one re-baseline maximum for a fingerprint transition. Fallback: pause auto-resume and continue manually with an acknowledged cold baseline. Escalation: runtime owner. Stop: repeated incompatible resumes, unknown executable identity, or second unexplained cold request.

## Definition of Done
- Evidence documented.
- Cache baseline captured.
- Runtime mismatch classified.
- Gate installed and tests pass.
- No secret-bearing prompt material persisted.
- Intentional migration reason recorded where required.
- First two resumed requests measured.
- Before/after comparison complete.
- Security policy preserved.
- Independent verification complete with no blocking issue.

## Customization
Hosts may add stable fingerprint fields such as API endpoint, organization routing, or provider beta headers when evidence shows they affect request-prefix identity. Add fields conservatively and keep collection deterministic.
