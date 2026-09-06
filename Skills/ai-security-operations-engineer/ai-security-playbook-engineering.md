# AI Security Playbook Engineering

## Purpose
Create operational playbooks that turn recurring AI security alert types into consistent investigation, containment, recovery, and escalation procedures.

## When to use
Use when analysts repeatedly investigate the same class of AI incident, onboarding requires tribal knowledge, or response quality varies by responder.

## Inputs
Incident history, detection rules, system architecture, containment controls, escalation contacts, regulatory requirements, runbooks, and recovery options.

## Preconditions
The incident class is understood well enough to define safe default actions and known exceptions.

## Context to inspect
Review alert payloads, required evidence, affected system owners, service dependencies, kill switches, credential controls, provider contacts, privacy/legal obligations, and prior incident lessons.

## Core knowledge
A playbook must be executable under pressure. It should distinguish facts to collect, decisions requiring judgment, safe automated actions, approval-gated actions, verification, and termination criteria.

## Procedure
1. Define the incident class and entry criteria.
2. Specify minimum triage evidence and severity rules.
3. List investigation steps in dependency order.
4. Define containment options from narrowest to broadest.
5. Mark destructive or business-impacting actions as approval-gated.
6. Include evidence-preservation requirements.
7. Define recovery and credential/data remediation steps.
8. Specify verification that the threat is removed.
9. Add communication and escalation owners.
10. Add stop conditions and handoffs.
11. Exercise the playbook with realistic simulations.
12. Revise after incidents and system changes.

## Decision points
Automate deterministic, reversible, low-risk enrichment and containment. Keep human approval where business context, privacy, or large blast radius matters.

## Common failure patterns
Playbooks that only say 'investigate', stale screenshots, missing rollback steps, unsafe blanket credential revocation, no verification, and unclear ownership.

## Verification
Implemented means responders can access and follow the playbook. Verified means a tabletop or simulation completes successfully, required evidence is collected, decisions are clear, and containment is reversible where intended.

## Expected output
A versioned incident playbook with entry criteria, triage, investigation, containment, recovery, verification, escalation, and stop conditions.

## Stop conditions
Escalate when the incident does not match the playbook, evidence contradicts assumptions, or required actions exceed responder authority.