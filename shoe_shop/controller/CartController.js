const express = require("express");
const { WareHouse, Shoe, Type, ImgShoe, Size, Cart } = require("../model/model");
const cartRouter = express.Router();
// Danh sách sản phẩm có trong cửa hàng
cartRouter.post('/add', async (req, res) => {
    try {
        const { user_id, size_id, shoe_id, quantity } = req.body;

        // Tìm đối tượng Cart dựa trên user_id, size_id, shoe_id
        const existingCart = await Cart.findOne({
            where: {
                user_id,
                size_id,
                shoe_id,
            },
        });

        if (existingCart) {
            // Nếu đối tượng Cart đã tồn tại, cập nhật quantity và price
            const newQuantity = existingCart.quantity + quantity;
            const newPrice = existingCart.price + existingCart.price;

            // Cập nhật đối tượng Cart
            await existingCart.update({
                quantity: newQuantity,
                price: newPrice,
            });

            return res.status(200).json({ message: 'Cart updated successfully.' });
        } else {
           

            await Cart.create({
                user_id,
                size_id,
                shoe_id,
                quantity,
                price:  0,
            });

            return res.status(201).json({ message: 'Cart created successfully.' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error.' });
    }
});

module.exports = cartRouter;