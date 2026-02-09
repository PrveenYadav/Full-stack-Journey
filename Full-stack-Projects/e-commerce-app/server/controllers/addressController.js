import { User } from "../models/userModel.js";

export const addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    // if first address then default
    if (user.addresses.length === 0) {
      req.body.isDefault = true;
    }

    user.addresses.push(req.body);
    await user.save();

    res.json(user.addresses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const editAddress = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    const addr = user.addresses.id(req.params.id);
    Object.assign(addr, req.body);

    await user.save();
    res.json(user.addresses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    user.addresses = user.addresses.filter(
      (a) => a._id.toString() !== req.params.id
    );

    await user.save();
    res.json(user.addresses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// set default
export const setDefaultAddress = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    user.addresses.forEach((a) => {
      a.isDefault = a._id.toString() === req.params.id;
    });

    await user.save();
    res.json(user.addresses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
