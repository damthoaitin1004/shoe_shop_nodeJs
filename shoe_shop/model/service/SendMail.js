// emailService.js

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "damthoaitin100041997@gmail.com",
    pass: "ktqm qlik gmdk qzxl",
  },
});

const sendForgotPasswordEmail = async (user, newPassword) => {
  try {
    // Gửi email chứa mật khẩu mới
    const info = await transporter.sendMail({
      from: 'Book Store cảm ơn đã sử dụng dịch vụ',
      to: user.email,
      subject: `Cấp lại mật khẩu cho tài khoản ${user.username}`,
      text: "Your new password",
      html: `<h1>Mật khẩu mới của bạn là</h1>
        <b>${newPassword}</b>`,
    });

    return { success: true, message: 'Mật khẩu mới đã được gửi vào mail của bạn.' };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, message: 'Có lỗi xảy ra khi gửi email.' };
  }
};

module.exports = {
  sendForgotPasswordEmail,
};
