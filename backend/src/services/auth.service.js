const jwt = require('jsonwebtoken');

const sanitizeUser = (user) => {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
  };
};

const createToken = (user) => {
  return jwt.sign(
    {
      sub: user.id,
      username: user.username,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1h',
    },
  );
};

const findUserByIdentifier = async (identifier) => {
  void identifier;

  // This gets replaced by a MongoDB user lookup once the User model exists.
  return null;
};

const login = async ({ identifier, password }) => {
  const normalizedIdentifier = identifier.trim().toLowerCase();
  const user = await findUserByIdentifier(normalizedIdentifier);

  if (!user) {
    const error = new Error(
      'Login is not implemented yet. Add a MongoDB-backed User model first.',
    );
    error.statusCode = 501;
    throw error;
  }

  if (user.password !== password) {
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
    email: authUser.email,
  };
};

module.exports = {
  getCurrentUser,
  login,
};
