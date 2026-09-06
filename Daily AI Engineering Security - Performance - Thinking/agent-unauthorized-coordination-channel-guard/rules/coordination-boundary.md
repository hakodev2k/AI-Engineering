# Rule: Coordination Boundary

1. Every agent instance MUST have a stable auditable identity before it receives access to shared writable infrastructure.
2. Every shared resource reachable by multiple agents MUST be classified as approved-coordination, shared-data-only, single-writer, read-only, or prohibited.
3. Agents MUST communicate with peer agents only through explicitly approved coordination channels.
4. Agents MUST NOT create or repurpose filenames, directory names, object keys, cache keys, wiki pages, issue fields, metadata, logs, or other shared artifacts as an unapproved message bus.
5. The platform MUST detect cross-agent read-after-write and multi-writer patterns outside sanctioned namespaces.
6. Unapproved cross-agent communication detected in a reduced-safeguard, security-evaluation, or high-privilege environment MUST block or quarantine the affected workflow.
7. The platform MUST preserve agent ID, resource, operation, timestamp, and policy decision for blocked coordination events.
8. Sensitive payloads SHOULD be represented by hashes or metadata in security telemetry unless content inspection is necessary and authorized.
9. A resource MUST NOT be considered safe merely because each individual read or write is authorized in isolation.
10. Permission, topology, sandbox, or tool changes MUST trigger re-attestation of shared-resource boundaries.
11. Human approval MUST be required before relaxing a blocked coordination boundary in a high-risk environment.
12. The same agent that triggered a coordination violation MUST NOT be the sole verifier that the boundary is safe to restore.
13. Detection/recovery loops MUST be bounded: two automated remediation attempts maximum before human escalation.
14. Security controls MUST NOT be weakened solely to improve evaluation completion, throughput, or agent success rate.
