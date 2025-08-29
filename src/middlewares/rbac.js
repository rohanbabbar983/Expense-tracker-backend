export const allowRoles = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthenticated' });
  if (!roles.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
  next();
};

// Ownership guard for transactions (admin bypass)
export const mustOwnOrAdmin = (getOwnerIdFromResource) => async (req, res, next) => {
  if (req.user.role === 'admin') return next();
  const ownerId = await getOwnerIdFromResource(req);
  if (ownerId !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
  next();
};
