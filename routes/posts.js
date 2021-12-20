const router = require('express').Router();
const private = require('./privateToken');


router.get('/', private, (req,res) => {
   res.send(req.user);
});


module.exports = router;  