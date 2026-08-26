# RAG Security and Prompt Injection

## Purpose
Reduce risks from malicious or untrusted retrieved content, poisoned corpora, data exfiltration, and instruction injection.

## When to use
Use for any RAG system ingesting user-controlled, external, or multi-author content.

## Inputs
Threat model, corpus trust levels, tool capabilities, identity model, prompt architecture, output channels.

## Context to inspect
Inspect ingestion permissions, retrieval ACLs, system/tool instructions, external content, rendering behavior, logging, and downstream actions.

## Core knowledge
Retrieved text is data, not trusted instruction. Prompt injection cannot be solved by a single phrase. Security requires privilege separation, least authority, provenance, validation, and constrained tool execution.

## Procedure
1. Classify sources by trust and attacker control.
2. Threat-model poisoning, indirect injection, exfiltration, and cross-tenant leakage.
3. Enforce authorization before retrieval.
4. Delimit retrieved content as untrusted evidence.
5. Keep secrets and privileged instructions out of retrievable context.
6. Minimize tool permissions and require independent authorization for actions.
7. Validate tool arguments and sensitive outputs.
8. Sanitize unsafe active content at rendering boundaries.
9. Build adversarial tests using corpus-borne instructions.
10. Monitor suspicious retrieval/action patterns.
11. Maintain incident procedures for poisoned documents and compromised indexes.

## Decision points
For high-impact actions, require deterministic policy checks or human approval rather than trusting model judgment. Exclude sources whose risk exceeds their retrieval value.

## Common failure patterns
Trusting retrieved instructions; relying only on prompt wording; exposing credentials in context; broad tool tokens; indexing attacker content without provenance.

## Verification
Run injection, cross-tenant, poisoned-document, tool-abuse, and exfiltration tests with negative controls.

## Expected output
A defense-in-depth RAG threat model and validated controls.

## Stop conditions
Stop deployment when privileged actions or sensitive data can be influenced by untrusted retrieved instructions without independent controls.