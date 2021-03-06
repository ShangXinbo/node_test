

'use strict';

const Customer = require('../models/Customer');
const Order = require('../models/Order');
const Map = require('../configs/map');
const FN = require('../classes/functions');

exports.list = function (req, res) {
    let page = req.query.page ? req.query.page : 1;
    page--;
    let pageNum = 15;
    let param = {};
    let keyword = '';
    if(req.query.keyword){
        keyword = FN.removeHTMLTag(req.query.keyword);
        if(keyword){
            if(isNaN(keyword)){
                param.name = {$regex:eval('/'+ keyword+ '/i')};
            }else{
                param.tel = {$regex:eval('/'+ keyword+ '/i')};
            }
        }
    }

    Customer.getLists(param, page * pageNum, pageNum, function (err, doc) {
        Customer.count(param,function(err,count){
            res.render('customer/list', {
                title: '客户管理',
                keyword: keyword,
                customers: doc,
                towns: Map.town,
                pages: {
                    current: parseInt(page) + 1,
                    total : Math.ceil(count/pageNum)
                }
            });
        });
    });
};

exports.add = function (req, res) {
    let name = req.query.name;
    let tel = req.query.tel;
    let time = new Date().getTime();
    let town = req.query.town;
    let marks = req.query.marks;

    if(name && FN.isRealPhone(tel)){
        Customer.add({
            name: name,
            tel: tel,
            town: town ? town : 1,   // default '菜园村'
            useful: 1,
            marks: marks,
            join_time: time,
            last_time: time
        },function(err,data){
            if (data) {
                res.send(FN.resData(0, '添加成功', data));
            }else{
                res.send(FN.resData(1, err.toString()));
            }
        });
    }else{
        res.send(FN.resData(1, '参数格式不正确，添加失败'));
    }
};

exports.del = function (req, res) {

    //TODO 删除用户时检查是否有订单
    let arr = req.query.arr;
    if(arr.length){
        Customer.delByIdArr(arr,function(err,data){
            if(data){
                res.send(FN.resData(0, '删除成功'));
            }else{
                res.send(FN.resData(1, err.toString()));
            }
        });
    }else {
        res.send(FN.resData(2, '没有指定可删除的数据id'));
    }

};

exports.edit = function(req,res){
    let getId = req.query.id;
    let postId = req.body.id;
    if(getId){
        Customer.findById(getId,function(err,doc){
            res.render('customer/edit',{data:doc,towns: Map.town});
        });
    }else{
        if(postId){
            Customer.findByIdAndUpdate(postId,{
                name: req.body.name,
                tel : req.body.tel,
                town: req.body.town,
                marks: req.body.marks
            },{},function(err,doc){
                res.send(FN.resData(0, '修改成功'));
            });
        }else{
            console.log('edit_error');
        }
    }
};

exports.userOrders = function(req,res){
    let getId = req.query.id;
    if(getId){
        Order.findByUserId(getId,function(err,orders){
            Customer.findById(getId,function(err,user){
                res.render('customer/orders',{data:orders,user:user,curier_company:Map.curier_company});
            });
        });
    }else{
        console.log('');
    }
};

exports.addOrder = function(req,res){
    let getId = req.query.id;
    let code = req.query.code;
    let company = req.query.company;
    let in_time =  new Date(req.query.in_time).getTime();
    let now = new Date().getTime();
    var order = new Order({
        owner: getId,
        code : code,
        company: company,
        pick_way: 0,
        status: 0,
        in_time: in_time,
        out_time: '',
        add_time: now
    });

    order.save(function(err,result){
        console.log(err);
        res.send(FN.resData(0, '添加成功'));
    });
};








