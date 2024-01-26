const express = require("express");
const { WareHouse, Shoe, Type, ImgShoe, Size, OderBill } = require("../model/model");
const { sequelize } = require("../model/connect/connect");
const shoeRouter = express.Router();
// Danh sách sản phẩm có trong cửa hàng
shoeRouter.get('/list', async (req, res) => {
    try {
        const shoesInWarehouse = await Shoe.findAll({
            include: [
                {
                    model: ImgShoe,
                    attributes: ['id', 'url'],
                },
                {
                    model:Type,
                    attributes:['id','name']
                },
                {
                    model: Size,
                    attributes: ['id', 'name'],
                    through: {
                        attributes: [], // Loại bỏ thông tin từ bảng liên kết (size_detail)
                    },
                },
                {
                    model: WareHouse,
                    attributes: ['id'], // Chỉ lấy id từ bảng WareHouse
                    required: true, // Chỉ lấy các sản phẩm có khóa ngoại trong bảng WareHouse
                },
            ],
        });

        res.json(shoesInWarehouse);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})
shoeRouter.get('/api/top', async (req, res) => {
    try {
      // Sử dụng Sequelize để thực hiện truy vấn
      const topProducts = await Shoe.findAll({
        attributes: ['id', 'name', 'description', 'price'],
        include: [
          {
            model: OderBill,
            attributes: [[sequelize.fn('SUM', sequelize.literal('`OderBills`.`quantity`')), 'totalQuantity']],
          },
        ],
        group: ['Shoe.id'],
        order: [[sequelize.literal('totalQuantity'), 'DESC']],
        limit: 5,
      });
  
      res.json(topProducts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
module.exports = shoeRouter;