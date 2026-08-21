# MCP Upload Root Confinement Gate

Category: Security

## Problem
Remote or multi-user MCP upload tools can turn caller-controlled server-local paths into file-read and data-exfiltration primitives. CVE-2026-73498 in mcp-atlassian demonstrated this concretely: an upload tool opened a caller-supplied `file_path` without the safe-path validation already used elsewhere.

## Evidence and current approach
See `evidence/research.md`. Upstream mcp-atlassian fixed the issue in 0.22.0. Existing mitigations include upgrading, disabling server-local paths for remote transports, sandboxing the process, path validation, and human approval.

## Remaining limitation
A one-line validation fix is easy to miss in another upload path. Lexical prefix checks can be bypassed by traversal, symlinks, or alternate path forms. Model approval alone is not a deterministic filesystem boundary.

## Proposed improvement
Place one deterministic file-source gate immediately before every local-file read used by an upload/export tool. It resolves the candidate path, requires containment under configured roots, optionally rejects symlinks, limits file size, and emits only non-secret metadata.

## Package tree
- `evidence/research.md`
- `config/policy.json`
- `skills/upload-source-threat-model.md`
- `rules/local-file-egress-policy.md`
- `subagents/security-verifier.md`
- `workflows/secure-local-upload.md`
- `scripts/upload_path_guard.py`
- `tests/test_upload_path_guard.py`

## Installation
Python 3.10+, standard library only.

## Usage
`python scripts/upload_path_guard.py --policy config/policy.json --path ./safe-upload/report.txt`

Exit codes: 0 allow, 2 invalid input/config, 4 approval required, 5 deny.

## Metrics
Coverage of local-file upload paths, malicious fixture block rate, approval rate, false positives, rejected oversized files, and any secret-scanner findings.

## Safety
The guard does not upload data and never accepts secret values. Call it after resolving the intended local file but before opening it. Do not broaden roots merely to make a failing request pass.

## Failure handling
Fail closed on malformed paths, filesystem resolution errors, policy errors, or paths outside configured roots. Retry deterministic validation only after correcting input/policy, maximum two implementation cycles.

## Verification
Run `python -m unittest tests/test_upload_path_guard.py`. A verifier independent from the implementer must inspect every upload/export file-open path and confirm the gate precedes the read.

## Definition of Done
Implemented: every server-local upload path is gated. Measured: coverage and rejection metrics exist. Verified: tests pass; traversal, outside-root and symlink fixtures are blocked; intended files remain usable; no secret value is logged; independent verification finds no uncovered path.

## Customization
Use narrow per-tool roots, per-operation size limits, and provider-specific approval policies. Prefer client-provided byte/resource uploads over server-local path strings in remote MCP deployments.