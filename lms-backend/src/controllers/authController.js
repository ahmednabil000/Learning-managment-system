const authService = require("../services/authService");

exports.register = async (req, res) => {
  try {
    const { email, password, fullName } = req.body;
    const result = await authService.register(email, password, fullName);
    if (result.statusCode) {
      return res.status(result.statusCode).json({ message: result.message });
    }
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    if (result.statusCode) {
      return res.status(result.statusCode).json({ message: result.message });
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
