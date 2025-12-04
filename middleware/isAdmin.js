module.exports = function (req, res, next) {
  if (req.headers['x-admin'] === 'true') return next();
  res.status(403).json({ message: 'Admin only' });
};
