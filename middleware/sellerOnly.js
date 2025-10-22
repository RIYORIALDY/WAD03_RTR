const User = require('../models/User');

const sellerOnly = async (req, res, next) => {
  try {
    const username = req.body.owner || req.headers['x-username'];

    if (!username) {
      return res.status(401).json({ 
        error: 'Username is required. Provide owner in body or x-username in header' 
      });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }

    if (user.role !== 'seller') {
      return res.status(403).json({ 
        error: 'Access denied. Only sellers can perform this action' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = sellerOnly;
