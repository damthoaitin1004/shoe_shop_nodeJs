const express = require("express");
const bodyParser = require("body-parser");
const shoeRouter = require("./controller/shoeController");
const cartRouter = require("./controller/CartController");
const app = express();
const port = 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.use("/shoe", shoeRouter);
app.use("/cart", cartRouter);
app.use("/users", cartRouter);


app.use((req, res, next) => {
    res.status(404).json("Vui lòng kiểm tra lại đường dẫn");
    next();
  });
  
  // Middleware xử lý lỗi 400
  app.use((err, req, res, next) => {
    if (res.statusCode == 400) {
      res.status(400).json("Lỗi dữ liệu");
    }
    next();
  });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
  