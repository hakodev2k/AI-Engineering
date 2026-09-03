import importlib.util, pathlib, unittest
P=pathlib.Path(__file__).parents[1]/'scripts'/'memory_admission_guard.py'
s=importlib.util.spec_from_file_location('guard',P); m=importlib.util.module_from_spec(s); s.loader.exec_module(m)
POLICY={'minimum_free_bytes_after_spawn':512*1024*1024,'reserve_fraction':0.15,'estimated_worker_bytes':384*1024*1024,'max_projected_utilization':0.90,'max_reclaim_retries':1}
GiB=1024**3
class TestGuard(unittest.TestCase):
    def test_admit_with_headroom(self): self.assertEqual(m.evaluate(16*GiB,8*GiB,POLICY)['decision'],'ADMIT')
    def test_block_when_worker_exceeds_headroom(self): self.assertEqual(m.evaluate(1*GiB,450*1024**2,POLICY)['decision'],'BLOCK')
    def test_override_worker_size(self): self.assertEqual(m.evaluate(4*GiB,2*GiB,POLICY,3*GiB)['decision'],'BLOCK')
    def test_invalid_measurement_rejected(self):
        with self.assertRaises(ValueError): m.evaluate(GiB,2*GiB,POLICY)
    def test_reserve_fraction_enforced(self):
        r=m.evaluate(8*GiB,2*GiB,POLICY,1*GiB); self.assertEqual(r['decision'],'BLOCK')
if __name__=='__main__': unittest.main()
