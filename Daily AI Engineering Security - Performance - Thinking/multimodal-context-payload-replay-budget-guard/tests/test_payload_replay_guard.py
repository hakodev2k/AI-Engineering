import importlib.util, json, tempfile, unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("guard", ROOT / "scripts" / "payload_replay_guard.py")
guard = importlib.util.module_from_spec(spec)
spec.loader.exec_module(guard)

POLICY = {
    "max_inline_bytes_per_artifact": 100,
    "max_replays_per_artifact_per_thread": 1,
    "max_inherited_inline_bytes_per_child": 150,
    "max_total_inline_bytes_per_thread": 200,
    "require_hash_for_payload_bytes": 50,
    "fail_closed_on_missing_lineage": True,
    "allow_reference_rehydration": True,
}

class GuardTests(unittest.TestCase):
    def test_allows_small_first_use(self):
        manifest={"thread_id":"t1","is_child":False,"artifacts":[{"payload":"abc","inline_bytes":3}]}
        code,out=guard.check(POLICY,manifest,{"counts":{}})
        self.assertEqual(code,0); self.assertEqual(out["decision"],"allow")

    def test_requires_reference_for_replay(self):
        h=guard.artifact_hash({"payload":"abc"})
        manifest={"thread_id":"t1","is_child":False,"artifacts":[{"payload":"abc","inline_bytes":3}]}
        code,out=guard.check(POLICY,manifest,{"counts":{f"t1:{h}":1}})
        self.assertEqual(code,2); self.assertEqual(out["decision"],"reference")

    def test_blocks_missing_child_lineage(self):
        manifest={"thread_id":"c1","is_child":True,"artifacts":[]}
        code,out=guard.check(POLICY,manifest,{"counts":{}})
        self.assertEqual(code,3); self.assertEqual(out["reason"],"missing_parent_lineage")

    def test_blocks_child_inherited_budget(self):
        h="a"*64
        manifest={"thread_id":"c1","parent_thread_id":"p1","is_child":True,"artifacts":[{"sha256":h,"inline_bytes":160,"inherited":True}]}
        code,out=guard.check(POLICY,manifest,{"counts":{}})
        self.assertEqual(code,2); self.assertEqual(out["decision"],"block")

if __name__ == "__main__": unittest.main()
