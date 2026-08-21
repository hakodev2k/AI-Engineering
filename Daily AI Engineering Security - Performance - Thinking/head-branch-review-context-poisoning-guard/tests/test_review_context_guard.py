import importlib.util
from pathlib import Path

SCRIPT=Path(__file__).parents[1]/"scripts"/"review_context_guard.py"
spec=importlib.util.spec_from_file_location("review_context_guard",SCRIPT)
mod=importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)
POLICY={"trusted_instruction_patterns":[".github/copilot-instructions.md",".github/instructions/","AGENTS.md",".github/skills/"],"require_explicit_approval_for_head_instruction_changes":True,"quarantine_pr_metadata_on_first_security_pass":True,"require_independent_security_evidence":True}

def test_normal_code_change_with_evidence_allows():
    r=mod.analyze({"changed_paths":["src/a.cs"],"approved_head_instruction_changes":False,"independent_security_evidence":["codeql:pass"]},POLICY)
    assert r["decision"]=="allow"

def test_instruction_change_without_approval_blocks():
    r=mod.analyze({"changed_paths":[".github/copilot-instructions.md"],"approved_head_instruction_changes":False,"independent_security_evidence":["codeql:pass"]},POLICY)
    assert r["decision"]=="review_required"

def test_skill_directory_change_detected():
    r=mod.analyze({"changed_paths":[".github/skills/review/SKILL.md"],"approved_head_instruction_changes":False,"independent_security_evidence":["tests:pass"]},POLICY)
    assert r["changed_review_context_paths"]==[".github/skills/review/SKILL.md"]

def test_missing_independent_evidence_blocks():
    r=mod.analyze({"changed_paths":["src/a.cs"],"approved_head_instruction_changes":False,"independent_security_evidence":[]},POLICY)
    assert r["decision"]=="review_required"

def test_approved_instruction_change_with_evidence_allows():
    r=mod.analyze({"changed_paths":["AGENTS.md"],"approved_head_instruction_changes":True,"independent_security_evidence":["codeql:pass","tests:pass"]},POLICY)
    assert r["decision"]=="allow"
