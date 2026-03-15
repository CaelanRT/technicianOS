const express = require('express');
const {
    getSingleOrg,
    getOrgsForSignup,
    createOrg,
    getAllOrgs,
    updateOrg,
    deleteOrg,
} = require('../controllers/organizationController');
const {authenticateUser} = require('../middleware/authentication');

const router = express.Router();

router.get('/organizations/signup', getOrgsForSignup);
router.route('/organizations').post(authenticateUser, createOrg).get(authenticateUser, getAllOrgs);
router
    .route('/organizations/:id')
    .get(authenticateUser, getSingleOrg)
    .patch(authenticateUser, updateOrg)
    .delete(authenticateUser, deleteOrg);

module.exports = router;
