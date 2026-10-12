import io
import json
import tempfile
import unittest
from pathlib import Path
import importlib.util
from zipfile import ZipFile

script=Path(__file__).parents[1]/'scripts'/'audit-wix-archive.py'
spec=importlib.util.spec_from_file_location('audit_wix_archive',script)
module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)

class ArchiveAuditTests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory()
        self.path=Path(self.tmp.name)/'demo.zip'
        self.manifest={'wix':{'siteId':'11111111-1111-4111-8111-111111111111','clientId':'22222222-2222-4222-8222-222222222222'}}
        with ZipFile(self.path,'w') as z:
            z.writestr('project/index.html','<h1>Test</h1>')
            z.writestr('project/wix.config.json',json.dumps({'siteId':self.manifest['wix']['siteId'],'appId':self.manifest['wix']['clientId'],'site':{'outputDirectory':'.'}}))
    def tearDown(self):self.tmp.cleanup()
    def test_good_archive(self):
        r=module.audit(self.path,self.manifest,'wix-original')
        self.assertEqual(r['status'],'REVIEW_REQUIRED')
        self.assertFalse(r['provenanceVerified'])
        self.assertTrue(r['identityMatchesHandoff'])
    def test_unsafe_paths_block(self):
        with ZipFile(self.path,'a') as z: z.writestr('../malicious.js','alert(1)')
        self.assertEqual(module.audit(self.path,self.manifest,'unverified')['status'],'BLOCKED')

    def test_duplicate_paths_block(self):
        import warnings
        with warnings.catch_warnings():
            warnings.simplefilter('ignore')
            with ZipFile(self.path,'a') as z: z.writestr('project/index.html','different')
        self.assertEqual(module.audit(self.path,self.manifest,'unverified')['status'],'BLOCKED')

    def test_claimed_origin_is_not_verification(self):
        r=module.audit(self.path,self.manifest,'wix-original')
        self.assertEqual(r['provenanceClaim'],'wix-original')
        self.assertFalse(r['provenanceVerified'])
        self.assertEqual(r['status'],'REVIEW_REQUIRED')

    def test_mismatched_identity_blocks(self):
        self.manifest['wix']['siteId']='33333333-3333-4333-8333-333333333333'
        r=module.audit(self.path,self.manifest,'unverified')
        self.assertEqual(r['status'],'BLOCKED')

if __name__=='__main__': unittest.main()
