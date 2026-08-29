# Human Oversight Rules

## Purpose
Ensure human oversight is meaningful, competent, and operationally capable of preventing or correcting unacceptable AI decisions.

## Scope
Applies to human-in-the-loop, human-on-the-loop, review queues, escalation, override, appeal, and operator workflows.

## MUST
- Systems requiring human oversight MUST define what the human reviews, what evidence is available, what actions they may take, and when escalation is mandatory.
- Reviewers MUST have sufficient time, context, authority, and competence to challenge model outputs.
- Consequential decisions MUST provide a practicable override or escalation path when governance requires human control.
- Automation bias risk MUST be considered when humans routinely review high-volume AI recommendations.
- Override, escalation, and appeal outcomes MUST be logged when needed for assurance and learning.
- Human oversight effectiveness MUST be tested under realistic workload and failure conditions.

## MUST NOT
- MUST NOT label a process 'human in the loop' when reviewers merely confirm model outputs without meaningful ability to disagree.
- MUST NOT require humans to detect failures that are technically invisible to them.
- MUST NOT use impossible review volumes as evidence that oversight exists.

## SHOULD
- Interfaces SHOULD surface uncertainty, relevant evidence, policy constraints, and prior actions without misleading confidence cues.
- High-risk workflows SHOULD measure override rates, disagreement patterns, latency, reviewer workload, and missed incidents.
- Appeals SHOULD be routed to reviewers with sufficient independence when the original decision can materially affect a person.

## Exceptions
Exceptions MUST document why human oversight is reduced or removed, the resulting change in autonomy and risk, alternative controls, monitoring, and approval. High-impact autonomy changes require explicit review.

## Verification
Observe real workflows, inspect permissions, user interfaces, staffing assumptions, review logs, training records, escalation procedures, and sampled decisions. Test whether reviewers can actually interrupt or correct the system.