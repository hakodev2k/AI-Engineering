#!/usr/bin/env python3
"""Deterministic admission gate for subagent result envelopes."""
import json
import re
import sys

HIGH_RISK = [
    ("secret_access", re.compile(r"(?:\.env\b|api[_ -]?key|access[_ -]?token|credential|private[_ -]?key)", re.I)),
    ("persistence", re.compile(r"(?:SessionStart|folderOpen|startup|autorun|hook\b|crontab|scheduled task)", re.I)),
    ("exfiltration", re.compile(r"(?:curl|wget|upload|webhook|send|post).{0,80}(?:secret|token|credential|\.env)", re.I | re.S)),
    ("instruction_override", re.compile(r"(?:ignore|override|bypass|disable).{0,60}(?:instruction|policy|safety|warning|permission)", re.I | re.S)),
]
MUTATION = re.compile(r"\b(?:write|create|modify|delete|install|execute|run|deploy|commit|push|chmod|shell)\b", re.I)
READ_ONLY_TYPES = {"research", "lookup", "documentation", "analysis", "review", "read-only", "readonly"}


def fail(message, code=4):
    print(json.dumps({"decision": "review", "findings": [message]}, sort_keys=True))
    return code


def main():
    try:
        data = json.load(sys.stdin)
    except Exception as exc:
        return fail(f"invalid_json:{type(exc).__name__}")

    if not isinstance(data, dict):
        return fail("root_must_be_object")
    task_type = str(data.get("task_type", "")).strip().lower()
    raw_text = data.get("raw_text")
    if not task_type or not isinstance(raw_text, str) or not raw_text.strip():
        return fail("missing_task_type_or_raw_text")

    observations = data.get("observations", [])
    citations = data.get("citations", [])
    actions = data.get("proposed_actions", [])
    if not isinstance(observations, list) or not isinstance(citations, list) or not isinstance(actions, list):
        return fail("observations_citations_actions_must_be_lists")

    combined_actions = "\n".join(str(x) for x in actions)
    findings = []
    severe = []
    for name, pattern in HIGH_RISK:
        if pattern.search(raw_text) or pattern.search(combined_actions):
            findings.append(name)
            if name in {"secret_access", "exfiltration", "instruction_override"}:
                severe.append(name)

    if task_type in READ_ONLY_TYPES and actions and MUTATION.search(combined_actions):
        findings.append("unsolicited_mutation_for_read_only_task")

    external_observations = [x for x in observations if isinstance(x, dict) and x.get("external", True)]
    if external_observations and not citations:
        findings.append("missing_provenance")

    source_trust = str(data.get("source_trust", "untrusted")).lower()
    if source_trust not in {"trusted", "mixed", "untrusted"}:
        findings.append("invalid_source_trust")

    if severe:
        decision, code = "quarantine", 3
    elif findings:
        decision, code = "review", 2
    else:
        decision, code = "allow", 0

    print(json.dumps({
        "decision": decision,
        "findings": sorted(set(findings)),
        "citation_count": len(citations),
        "observation_count": len(observations),
        "proposed_action_count": len(actions),
    }, sort_keys=True))
    return code


if __name__ == "__main__":
    sys.exit(main())
