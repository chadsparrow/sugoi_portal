const express = require('express');
const router = express.Router();
const proofsController = require('../controllers/proofs');

const { ensureAuthenticated, ensureEditProofs } = require('../helpers/auth');

router.route('/:id').get(ensureAuthenticated, proofsController.getProofPage);

router
	.route('/qc/:orderNum')
	.get(ensureAuthenticated, ensureEditProofs, proofsController.getQCPage);

router
	.route('/qc/edit/:id')
	.get(ensureAuthenticated, ensureEditProofs, proofsController.getQCEditPage)
	.put(ensureAuthenticated, ensureAuthenticated, proofsController.updateQC);

router
	.route('/qc/archive/:id')
	.get(ensureAuthenticated, ensureEditProofs, proofsController.archiveQCNote);

router
	.route('/qc/archive/view/:orderNum')
	.get(ensureAuthenticated, ensureEditProofs, proofsController.viewQCArchives);

module.exports = router;
