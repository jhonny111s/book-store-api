const { mergePatch } = require('../utils/util');
const mongodb = require("mongodb");

function find(model, body = {}) {
    return new Promise((resolve, reject) => {
        model.find(body, function (err, res) {
          if (err) return reject(err);
          return resolve({statusCode: 200, message: res});
        });    
    });
}

function findAll(model) {
    return find(model);
}

function findByConditions(model, conditions) {
    return new Promise((resolve, reject) => {
        if (conditions._id && !mongodb.ObjectID.isValid(conditions._id)) {
            return resolve({statusCode: 400, message: 'Bad Request - Invalid Id'});
        }
        
        model.findOne(conditions, function (err, res) {
            if (err) return reject(err);
            if (!res) return resolve({statusCode: 404, message: 'Not Found'});
            return resolve({statusCode: 200, message: res});
        });
    });
}

function findById(model, id) {
    return findByConditions(model, {_id: id});
}

function save(model, body) {
    return new Promise((resolve, reject) => {
        const modelInstance = new model(body);
        
        modelInstance.save(function (err, res) {
            if (err) return reject(err);
            return resolve({statusCode: 201, message: res});
        });
    });
}

function remove(model, conditions) {
    return new Promise((resolve, reject) => {
        if (typeof(conditions) !== 'object') return resolve({statusCode: 400, message: 'Bad Request'});
        if (conditions._id && !mongodb.ObjectID.isValid(conditions._id)) {
            return resolve({statusCode: 400, message: 'Bad Request - Invalid Id'});
        }
        
        model.findOneAndRemove(conditions, function (err, res) {
            if (err) return reject(err);
            if (!res) return resolve({statusCode: 404, message: 'Not Found'});
            return resolve({statusCode: 200, message: res});
        });
    });
}


function patch(model, conditions, body) {
    return new Promise((resolve, reject) => {
        if (typeof(conditions) !== 'object') return resolve({statusCode: 400, message: 'Bad Request'});
        if (conditions._id && !mongodb.ObjectID.isValid(conditions._id)) {
            return resolve({statusCode: 400, message: 'Bad Request - Invalid Id'});
        }
        
        model.findOneAndUpdate(conditions, mergePatch(body), function (err, res) {
            if (err) return reject(err);
            if (!res) return resolve({statusCode: 404, message: 'Not Found'});
            return resolve({statusCode: 200, message: res});
        });
    });
}

function put(model, conditions, body) {
    return new Promise((resolve, reject) => {
        if (typeof(conditions) !== 'object') return resolve({statusCode: 400, message: 'Bad Request'});
        if (conditions._id && !mongodb.ObjectID.isValid(conditions._id)) {
            return resolve({statusCode: 400, message: 'Bad Request - Invalid Id'});
        }
        
        model.findOneAndUpdate(conditions, body, {upsert:true}, function (err, res) {
            if (err) return reject(err);
            if (!res) return resolve({statusCode: 204, message: null});
            return resolve({statusCode: 200, message: res});
        });
    });
}


  module.exports = {
    find,
    findAll,
    findById,
    findByConditions,
    save,
    remove,
    patch,
    put
  }