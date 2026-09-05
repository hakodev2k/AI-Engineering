import importlib.util, unittest
from pathlib import Path
R=Path(__file__).resolve().parents[1]
S=importlib.util.spec_from_file_location("gate",R/"scripts/idempotency_gate.py");G=importlib.util.module_from_spec(S);S.loader.exec_module(G)
P={"approval_required_risk_levels":["high","critical"],"block_on_unknown_high_risk":True}
def e(i,key="k",fp="f",status="started",risk="medium",tool="t",op="write",side=True):
    return {"event_id":str(i),"timestamp":"x","tool":tool,"operation":op,"idempotency_key":key,"request_fingerprint":fp,"status":status,"side_effecting":side,"risk":risk}
class Tests(unittest.TestCase):
    def test_single_commit_passes(self):
        r=G.analyze([e(1),e(2,status="committed")],P);self.assertEqual("pass",r["status"])
    def test_duplicate_commit_blocks(self):
        r=G.analyze([e(1,status="committed"),e(2,status="committed")],P);self.assertEqual("fail",r["status"])
    def test_key_fingerprint_collision_blocks(self):
        r=G.analyze([e(1,fp="a"),e(2,fp="b")],P);self.assertEqual("fail",r["status"])
    def test_high_risk_replay_after_unknown_blocks(self):
        r=G.analyze([e(1,status="unknown",risk="high"),e(2,status="started",risk="high")],P);self.assertEqual("fail",r["status"])
    def test_cached_resolution_avoids_unknown_replay_block(self):
        r=G.analyze([e(1,status="unknown",risk="high"),e(2,status="returned_cached",risk="high")],P);self.assertEqual("pass",r["status"])
if __name__=="__main__":unittest.main()
