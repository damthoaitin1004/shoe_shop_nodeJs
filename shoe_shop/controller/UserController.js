const jwt = require('jsonwebtoken');
const express = require("express");
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const speakeasy = require('speakeasy');
const multer = require('multer');
const { Img, User } = require('../model/model');
const { generateAndSaveQRCode } = require('../model/service/QrCode');
const { sendForgotPasswordEmail } = require('../model/service/SendMail');
const userRouter = express.Router();




const storage = multer.memoryStorage();
const upload = multer({
  storage: storage
});

userRouter.post('/create-user', [
  upload.single('img')
], async (req, res) => {
  try {
    const { username, password, email } = req.body;
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create image
    const image = await Img.create({
      name: req.file.originalname,
      data: req.file.buffer
    });

    // Associate image with user
    const imgId = image.id;
    const secret = speakeasy.generateSecret({ length: 20 });

    // Create user
    const user = await User.create({
      username: username,
      password: hashedPassword,
      email: email,
      img_id: imgId,
      secret: secret.base32,
    });
    // Cập nhật img_id trong bảng Users
    // await User.update({ img_id: imgId }, { where: { id: user.id } });
    generateAndSaveQRCode(user.username,secret,user.email,imgId);
    res.status(201).json({ message: 'Đăng ký tài khoản thành công', user: { id: user.id, img: image } });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
});
// Chức năng đăng nhập 
userRouter.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log(username);
  console.log(password);
  try {
    // Tìm kiếm user theo username trong database
    const user = await User.findOne({
      where: {
        username: username
      }
    }); console.log(user);
    console.log("1");
    // Nếu user không tồn tại, hoặc mật khẩu không khớp, trả về lỗi
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Sai tên đăng nhập hoặc mật khẩu' });
    }
    // Nếu mọi thứ hợp lệ, tạo token và trả về
    const accessToken = jwt.sign({ username: user.username }, crypto.randomBytes(32).toString('hex'),);
    res.json({ accessToken });
  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    res.status(500).json({ message: 'Lỗi đăng nhập vui lòng thử lại sau.' });
  }
});
// Gửi mail về cho user
userRouter.post('/forgot-password', async (req, res) => {
  const { username } = req.body;
  // Tạo mật khẩu mới
  const newPassword = generateRandomPassword(); // Hàm tạo mật khẩu ngẫu nhiên.
  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  try {
    const user = await User.findOne({
      where: {
        username: username
      }
    });
    console.log(user);
    if (user) {
      // Cập nhật mật khẩu
      await user.update({ password: hashedNewPassword });
    }
    else {
      // console.log('User not found');
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }
    // Gửi email chứa mật khẩu mới
    const emailResult = await sendForgotPasswordEmail(user, newPassword);
    if (emailResult.success) {
      res.status(200).json({ message: emailResult.message });
    } else {
      res.status(500).json({ error: emailResult.message });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
function generateRandomPassword() {
  const str = '0123456789';
  let newPassword = '';
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * str.length);
    newPassword += str[randomIndex];
  }
  return newPassword;
}
// api lấy hình ảnh của user
userRouter.get('/img/:username', async (req, res) => {
  const username = req.params.username;
  try {
    // Tìm người dùng theo tên người dùng và kèm theo thông tin ảnh
    const user = await User.findOne({
      where: { username: username },
      include: [Img],
    });
    console.log(user);

    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    if (!user.Img || !user.Img.data) {
      return res.status(404).json({ message: 'Ảnh không tồn tại cho người dùng này' });
    }

    // Trả về đường dẫn ảnh dưới dạng base64
    const imageDataUrl = `data:image/jpeg;base64,${user.Img.data.toString('base64')}`;

    return res.status(200).json({ imageUrl: imageDataUrl });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Lỗi server' });
  }

})