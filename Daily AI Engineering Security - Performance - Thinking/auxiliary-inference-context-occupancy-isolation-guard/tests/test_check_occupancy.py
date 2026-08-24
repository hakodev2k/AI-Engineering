import importlib.util,unittest
from pathlib import Path
R=Path(__file__).resolve().parents[1];S=importlib.util.spec_from_file_location('m',R/'scripts'/'check_occupancy.py');M=importlib.util.module_from_spec(S);S.loader.exec_module(M);P={'max_occupancy_drift_ratio':.03,'require_parent_delta_for_growth':True}
class T(unittest.TestCase):
 def test_aux_isolated(self):self.assertTrue(M.check({'parent_occupancy_before':80000,'parent_occupancy_after':80000,'auxiliary_usage_tokens':75000},P)['verified'])
 def test_rollup_blocks(self):self.assertFalse(M.check({'parent_occupancy_before':80000,'parent_occupancy_after':155000,'auxiliary_usage_tokens':75000},P)['verified'])
 def test_real_parent_growth(self):self.assertTrue(M.check({'parent_occupancy_before':80000,'parent_occupancy_after':82000,'parent_transcript_delta_tokens':2000,'auxiliary_usage_tokens':70000},P)['verified'])
if __name__=='__main__':unittest.main()