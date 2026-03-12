const express = require('express');

const router = express.Router();

const processTranscript = require('../controllers/webhookController')

router.route('/webhooks/transcripts').post(processTranscript);

module.exports = router;