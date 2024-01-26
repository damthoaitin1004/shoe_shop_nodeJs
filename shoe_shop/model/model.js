const { DataTypes } = require("sequelize");
const { sequelize } = require("./connect/connect");

const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
});

// Define User model
const User = sequelize.define('User', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  img_id: {
    type: DataTypes.BIGINT, // hoặc kiểu dữ liệu tương ứng với id trong model Image
    allowNull: true, // hoặc false nếu mỗi User phải có ảnh
  },
  role_id: {
    type: DataTypes.BIGINT,
    allowNull: true, // hoặc false nếu mỗi User phải có role
  },
  secret: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
const Img = sequelize.define('Img', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  data: {
    type: DataTypes.BLOB('long'),
    allowNull: false
  }
});
const ImgShoe = sequelize.define('ImgShoe', {
  id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false
  }
})
const Type = sequelize.define('Type', {
  id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

const Size = sequelize.define('Size', {
  id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true
  }
})
const SizeDetai = sequelize.define('size_detail', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  }
})
const Shoe = sequelize.define('Shoe', {
  id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  price: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
})
const WareHouse = sequelize.define('ware_house', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  quantity: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  price: {
    type: DataTypes.BIGINT,
    allowNull: true
  }
})
const Cart = sequelize.define('Cart', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  quantity: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  price: {
    type: DataTypes.BIGINT,
    allowNull: true
  }
})

const OderBill = sequelize.define('order_bill', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  price: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  quantity: {
    type: DataTypes.BIGINT,
    allowNull: true
  }
})
const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  }
})
Img.hasMany(User, { foreignKey: 'img_id' });
User.belongsTo(Img, { foreignKey: 'img_id' });

Shoe.hasMany(ImgShoe, { foreignKey: 'shoe_id' });
ImgShoe.belongsTo(Shoe, { foreignKey: 'shoe_id' });

Role.hasMany(User, { foreignKey: 'role_id' });
User.belongsTo(Role, { foreignKey: 'role_id' });
// 
Shoe.hasMany(WareHouse, { foreignKey: 'shoe_id' })
WareHouse.belongsTo(Shoe, { foreignKey: 'shoe_id' })



Size.hasMany(WareHouse, { foreignKey: 'size_id' })
WareHouse.belongsTo(Size, { foreignKey: 'size_id' })

// Khai báo mối quan hệ cho order_bill 

Shoe.hasMany(OderBill, { foreignKey: 'shoe_id' })
OderBill.belongsTo(Shoe, { foreignKey: 'shoe_id' })


Size.hasMany(OderBill, { foreignKey: 'size_id' })
OderBill.belongsTo(Size, { foreignKey: 'size_id' })

Order.hasMany(OderBill, { foreignKey: 'order_id' })
OderBill.belongsTo(Order, { foreignKey: 'order_id' })

// Khai báo mối quan hệ cho order
User.hasMany(Order, { foreignKey: 'user_id' })
Order.belongsTo(User, { foreignKey: 'user_id' })

Type.hasMany(Shoe, { foreignKey: 'type_id' })
Shoe.belongsTo(Type, { foreignKey: 'type_id' })
// 
User.hasMany(Cart, { foreignKey: 'user_id' });
Cart.belongsTo(User, { foreignKey: 'user_id' });

Size.hasMany(Cart, { foreignKey: 'size_id' });
Cart.belongsTo(Size, { foreignKey: 'size_id' });

Shoe.hasMany(Cart, { foreignKey: 'shoe_id' });
Cart.belongsTo(Shoe, { foreignKey: 'shoe_id' });


// 
Size.belongsToMany(Shoe, { through: 'size_detail' });
Shoe.belongsToMany(Size, { through: 'size_detail' });



module.exports = { User: User, Role: Role, Img: Img, Shoe: Shoe, ImgShoe: ImgShoe, Type: Type, Size: Size, SizeDetai: SizeDetai, WareHouse: WareHouse, OderBill: OderBill, Order: Order, Cart: Cart };
// sequelize.sync({ force: true }) 
