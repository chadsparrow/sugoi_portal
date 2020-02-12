const express = require('express');
const router = express.Router();

const {
	getProofPage,
	getQCPage,
	getQCEditPage,
	updateQC,
	archiveQCNote,
	viewQCArchives
} = require('../controllers/proofs');

const { ensureAuthenticated, ensureEditProofs } = require('../helpers/auth');

router.route('/:id').get(ensureAuthenticated, getProofPage);

router
	.route('/qc/:orderNum')
	.get(ensureAuthenticated, ensureEditProofs, getQCPage);

router
	.route('/qc/edit/:id')
	.get(ensureAuthenticated, ensureEditProofs, getQCEditPage)
	.put(ensureAuthenticated, ensureAuthenticated, updateQC);

router
	.route('/qc/archive/:id')
	.get(ensureAuthenticated, ensureEditProofs, archiveQCNote);

router
	.route('/qc/archive/view/:orderNum')
	.get(ensureAuthenticated, ensureEditProofs, viewQCArchives);

module.exports = router;
