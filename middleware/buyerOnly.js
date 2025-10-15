const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, '../../data/users.json');

const buyerOnly = (req, res, next) => {
  try {
    const username = req.params.username || req.headers['x-username'];

    if (!username) {
      return res.status(401).json({ 
        error: 'Username is required' 
      });
    }

    const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
    const user = users.find(u => u.username === username);

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
