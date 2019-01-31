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

function findById(model, id) {
    return new Promise((resolve, reject) => {
        if (!mongodb.ObjectID.isValid(id)) {
            return resolve({statusCode: 400, message: 'Bad Request - Invalid Id'});
        }
        
        model.findById(id, function (err, res) {
            if (err) return reject(err);
            if (!res) return resolve({statusCode: 404, message: 'Not Found'});
            return resolve({statusCode: 200, message: res});
        });
    });
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

function remove(model, id) {
    return new Promise((resolve, reject) => {
        if (!mongodb.ObjectID.isValid(id)) {
            return resolve({statusCode: 400, message: 'Bad Request - Invalid Id'});
        }
        
        model.findOneAndRemove({_id: id}, function (err, res) {
            if (err) return reject(err);
            if (!res) return resolve({statusCode: 404, message: 'Not Found'});
            return resolve({statusCode: 200, message: res});
        });
    });
}

function patch(model, id, body) {
    return new Promise((resolve, reject) => {
        if (!mongodb.ObjectID.isValid(id)) {
            return resolve({statusCode: 400, message: 'Bad Request - Invalid Id'});
        }
        
        model.findOneAndUpdate({_id: id}, mergePatch(body), function (err, res) {
            if (err) return reject(err);
            if (!res) return resolve({statusCode: 404, message: 'Not Found'});
            return resolve({statusCode: 200, message: res});
        });
    });
}

function put(model, id, body) {
    return new Promise((resolve, reject) => {
        if (!mongodb.ObjectID.isValid(id)) {
            return resolve({statusCode: 400, message: 'Bad Request - Invalid Id'});
        }
        
        model.findOneAndUpdate({_id: id}, body, {upsert:true}, function (err, res) {
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
    save,
    remove,
    patch,
    put
  }