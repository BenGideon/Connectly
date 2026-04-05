const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const PASSWORD_SALT_ROUNDS = 10;

const sanitizeUser = (user) => {
  return {
    id: user.id,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  };
};

const createToken = (user) => {
  return jwt.sign(
    {
      sub: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1h',
    },
  );
};

const findUserByIdentifier = async (identifier) => {
  return User.findOne({
    $or: [{ username: identifier }, { email: identifier }],
  });
};

const register = async ({ username, firstName, lastName, email, password }) => {
  const normalizedUsername = username.trim().toLowerCase();
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await User.findOne({
    $or: [{ username: normalizedUsername }, { email: normalizedEmail }],
  });

  if (existingUser) {
    const error = new Error('A user with that username or email already exists');
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, PASSWORD_SALT_ROUNDS);

  const user = await User.create({
    username: normalizedUsername,
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: normalizedEmail,
    password: hashedPassword,
  });

  const safeUser = sanitizeUser(user);
  const token = createToken(safeUser);

  return {
    user: safeUser,
    token,
  };
};

const login = async ({ identifier, password }) => {
  const normalizedIdentifier = identifier.trim().toLowerCase();
  const user = await findUserByIdentifier(normalizedIdentifier);

  if (!user) {
    return null;
  }

  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    return null;
  }

  const safeUser = sanitizeUser(user);
  const token = createToken(safeUser);

  return {
    user: safeUser,
    token,
  };
};

const getCurrentUser = (authUser) => {
  return {
    id: authUser.sub,
    username: authUser.username,
    firstName: authUser.firstName,
    lastName: authUser.lastName,
    email: authUser.email,
  };
};

module.exports = {
  getCurrentUser,
  login,
  register,
};
