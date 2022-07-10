const express = require('express');
const bodyparser = require('body-parser');
const Dish = require('../model/dish');

const DishRouter = express.Router();

DishRouter.use(bodyparser.json());

DishRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    next();
})
.get((req, res, next) => {
    Dish.find({})
    .then((dishes) => {
        if(dishes != null){
            res.json({success: true, status: "Get list of dishes!", data: dishes});
        }
    }).catch((err) => { next(err) })
})
.post((req, res, next) => {
    Dish.create(req.body)
    .then((dish) => {
        if(dish != null){
            res.json({success: true, status: "Dish is posted!", data: dish});
        }
    }).catch((err) => next(err))
})
.put((req, res, next) => {
    res.statusCode = 401;
    res.json({success: false, status: "Cannot update list of dishes!"});
})
.delete((req, res, next) => {
    Dish.remove({})
    .then(() => {
        res.json({success: true, status: "All Dishes are Deleted!"});
    })
})

DishRouter.route('/:dishId')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    next();
})
.get((req, res, next) => {
    Dish.findById(req.params.dishId)
    .then((dish) => {
        if(dish != null){
            res.json({success: true, status: "Get the dish!", data: dish});
        }
    }).catch((err) => { next(err) })
})
.post((req, res, next) => {
    res.statusCode = 401;
    res.json({success: false, status: "Cannot perform post operation on particular dish!"});
})
.put((req, res, next) => {
    Dish.findByIdAndUpdate(req.params.dishId, {$set: req.body}, {new:true})
    .then((dish) => {
        res.json({success: true, status: "Dish is Updated!", data: dish});
    }).catch((err) => next(err))
})
.delete((req, res, next) => {
    Dish.findByIdAndRemove(req.params.dishId)
    .then(() => {
        res.json({success: true, status: "Dish is Removed!"});
    }).catch((err) => next(err))
})

DishRouter.route('/:dishId/comments')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    next();
})
.get((req, res, next) => {
    Dish.findById(req.params.dishId)
    .then((dish) => {
        if(dish != null){
            res.json({success: true, status: "Get the Comments of Dish!", data: dish.comments});
        }
    }).catch((err) => { next(err) })
})
.post((req, res, next) => {
    Dish.findById(req.params.dishId)
    .then((dish) => {
        if(dish != null){
            dish.comments.push(req.body);
            dish.save()
            .then((dish) => {
                res.json({success: true, status: "Comments are added into Dish!", data: dish});
            }).catch((err) => next(err)) 
        }
    }).catch((err) => next(err))
})
.put((req, res, next) => {
    res.statusCode = 401;
    res.json({success: false, status: "Cannot perform put operation on comments!"});
})
.delete((req, res, next) => {
    Dish.findById(req.params.dishId)
    .then((dish) => {
        if(dish != null){
            console.log(dish.comments.length);
            for(var i=dish.comments.length-1; i>=0; i--){
                dish.comments[i].remove();
            }
            dish.save()
            .then((dish) => {
                res.json({success: true, status: "All comments are deleted!", data: dish});
            }).catch((err) => next(err))
        }
    }).catch((err) => next(err))
})

DishRouter.route('/:dishId/comments/:commentId')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    next();
})
.get((req, res, next) => {
    Dish.findById(req.params.dishId)
    .then((dish) => {
        if(dish != null){
            res.json({success: true, status: "Get comment!", data: dish.comments.id(req.params.commentId)});
        }
    }).catch((err) => { next(err) })
})
.post((req, res, next) => {
    res.statusCode = 401;
    res.json({success: false, status: "Cannot post particular comment!"});
})
.put((req, res, next) => {
    Dish.findById(req.params.dishId)
    .then((dish) => {
        if(dish != null){
            if(req.body.comment){
                dish.comments.id(req.params.commentId).comment = req.body.comment;
            }
            if(req.body.rating){
                dish.comments.id(req.params.commentId).rating = req.body.rating;
            }

            dish.save()
            .then((dish) => {
                res.json({success: true, status: "Dish comments are updated!", data: dish});
            })
        }
    }).catch((err) => next(err))
})
.delete((req, res, next) => {
    Dish.findById(req.params.dishId)
    .then((dish) => {
        if(dish != null){
            dish.comments.id(req.params.commentId).remove()
            dish.save()
            .then((dish) => {
                res.json({success: true, status: "Comment is removed!", data: dish});
            }).catch((err) => next(err))
        }
    }).catch((err) => { next(err) })
})

module.exports = DishRouter;