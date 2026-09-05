import importlib.util, unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
SPEC=importlib.util.spec_from_file_location("gate",ROOT/"scripts/deadlock_gate.py")
G=importlib.util.module_from_spec(SPEC); SPEC.loader.exec_module(G)

class GateTests(unittest.TestCase):
    def test_detects_two_node_cycle(self):
        run={"run_id":"r","transactions":[{"id":"a"},{"id":"b"}],"wait_edges":[{"waiter":"a","holder":"b","resource":"x"},{"waiter":"b","holder":"a","resource":"y"}]}
        self.assertEqual(1,len(G.find_cycles(run)))
    def test_clean_run_has_no_cycle(self):
        run={"run_id":"r","transactions":[{"id":"a"},{"id":"b"}],"wait_edges":[{"waiter":"a","holder":"b","resource":"x"}]}
        self.assertEqual([],G.find_cycles(run))
    def test_gate_requires_baseline_reproduction(self):
        b={"runs":[{"run_id":"b","transactions":[{"id":"a"}],"wait_edges":[]}]}
        c={"runs":[{"run_id":str(i),"transactions":[{"id":"a"}],"wait_edges":[]} for i in range(3)]}
        self.assertEqual("fail",G.evaluate(b,c,1,3)["status"])
    def test_gate_rejects_candidate_cycle(self):
        b={"runs":[{"run_id":"b","transactions":[{"id":"a"},{"id":"b"}],"wait_edges":[{"waiter":"a","holder":"b","resource":"x"},{"waiter":"b","holder":"a","resource":"y"}]}]}
        bad={"run_id":"c","transactions":[{"id":"a"},{"id":"b"}],"wait_edges":[{"waiter":"a","holder":"b","resource":"x"},{"waiter":"b","holder":"a","resource":"y"}]}
        c={"runs":[bad,bad,bad]}
        self.assertEqual("fail",G.evaluate(b,c,1,3)["status"])
    def test_gate_accepts_reproduced_baseline_and_clean_candidate(self):
        b={"runs":[{"run_id":"b","transactions":[{"id":"a"},{"id":"b"}],"wait_edges":[{"waiter":"a","holder":"b","resource":"x"},{"waiter":"b","holder":"a","resource":"y"}]}]}
        c={"runs":[{"run_id":str(i),"transactions":[{"id":"a"},{"id":"b"}],"wait_edges":[]} for i in range(3)]}
        self.assertEqual("pass",G.evaluate(b,c,1,3)["status"])

if __name__=="__main__": unittest.main()
