const {formatPermissions, mergePatch, purchaseFormat} = require('../../../utils/util');

describe('utils utils', () => {
    describe('formatPermissions', () => {
        let access = [];
        beforeEach(() => {
            access = [
                {
                    description: "only read",
                    permissions: [{
                        "/api/books": ["GET"],
                        "/api/authors": ["GET"]
                    }, {"/api/purchases": ["GET"]}]
                },
                { 
                    description: "only write",
                    permissions: [{ 
                        "/api/books": ["POST"],
                        "/api/authors": ["GET","POST"]
                        }]
            }];
        });

        it('Generate object format with well formed access', () => {
            expect(formatPermissions(access)).toMatchObject({"/api/authors": ["GET", "POST"], "/api/books": ["GET", "POST"]});
        });

        it('Generate object format with bad formed access', () => {
            access = [];
            expect(formatPermissions(access)).toMatchObject({});
        });

        it('Generate object format with well formed access but bad array permissions', () => {
            access = [{
                description: "only read",
                permissions: {
                    "/api/books": ["GET"],
                    "/api/authors": ["GET"]
                }, 
            }];
            expect(formatPermissions(access)).toMatchObject({});
        });
    });

    describe('mergePatch', () => {
        let update = {};

        beforeEach(() => {
            update = { 
                "title": "La-Iliada",
                "description": "he cambiado",
                "category": null,
                "stock": null
                }
            });

        it('update and remove data', () => {
            expect(mergePatch(update)).toMatchObject({
                "$set": {
                    "description": "he cambiado",
                    "title": "La-Iliada",
                    },
                "$unset": {
                    "category": null,
                    "stock": null,
                    }
                })
        });

        it('only update data', () => {
            delete update['category'];
            delete update['stock'];
            expect(mergePatch(update)).toMatchObject({
                "$set": {
                    "description": "he cambiado",
                    "title": "La-Iliada",
                    }
                })
        });

        it('only remove data', () => {
            delete update['title'];
            delete update['description'];
            expect(mergePatch(update)).toMatchObject({
                "$unset": {
                    "category": null,
                    "stock": null,
                    }
                })
        });

        it('update no object item', () => {
            expect(mergePatch("string")).toBe("string")
        });


    });

    describe('purchaseFormat', () => {
        let purchase = {};
        beforeEach(() => {
            purchase = {
                "user": "2",
                "items": [{
                    "count": 2,
                    "book": {
                        "title": "Cien años de soledad",
                        "authors": ["Gabriel Garcia Marquez"],
                        "description": "El libro narra la historia de la familia Buendía a lo largo de siete generaciones en el pueblo ficticio de Macondo",
                        "price": 60000,
                        "code": "0004",
                        "category": "Novel",
                        "stock": 3
                    }
                },
                {
                    "count": 2,
                    "book": {
                        "title": "Ana karenina",
                        "authors": ["Leon Toistoi"],
                        "description": "example",
                        "price": 80000,
                        "code": "0002",
                        "category": "Novel",
                        "stock": 3
                    }
                }]
            }
        });
        it('should return null if body is not object', () => {
            expect(purchaseFormat("string")).toBeNull();
        });

        it('should return empty cart if body ilegal', () => {
            expect(purchaseFormat({})).toMatchObject({items: []});
        });

        it('should return valid cart', () => {
            expect(purchaseFormat(purchase)).toMatchObject({count: 4, total: 280000});
        });

    });

});