const jwt = require("jsonwebtoken");
const UserAdmin = require("../../model/UserAdmin");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

// Đăng nhập
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await UserAdmin.findOne({ username });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });
    }

    const token = generateToken(user._id);
    res.json({
      _id: user._id,
      username: user.username,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Đăng xuất (phía client xóa token)
exports.logout = (req, res) => {
  // Với JWT, logout chủ yếu là client xoá token. Nếu cần blacklist token thì phải thêm DB.
  res.json({ message: "Đăng xuất thành công" });
};

exports.register = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Kiểm tra username đã tồn tại chưa
    const existingUser = await UserAdmin.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Tài khoản đã tồn tại" });
    }

    // Tạo tài khoản mới
    const newUser = new UserAdmin({ username, password });
    await newUser.save();

    res.status(201).json({
      message: "Tạo tài khoản thành công",
      user: { _id: newUser._id, username: newUser.username },
    });
  } catch (error) {
    console.error("Lỗi tạo tài khoản:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};