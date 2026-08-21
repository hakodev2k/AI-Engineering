# Research

## Topic
MCP Upload Root Confinement Gate

## Category
Security

## Problem
An MCP tool that accepts a caller-controlled server-local path can read and exfiltrate files with the MCP server process's privileges.

## Why it matters now
NVD published CVE-2026-73498 on 2026-08-12. The affected mcp-atlassian versions before 0.22.0 passed `confluence_upload_attachment`'s client-supplied `file_path` to a local file open without calling the project's safe-path validator. The official GitHub advisories published in July also document the same broader server-local upload risk for Jira/Confluence, especially for HTTP/SSE/multi-user deployment.

## Affected users
MCP server authors, remote MCP operators, agent-platform teams, and users granting agents upload/write tools.

## Current public evidence — Observed
1. NVD CVE-2026-73498: affected `<0.22.0`, fixed in `0.22.0`, arbitrary file read through missing path validation in `confluence_upload_attachment`: https://nvd.nist.gov/vuln/detail/CVE-2026-73498
2. Upstream mcp-atlassian advisory GHSA-f6pj-qv47-g96w documents caller-controlled server-local attachment paths, impact in remote/multi-user deployments, and recommends default-denying local path uploads, an allowlisted root after realpath resolution, and preferring client-provided blobs/resources: https://github.com/sooperset/mcp-atlassian/security/advisories/GHSA-f6pj-qv47-g96w
3. Upstream advisory GHSA-mrq8-fv7v-hhjg independently documents HTTP upload tools accepting arbitrary server-local paths and distinguishes the upload exfiltration sink from download-path issues: https://github.com/sooperset/mcp-atlassian/security/advisories/GHSA-mrq8-fv7v-hhjg

## Existing approaches
Upgrade to 0.22.0+, validate paths, sandbox/containerize the MCP service, disable write/upload tools, require approvals, or replace server-local file paths with caller-supplied content/resource handles.

## Remaining limitations
Patching one code path does not prove every upload/export path is guarded. String-prefix checks are insufficient against canonicalization and symlink issues. Sandboxing reduces blast radius but still permits exfiltration of any readable secret inside the sandbox. Human/model approval cannot reliably identify whether a path resolves to sensitive server state.

## Root-cause analysis
- Caller intent controls a server-side filesystem capability.
- File-source validation is duplicated instead of centralized at the read boundary.
- Remote transport changes the trust model but tool schemas may remain unchanged.
- Validation may happen before canonicalization or without symlink policy.
- Upload permission can implicitly become local-file-read permission.

## Improvement opportunity
Use one deterministic pre-open gate with configured upload roots, canonical path resolution, symlink policy, file-size limits, and explicit approval behavior. Inventory all sinks and independently verify coverage.

## Goal
Make upload permission no more powerful than reading explicitly approved local upload roots.

## Metrics
100% local-file upload sink coverage; 100% traversal/outside-root test block rate; zero server secret fixtures uploaded; false-positive rate measured; no critical-context/security regression.

## Trigger
Any MCP/API tool is about to open a server-local file for upload, export, attachment, or transfer.

## Inputs
Candidate path, operation, transport/trust mode, configured roots, size policy, and optional approval metadata. Secret contents are excluded.

## Outputs
Allow/approval-required/deny decision, canonical path metadata, reason code, and matched root.

## Interpretation
The evidence proves a real class of local-file egress failures in a widely used MCP server. It does not imply all upload tools are vulnerable.

## Proposed solution
Centralize path confinement at the file-read boundary and verify sink coverage. This complements upstream patches, sandboxing, and approvals rather than replacing them.