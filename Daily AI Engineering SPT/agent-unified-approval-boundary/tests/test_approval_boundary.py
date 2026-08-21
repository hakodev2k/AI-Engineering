import importlib.util, json, time, unittest
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location("uab", ROOT/"scripts"/"approval_boundary.py")
uab=importlib.util.module_from_spec(spec); spec.loader.exec_module(uab)
POLICY=json.load(open(ROOT/"config"/"policy.json", encoding="utf-8"))


def req(transport="terminal", cap="filesystem.delete_recursive", args=None):
    return {"actor":"agent-a","parent_task":"task-1","transport":transport,"tool":"whatever","capability":cap,"target":"/tmp/demo","arguments":args or {"recursive":True}}

class BoundaryTests(unittest.TestCase):
    def test_route_equivalence_requires_approval(self):
        decisions={uab.decide(POLICY, req(t))["decision"] for t in ("terminal","mcp","subagent","docker")}
        self.assertEqual(decisions,{"REQUIRE_APPROVAL"})

    def test_unknown_fails_closed(self):
        self.assertEqual(uab.decide(POLICY, req(cap="unknown"))["decision"],"DENY")

    def test_missing_actor_fails_closed(self):
        r=req(); r["actor"]=""
        self.assertEqual(uab.decide(POLICY,r)["decision"],"DENY")

    def test_untrusted_annotation_cannot_auto_allow(self):
        r=req(); r["annotations"]={"readOnlyHint":True,"destructiveHint":False}
        self.assertEqual(uab.decide(POLICY,r)["decision"],"REQUIRE_APPROVAL")

    def test_scoped_token_allows_exact_operation(self):
        r=req(); r["approval_token"]=uab.make_token(r,300)
        self.assertEqual(uab.decide(POLICY,r)["decision"],"ALLOW")

    def test_argument_change_invalidates_token(self):
        r=req(); tok=uab.make_token(r,300)
        r2=req(args={"recursive":False}); r2["approval_token"]=tok
        self.assertEqual(uab.decide(POLICY,r2)["decision"],"REQUIRE_APPROVAL")

    def test_target_change_invalidates_token(self):
        r=req(); tok=uab.make_token(r,300); r["target"]="/tmp/other"; r["approval_token"]=tok
        self.assertEqual(uab.decide(POLICY,r)["decision"],"REQUIRE_APPROVAL")

    def test_expired_token_invalid(self):
        r=req(); tok=uab.make_token(r,-1); r["approval_token"]=tok
        self.assertEqual(uab.decide(POLICY,r)["decision"],"REQUIRE_APPROVAL")

    def test_read_only_allowed(self):
        self.assertEqual(uab.decide(POLICY,req(cap="filesystem.read"))["decision"],"ALLOW")

    def test_production_change_requires_approval(self):
        self.assertEqual(uab.decide(POLICY,req(cap="production.deploy"))["decision"],"REQUIRE_APPROVAL")

if __name__=="__main__": unittest.main()
