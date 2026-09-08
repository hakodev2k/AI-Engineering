from __future__ import annotations

from dataclasses import dataclass
from typing import Literal

Risk = Literal["READ", "WRITE", "HIGH_RISK", "DESTRUCTIVE"]


@dataclass(frozen=True)
class ToolPolicy:
    risk: Risk
    approval_required: bool
    upstream_tool: str


ALLOWED_UPSTREAM_TOOLS = frozenset({
    "semgrep_rule_schema",
    "get_supported_languages",
    "semgrep_findings",
    "semgrep_scan_with_custom_rule",
    "semgrep_scan",
    "semgrep_scan_remote",
    "get_abstract_syntax_tree",
    "semgrep_scan_supply_chain",
})


def validate_upstream_tool(name: str) -> None:
    if name not in ALLOWED_UPSTREAM_TOOLS:
        raise PermissionError(f"Upstream tool is not allowlisted: {name}")
