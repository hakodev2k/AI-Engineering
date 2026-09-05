import importlib.util,unittest
from pathlib import Path
R=Path(__file__).resolve().parents[1]
S=importlib.util.spec_from_file_location("g",R/"scripts/check_embedding_compat.py");G=importlib.util.module_from_spec(S);S.loader.exec_module(G)
BASE={"provider":"p","model":"m","model_revision":"r1","dimensions":3,"normalization":"unit","distance_metric":"cosine","chunking_fingerprint":"c","index_namespace":"n","index_generation":"g1","rebuild_complete":True}
class T(unittest.TestCase):
    def test_identical_passes(self): self.assertEqual("pass",G.compare(BASE,dict(BASE))["status"])
    def test_model_change_without_rebuild_fails(self):
        x=dict(BASE);x["model"]="m2";x["rebuild_complete"]=False
        self.assertEqual("fail",G.compare(BASE,x)["status"])
    def test_dimension_change_same_generation_fails(self):
        x=dict(BASE);x["dimensions"]=4
        self.assertEqual("fail",G.compare(BASE,x)["status"])
    def test_breaking_change_new_complete_generation_passes(self):
        x=dict(BASE);x["model"]="m2";x["index_generation"]="g2";x["rebuild_complete"]=True
        self.assertEqual("pass",G.compare(BASE,x)["status"])
if __name__=="__main__":unittest.main()
