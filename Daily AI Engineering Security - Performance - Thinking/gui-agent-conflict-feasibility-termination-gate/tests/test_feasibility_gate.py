import importlib.util, json, os, unittest

SCRIPT=os.path.join(os.path.dirname(__file__),"..","scripts","feasibility_gate.py")
spec=importlib.util.spec_from_file_location("gate",SCRIPT); gate=importlib.util.module_from_spec(spec); spec.loader.exec_module(gate)

def base():
    return {"facts":["button visible"],"assumptions":[],"conflicts":[],"preconditions":["button visible"],"evidence":{"button visible":"observation-1"},"action":"click button","risk":"reversible","retry_count":0}

class GateTests(unittest.TestCase):
    def test_act_when_supported(self):
        self.assertEqual(gate.evaluate(base())["decision"],"ACT")
    def test_stop_on_conflict(self):
        r=base(); r["conflicts"]=[{"description":"goal conflicts with current state","blocking":True}]
        self.assertEqual(gate.evaluate(r)["decision"],"STOP")
    def test_review_missing_evidence(self):
        r=base(); r["evidence"]={}
        self.assertEqual(gate.evaluate(r)["decision"],"REVIEW")
    def test_stop_after_retry_limit(self):
        r=base(); r["evidence"]={}; r["retry_count"]=2
        self.assertEqual(gate.evaluate(r)["decision"],"STOP")
    def test_consequential_requires_approval(self):
        r=base(); r["risk"]="consequential"
        self.assertEqual(gate.evaluate(r)["decision"],"REVIEW")
        r["approval"]="approved"
        self.assertEqual(gate.evaluate(r)["decision"],"ACT")

if __name__=="__main__": unittest.main()
