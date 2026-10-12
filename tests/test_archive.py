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

class ArchiveAdversarialTests(unittest.TestCase):
    setUp = ArchiveAuditTests.setUp
    tearDown = ArchiveAuditTests.tearDown
    """Synthetic malicious archives only: never download client content in toolkit tests."""

    def test_bad_file_names(self):
        from zipfile import ZipFile
        paths = ['C:/windows/secrets.txt', '/etc/passwd', 'project/../../escape.txt', 'project\\..\\private.txt']
        original = self.path.read_bytes()
        for name in paths:
            with self.subTest(name=name):
                self.path.write_bytes(original)
                with ZipFile(self.path, 'a') as z:
                    z.writestr(name, 'synthetic malicious path')
                self.assertEqual(module.audit(self.path, self.manifest, 'unverified')['status'], 'BLOCKED')

    def test_symlink_is_blocked(self):
        import stat
        from zipfile import ZipInfo
        info = ZipInfo('project/link.txt')
        info.create_system = 3
        info.external_attr = (stat.S_IFLNK | 0o777) << 16
        with ZipFile(self.path, 'a') as z: z.writestr(info, '../wherever')
        result = module.audit(self.path, self.manifest, 'unverified')
        self.assertIn('Symbolic link', str(result['blockers']))

    def test_member_limit_fails_closed(self):
        from unittest.mock import patch
        with patch.object(module, 'MAX_FILES', 1):
            result = module.audit(self.path, self.manifest, 'unverified')
        self.assertIn('Too many archive members', str(result['blockers']))

    def test_compression_ratio_fails_closed(self):
        from zipfile import ZIP_DEFLATED
        with ZipFile(self.path, 'a') as z:
            z.writestr('project/compressed.dat', b'x' * (2 * 1024 * 1024), compress_type=ZIP_DEFLATED)
        result = module.audit(self.path, self.manifest, 'unverified')
        self.assertIn('Extreme compression ratio', str(result['blockers']))

    def test_corrupt_config_cannot_pass(self):
        with ZipFile(self.path, 'w') as z:
            z.writestr('project/index.html', '<p>Test</p>')
            z.writestr('project/wix.config.json', '{invalid json}')
        result = module.audit(self.path, self.manifest, 'wix-original')
        self.assertEqual(result['status'], 'BLOCKED')
        self.assertFalse(result['identityMatchesHandoff'])
