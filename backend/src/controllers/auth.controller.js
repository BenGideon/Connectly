const authService = require('../services/auth.service');

const register = async (req, res) => {
  const { username, firstName, lastName, email, password } = req.body;

  if (!username || !firstName || !lastName || !email || !password) {
    return res.status(400).json({
      message:
        'Username, first name, last name, email, and password are required',
    });
  }

  try {
    const registerResult = await authService.register({
      username,
      firstName,
      lastName,
      email,
      password,
    });

    return res.status(201).json({
      message: 'Registration successful',
      token: registerResult.token,
      user: registerResult.user,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || 'Registration failed',
    });
  }
};

const login = async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({
      message: 'Identifier and password are required',
    });
  }

  try {
    const loginResult = await authService.login({ identifier, password });

    if (!loginResult) {
      return res.status(401).json({
        message: 'Invalid credentials',
      });
    }

    return res.status(200).json({
      message: 'Login successful',
      token: loginResult.token,
      user: loginResult.user,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || 'Login failed',
    });
  }
};

const getCurrentUser = (req, res) => {
  const currentUser = authService.getCurrentUser(req.user);

  return res.status(200).json({
    user: currentUser,
  });
};

module.exports = {
  getCurrentUser,
  login,
  register,
};
