import importlib.util, unittest
from pathlib import Path
P=Path(__file__).resolve().parents[1]/'scripts/message_order_gate.py'
spec=importlib.util.spec_from_file_location('gate',P); gate=importlib.util.module_from_spec(spec); spec.loader.exec_module(gate)
POLICY={'max_gap':0,'allow_duplicates':True}
def ev(*seqs): return {'events':[{'message_id':f'm{i}','partition_key':'p','sequence':s} for i,s in enumerate(seqs)]}
class GateTests(unittest.TestCase):
    def test_ordered_passes(self): self.assertEqual('pass',gate.evaluate(ev(1,2,3),POLICY)['status'])
    def test_gap_blocks(self): self.assertEqual('block',gate.evaluate(ev(1,3),POLICY)['status'])
    def test_reverse_blocks(self): self.assertEqual('block',gate.evaluate(ev(2,1),POLICY)['status'])
    def test_duplicate_allowed_but_reported(self):
        r=gate.evaluate(ev(1,1,2),POLICY); self.assertEqual('pass',r['status']); self.assertTrue(r['findings'])
    def test_partitions_independent(self):
        e={'events':[{'message_id':'a','partition_key':'x','sequence':1},{'message_id':'b','partition_key':'y','sequence':7}]}
        self.assertEqual('pass',gate.evaluate(e,POLICY)['status'])
if __name__=='__main__': unittest.main()
