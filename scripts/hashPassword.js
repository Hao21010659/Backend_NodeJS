const bcrypt = require("bcryptjs");

const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(`Mật khẩu gốc: ${password}`);
    console.log(`Mật khẩu đã hash: ${hashedPassword}`);
    console.log(`\nDocument để insert vào MongoDB:`);
    console.log(`{`);
    console.log(`  "username": "tên_tài_khoản_của_bạn",`);
    console.log(`  "password": "${hashedPassword}"`);
    console.log(`}`);
  } catch (error) {
    console.error("Lỗi:", error);
  }
};

// Thay đổi mật khẩu ở đây
const yourPassword = "123456"; // THAY ĐỔI MẬT KHẨU TẠI ĐÂY
hashPassword(yourPassword);