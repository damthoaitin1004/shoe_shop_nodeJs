const qrcode = require('qrcode');
const fs = require('fs');
const nodemailer = require('nodemailer');
const { Img } = require('../model');

const generateAndSaveQRCode = async (username, secret, userEmail, imgId) => {
    // Kiểm tra xem có dữ liệu hình ảnh không
    const imgData = await Img.findByPk(imgId);

    if (!secret || !username) {
        console.error('Invalid secret or username');
        return;
    }

    const otpAuthUrl = `otpauth://totp/NodeTest:${username}?secret=${secret}&issuer=NodeTest`;

    if (!otpAuthUrl) {
        console.error('Invalid OTP Auth URL');
        return;
    }
    const qrCodePath = `img/qrcode_${username}.png`;

    // try {
    //     await qrcode.toFile(qrCodePath, otpAuthUrl);
    // } catch (error) {
    //     console.error('Error generating QR code:', error);
    //     return;
    // }
    const qrCodeBuffer = await qrcode.toBuffer(otpAuthUrl);
    const userImageBuffer = imgData.data;
    const mailSubject = 'QR CODE để đăng nhập tài khoản';
    const mailText = `Chúc mừng chủ tài khoản ${username} đã tha
    m gia vào trang web của chúng tôi.
                        Lưu ý bảo mật mã qr code để sau này dùng để đăng nhập (đang trong quá trình phát triển..)
    `;
    // const mailHtml = `<p>${mailText}</p><img src="cid:qrcode" alt="QR Code"><img src="cid:userImage" alt="User Image">`;
    const mailHtml = `<p>${mailText}</p><img src="cid:qrcode" alt="QR Code"><img src="cid:userImage" alt="User Image" style="width: 60%; height: 350px;">`;

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "damthoaitin100041997@gmail.com",
            pass: "ktqm qlik gmdk qzxl",
        },
    });

    let info;

    try {
        info = await transporter.sendMail({
            from: 'damthoaitin100041997@gmail.com',
            to: userEmail,
            subject: mailSubject,
            text: mailText,
            html: mailHtml,
            attachments: [
                {
                    filename: 'qrcode.png',
                    content: qrCodeBuffer,
                    encoding: 'base64', // Chuyển sang kiểu mã hóa base64
                    cid: 'qrcode', // Định danh để liên kết với thẻ img trong HTML
                },
                {
                    filename: 'user.png',
                    content: userImageBuffer,
                    encoding: 'base64', // Chuyển sang kiểu mã hóa base64
                    cid: 'userImage', // Định danh để liên kết với thẻ img trong HTML
                },
            ],
        });
        console.log('Đã gửi mail thành công:', info.response);
    } catch (error) {
        console.error('Lỗi không gửi được mail:', error);
    }
};

module.exports = { generateAndSaveQRCode };
