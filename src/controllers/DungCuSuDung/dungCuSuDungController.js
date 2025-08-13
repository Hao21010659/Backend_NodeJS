const DungCuSuDung = require("../../model/DungCuSuDung");

// Lấy danh sách dụng cụ (có phân trang và tìm kiếm)
exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, keyword = "" } = req.query;
    const query = keyword
      ? { tenVatDung: { $regex: keyword, $options: "i" } }
      : {};

    const items = await DungCuSuDung.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await DungCuSuDung.countDocuments(query);

    res.json({
      data: items,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Lấy 1 dụng cụ theo ID
exports.getById = async (req, res) => {
  try {
    const item = await DungCuSuDung.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Không tìm thấy" });
    }
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Tạo mới dụng cụ
exports.create = async (req, res) => {
  try {
    const newItem = new DungCuSuDung(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Tạo mới thất bại", error: err.message });
  }
};

// Cập nhật dụng cụ
exports.update = async (req, res) => {
  try {
    const updatedItem = await DungCuSuDung.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedItem) {
      return res.status(404).json({ message: "Không tìm thấy" });
    }
    res.json(updatedItem);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Cập nhật thất bại", error: err.message });
  }
};

// Xoá dụng cụ
exports.remove = async (req, res) => {
  try {
    const deletedItem = await DungCuSuDung.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: "Không tìm thấy" });
    }
    res.json({ message: "Xoá thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};
