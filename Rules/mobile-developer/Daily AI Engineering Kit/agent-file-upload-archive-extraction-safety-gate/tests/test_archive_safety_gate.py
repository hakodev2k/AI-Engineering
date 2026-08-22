import importlib.util, os, tempfile, unittest, zipfile
from pathlib import Path

SCRIPT=Path(__file__).resolve().parents[1]/"scripts"/"archive_safety_gate.py"
spec=importlib.util.spec_from_file_location("archive_safety_gate",SCRIPT)
mod=importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)

class ArchiveSafetyGateTests(unittest.TestCase):
    def make_zip(self, entries):
        fd,path=tempfile.mkstemp(suffix=".zip"); os.close(fd)
        with zipfile.ZipFile(path,"w",zipfile.ZIP_DEFLATED) as z:
            for name,data in entries: z.writestr(name,data)
        self.addCleanup(lambda: os.path.exists(path) and os.remove(path))
        return path

    def test_normal_archive_passes(self):
        p=self.make_zip([("docs/readme.txt","hello"),("data/a.json","{}")])
        r=mod.scan(p,dict(mod.DEFAULTS))
        self.assertEqual("pass",r["status"])

    def test_parent_traversal_blocks(self):
        p=self.make_zip([("../escape.txt","bad")])
        r=mod.scan(p,dict(mod.DEFAULTS))
        self.assertEqual("block",r["status"])
        self.assertTrue(any("parent-traversal" in v for v in r["violations"]))

    def test_duplicate_normalized_path_blocks(self):
        p=self.make_zip([("a/../same.txt","x"),("same.txt","y")])
        r=mod.scan(p,dict(mod.DEFAULTS))
        self.assertEqual("block",r["status"])
        self.assertTrue(any("duplicate-normalized-path" in v for v in r["violations"]))

    def test_size_limit_blocks(self):
        p=self.make_zip([("big.bin",b"x"*32)])
        policy=dict(mod.DEFAULTS); policy["max_single_entry_bytes"]=8; policy["max_compression_ratio"]=10000
        r=mod.scan(p,policy)
        self.assertEqual("block",r["status"])
        self.assertTrue(any("single-entry-size-limit" in v for v in r["violations"]))

    def test_safe_extract_keeps_files_inside_root(self):
        p=self.make_zip([("folder/a.txt","ok")])
        r=mod.scan(p,dict(mod.DEFAULTS)); self.assertEqual("pass",r["status"])
        with tempfile.TemporaryDirectory() as d:
            mod.safe_extract(p,d,r)
            self.assertEqual("ok",(Path(d)/"folder"/"a.txt").read_text())

if __name__=="__main__": unittest.main()
