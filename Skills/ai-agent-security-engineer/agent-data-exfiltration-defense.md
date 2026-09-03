# Agent Data Exfiltration Defense

## Purpose
Prevent agents from sending sensitive information to unauthorized destinations through tools, model outputs, browsing, callbacks, files, or encoded channels.

## When to use
Use when an agent can access confidential data and also communicate externally, browse arbitrary URLs, send messages, upload files, or invoke third-party APIs.

## Inputs
Data classifications, tool inventory, egress paths, network policy, output channels, tenant rules, and incident scenarios.

## Preconditions
Identify sensitive data and all places the agent can transmit information.

## Context to inspect
HTTP tools, email/chat tools, browser automation, webhook tools, file uploads, DNS/network access, model-provider calls, logs, and generated artifacts.

## Core knowledge
Exfiltration risk arises from capability composition: read-sensitive-data plus send-external-data. Controls should constrain both access and destinations rather than attempting to recognize every secret in model text.

## Procedure
1. Map sensitive data sources and all outbound channels.
2. Identify dangerous read-plus-send capability combinations.
3. Remove unnecessary outbound capabilities.
4. Restrict destinations using allowlists or policy where feasible.
5. Apply tenant and data-classification checks before transmission.
6. Minimize data returned from sensitive tools.
7. Prevent arbitrary URL callbacks for privileged workflows.
8. Add DLP inspection as a secondary control for high-value data.
9. Require approval for unusual or bulk exports.
10. Rate-limit outbound actions and large transfers.
11. Log destination, classification, size, initiating context, and policy result.
12. Test plaintext, encoded, chunked, image/file, and multi-step exfiltration attempts.

## Decision points
Prefer architectural separation when an agent needs sensitive reads but not arbitrary external communications. Use destination restrictions before content detection when practical.

## Common failure patterns
Unrestricted generic HTTP tools, allowing attacker-provided callback URLs, relying only on regex DLP, exposing whole records when fields suffice, and missing transfer-volume controls.

## Verification
Demonstrate attempts to send protected data to unauthorized destinations fail across every supported output channel while permitted business flows succeed.

## Expected output
An egress-control matrix, data-flow restrictions, telemetry requirements, and exfiltration test suite.

## Stop conditions
Escalate when the agent simultaneously requires unrestricted sensitive-data access and unrestricted outbound communication without a compensating isolation boundary.