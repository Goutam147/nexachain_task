const validate = (schema) => {
  return (req, res, next) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      const errors = parsed.error.issues.map(issue => ({
        field: issue.path.join('.'),
        message: issue.message
      }));
      return res.status(400).json({ status: 'fail', errors });
    }
    
    // Replace body with validated and parsed (trimmed) data
    req.body = parsed.data;
    next();
  };
};

module.exports = validate;
