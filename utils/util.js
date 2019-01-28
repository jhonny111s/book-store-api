function formatPermissions(access) {
    let acl = {};
    for (let admision of access ) {
      if (Array.isArray(admision.permissions)) {
        for (let route of admision.permissions) {
         Object.keys(route).forEach((key) => {
           if (!acl[key]) {
             acl[key] = route[key];
           }
           else {
            route[key].forEach((method)=> {
               if (!acl[key].includes(method)) {
                acl[key] = acl[key].concat(method);
               }
             })
           }
         })
        }
      }
    }
    return acl;
  }

// Simula la funcionalidad del patch si un dato es enviado con valor se actualiza
// si este es enviado null se remueve.
  function mergePatch(patch) {
    const update = {"$set": {}, "$unset": {}};
    if (typeof(patch) !== 'object') return patch;

    for (let item in patch) {
      if (patch[item] === null) {
        update["$unset"][item] = patch[item];
      }
      else {
        update["$set"][item] = patch[item];
      }
    }

    if (Object.keys(update["$set"]).length === 0) delete update["$set"];
    if (Object.keys(update["$unset"]).length === 0) delete update["$unset"];
    return update;
  }

  module.exports = {
    formatPermissions,
    mergePatch
  };