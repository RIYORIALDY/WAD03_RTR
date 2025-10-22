const User = require('../models/User');

const buyerOnly = async (req, res, next) => {
  try {
    const username = req.params.username || req.headers['x-username'];

    if (!username) {
      return res.status(401).json({ 
        error: 'Username is required' 
      });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }

    if (user.role !== 'buyer') {
      return res.status(403).json({ 
        error: 'Access denied. Only buyers can perform this action' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = buyerOnly;
