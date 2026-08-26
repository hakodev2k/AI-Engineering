import tempfile, unittest
from pathlib import Path
from scripts.tool_output_spill import spill, read_range, digest

POLICY={'spill_threshold_bytes':8,'preview_bytes':4,'max_read_bytes':16}

class SpillTests(unittest.TestCase):
    def test_small_output_not_spilled(self):
        with tempfile.TemporaryDirectory() as d:
            p=Path(d)/'in'; p.write_bytes(b'abc')
            r=spill(p,Path(d)/'store',POLICY)
            self.assertFalse(r['spilled']); self.assertIsNone(r['retrieval'])

    def test_large_output_is_losslessly_spilled(self):
        with tempfile.TemporaryDirectory() as d:
            data=b'abcdefghijklmno'
            p=Path(d)/'in'; p.write_bytes(data)
            r=spill(p,Path(d)/'store',POLICY)
            self.assertTrue(r['spilled'])
            stored=(Path(d)/'store'/f"{r['sha256']}.bin").read_bytes()
            self.assertEqual(stored,data); self.assertEqual(digest(stored),r['sha256'])

    def test_byte_range_retrieval(self):
        with tempfile.TemporaryDirectory() as d:
            data=b'0123456789abcdef'
            p=Path(d)/'in'; p.write_bytes(data)
            r=spill(p,Path(d)/'store',POLICY)
            q=read_range(Path(d)/'store',r['sha256'],4,5,16)
            self.assertEqual(q['text'],'45678'); self.assertFalse(q['eof'])

    def test_range_limit_enforced(self):
        with tempfile.TemporaryDirectory() as d:
            p=Path(d)/'in'; p.write_bytes(b'0123456789abcdef')
            r=spill(p,Path(d)/'store',POLICY)
            with self.assertRaises(ValueError): read_range(Path(d)/'store',r['sha256'],0,17,16)

    def test_digest_mismatch_blocks_read(self):
        with tempfile.TemporaryDirectory() as d:
            p=Path(d)/'in'; p.write_bytes(b'0123456789abcdef')
            r=spill(p,Path(d)/'store',POLICY)
            target=Path(d)/'store'/f"{r['sha256']}.bin"; target.write_bytes(b'tampered')
            with self.assertRaises(ValueError): read_range(Path(d)/'store',r['sha256'],0,4,16)

if __name__=='__main__': unittest.main()
