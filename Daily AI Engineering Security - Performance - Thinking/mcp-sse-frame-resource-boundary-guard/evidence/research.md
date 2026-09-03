# Research Evidence

## Topic
MCP SSE Frame Resource Boundary Guard

## Category
Security

## Problem
MCP clients that consume Server-Sent Events can be remotely crashed when transport code accumulates an incomplete event without an explicit upper bound. The failure is particularly dangerous because the remote peer controls message framing and can keep sending bytes while withholding the event delimiter.

## Why it matters now
CVE-2026-53965 was published in August 2026 for the official Model Context Protocol PHP SDK. Versions `>=0.5.0,<0.7.1` appended 4 KiB chunks to an in-memory SSE buffer and drained it only after receiving the event delimiter. A malicious or compromised server could therefore cause memory exhaustion and denial of service. The fix in 0.7.1 added a maximum SSE buffer size. Similar resource-bounding work has appeared across other MCP SDK transports, showing that the problem is a recurring protocol-implementation class rather than a PHP-only coding mistake.

## Affected users
Developers building MCP clients, agent hosts connecting to remote MCP servers, platform teams running shared MCP gateways, and operators who permit third-party or semi-trusted MCP endpoints.

## Current public evidence

### Observed evidence
1. GitHub Advisory Database entry GHSA-7m52-jw36-44r3 describes an unbounded SSE buffer in `mcp/sdk`, reachable from a remote MCP server and able to crash the client through memory exhaustion. The advisory lists 0.7.1 as the patched version and recommends bounding the buffer and aborting the stream on overflow.
2. The CVE record for CVE-2026-53965 classifies the issue as uncontrolled resource consumption and documents the same delimiter-withholding attack path.
3. Public MCP security tracking in August 2026 also records comparable transport hardening in other SDKs, indicating a broader need for explicit frame/body limits rather than relying on well-behaved peers.

### Interpretation
The core engineering invariant is not merely "upgrade the PHP package." Any streaming agent transport that accepts attacker-controlled framing needs explicit limits for incomplete frames, total response size, idle duration, and failure telemetry. A dependency upgrade closes one known implementation, but heterogeneous agent stacks and custom transports can reproduce the same failure mode.

### Proposed solution
Provide a reusable preflight, policy, offline probe, and verification workflow that requires bounded incomplete-frame buffering, abort-on-limit behavior, observable failure, and regression testing with delimiter-free streams. The package does not replace vendor patches; it helps teams verify that equivalent boundaries exist across their own transports.

## Existing approaches
- Upgrade `mcp/sdk` to 0.7.1 or newer.
- Rely on language/runtime memory limits or container memory limits.
- Put reverse proxies in front of MCP servers with response/body/time limits.
- Implement transport-specific buffer caps.

## Remaining limitations
- Runtime/container memory limits terminate the process rather than safely rejecting the offending stream.
- Proxy limits may not bound post-decompression or parser-level incomplete-frame accumulation inside the client.
- A patched official SDK does not cover forks, custom clients, wrappers, or other streaming transports.
- Fixed byte caps without telemetry can turn a crash into a silent disconnect that is hard to diagnose.
- Limits that only cover complete messages do not protect the pre-delimiter accumulation path.

## Root-cause analysis
1. Protocol framing is treated as cooperative: the parser assumes a delimiter will eventually arrive.
2. Resource ownership is implicit: no component is clearly responsible for maximum incomplete-frame bytes.
3. Generic HTTP success is mistaken for safe application-layer framing.
4. Testing focuses on valid SSE events and ordinary disconnects, not adversarial non-terminating frames.
5. Process-level memory limits are used as a last-resort boundary instead of application-level rejection.

## Improvement opportunity
Standardize four measurable transport controls: `max_incomplete_frame_bytes`, `max_stream_bytes`, `max_idle_seconds`, and `overflow_action=abort`. Add an offline adversarial probe that verifies bounded buffering without contacting a live server, plus a blocking completion hook requiring evidence that overflow produces a controlled error and does not exceed the configured bound.

## Goal
Prevent a remote or compromised streaming peer from causing unbounded client memory growth while preserving normal SSE behavior.

## Metrics
- Peak incomplete-frame buffer bytes.
- Peak resident-memory delta during adversarial probe.
- Time to abort after configured boundary is crossed.
- Percentage of malformed-stream tests producing controlled failure.
- Normal-stream regression pass rate.
- Presence of structured overflow telemetry.

## Trigger
Use when adding/upgrading an MCP streaming transport, enabling a new remote MCP endpoint, changing SSE parsing, or reviewing any agent client that incrementally buffers framed network data.

## Inputs
Transport implementation or dependency version, configured limits, representative valid SSE fixtures, and adversarial delimiter-free fixtures.

## Outputs
Boundary assessment, deterministic probe results, remediation decision, and verification record.

## Relevant sources
- GitHub Advisory Database, GHSA-7m52-jw36-44r3, published 2026-08-14: https://github.com/advisories/GHSA-7m52-jw36-44r3
- MCP PHP SDK advisory: https://github.com/modelcontextprotocol/php-sdk/security/advisories/GHSA-7m52-jw36-44r3
- MCP PHP SDK v0.7.1 release: https://github.com/modelcontextprotocol/php-sdk/releases/tag/v0.7.1
- Fix commit: https://github.com/modelcontextprotocol/php-sdk/commit/055593f2592e1d7f5f48587c999ca7068a3be90d
- CVE-2026-53965 record: https://www.cve.org/CVERecord?id=CVE-2026-53965
