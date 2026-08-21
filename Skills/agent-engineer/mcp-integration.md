# MCP Integration

## Purpose
Integrate Model Context Protocol servers as governed capability boundaries rather than blindly exposing every available tool.

## When to use
Use when an agent needs reusable tools or resources offered through MCP.

## Inputs
Server capabilities, transport, authentication, tool/resource schemas, trust level, operational requirements.

## Context to inspect
Server ownership, permissions, network path, tool side effects, versioning, timeout behavior, and audit needs.

## Core knowledge
MCP standardizes discovery and invocation but does not make a server trustworthy. Capability selection, authentication, authorization, validation, and lifecycle remain application responsibilities.

## Procedure
1. Verify server provenance and supported protocol behavior.
2. Inventory tools/resources and classify side effects.
3. Expose only capabilities required by the agent.
4. Configure authentication without placing secrets in prompts.
5. Validate schemas and normalize errors.
6. Apply per-tool authorization and approval gates.
7. Set deadlines and bounded retries.
8. Record invocation metadata and outcomes.
9. Test server unavailability, schema drift, denied access, and malformed responses.
10. Pin or govern upgrades and re-evaluate changed capabilities.

## Decision points
Prefer MCP for standardized reusable integrations; direct APIs may be simpler when only one stable operation is needed.

## Common failure patterns
Auto-enabling all tools, trusting server descriptions as policy, leaking credentials, no timeout, and silent capability drift.

## Verification
Confirm least privilege, correct tool discovery, safe writes, failure handling, and auditability.

## Expected output
A governed MCP integration with explicit capability and trust boundaries.

## Stop conditions
Stop when server provenance, authentication, or side-effect semantics cannot be verified.