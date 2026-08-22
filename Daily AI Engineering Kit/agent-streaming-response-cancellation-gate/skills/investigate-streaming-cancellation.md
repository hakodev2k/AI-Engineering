# Investigate streaming cancellation

## Purpose
Find cancellation leaks that keep database readers, HTTP requests, queue consumers, or response writers alive after the caller is gone.

## Use when
A streaming API, SSE endpoint, async iterator, export, proxy, or long response consumes resources after disconnects or shutdown.

## Inputs
Entry point, reproduction or symptom, relevant logs/traces, repository root, and expected interruption semantics.

## Preconditions
Repository is readable; baseline behavior is known or reproducible; production writes are not required.

## Allowed tools
Repository search, build/test tools, logs/traces, local profilers, and `scripts/scan-streaming-cancellation.py`.

## Process
1. Identify the request/message boundary and source cancellation token.
2. Trace the streaming call graph through producers, transforms, storage, network calls, channels, writes, flushes, and cleanup.
3. Run `python scripts/scan-streaming-cancellation.py <repo> --json` and classify each finding as true/false positive.
4. Find operations that omit the token, replace it, catch cancellation broadly, or start detached work.
5. Establish evidence with a test or trace showing work continues after cancellation.
6. Define intended partial-output behavior and whether replay/resume is supported.
7. Propose the smallest propagation change; do not change public contracts without approval.
8. Verify cancellation at each affected boundary and inspect the diff for unrelated changes.

## Output
Facts, evidence, affected call chain, proposed change, verification result, and residual risk.

## Failure handling
If cancellation cannot be reproduced, preserve traces and mark the hypothesis unconfirmed. If a dependency lacks cancellation support, stop automatic remediation and document containment options.

## Stop conditions
Stop on required approval, missing evidence, production-only destructive reproduction, or two failed verification attempts with the same cause.
