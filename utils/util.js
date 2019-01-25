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

  module.exports = {
    formatPermissions
  };