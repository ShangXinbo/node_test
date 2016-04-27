'use strict';

const uploads = require('multer')({dest: 'uploadfile'});
const upload = require('../controllers/upload');
const courier = require('../controllers/order');
const customer = require('../controllers/customer');
const index = require('../controllers/index');
const account = require('../controllers/account');

module.exports = function (app) {
    app
        .get('/', index)
        .post('/upload/submit',account.isLogged, uploads.single('file'), upload.submit)
        .get('/upload/',account.isLogged, upload.showtpl)
        /*.get('/sms/sendSingle', account.isLogged, sms.sendSingle)
        .get('/sms/list', account.isLogged, sms.showtpl)*/
        .get('/courier/user', account.isLogged, customer.list)
        .get('/courier/user/add*', account.isLogged, customer.add)
        .all('/courier/user/edit*', account.isLogged, customer.edit)
        .get('/courier/user/orders*', account.isLogged, customer.userOrders)
        .get('/courier/user/orderadd*', account.isLogged, customer.addOrder)
        .get('/courier/user/del*', account.isLogged, customer.del)
        .all('/login*', account.login)
        .all('/logout', account.logout);

    app.get('*',function(req,res){
        res.render('common/404');
    });

    app.use(function (err, req, res) {
        res.status(500).render('500', {
            error: err.stack
        });
    });
};

