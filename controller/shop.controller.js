const cardShop = require('../database/model/cardShop');
const { NOT_VALID_ID } = require('../error/errorCustomStatus');
const ErrorHandler = require('../error/errorHandler');
const { shopService, cardShopService } = require('../service');

module.exports = {
    shopPage: async (req, res, next) => {
        try {
            const shops = await shopService.getShop();

            res.render('shopStatic', { shops });
        } catch (e) {
            next(e);
        }
    },

    shopProductPage: async (req, res, next) => {
        try {
            const { shopName } = req.params || {};
            const { getObj } = req.query || {};

            if (getObj) {
                const cardProduct = await cardShopService.getOneCardProduct(getObj);
                if (cardProduct.length) {
                    await cardShop.updateOne({ product: getObj }, { $set: { count: +cardProduct[0].count + 1 } });
                } else {
                    await cardShop.create({ product: getObj, count: 1 });
                }
            }

            let product = {};

            if (shopName) {
                product = await shopService.getAllproductShop(shopName);
                if (!product) {
                    throw new ErrorHandler(402, 0, NOT_VALID_ID.en);
                }
            }

            const shops = await shopService.getShop();

            res.render('shopStatic', { shops, product, isProduct: !!shopName });
        } catch (e) {
            next(e);
        }
    }
};
