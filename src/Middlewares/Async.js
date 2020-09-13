module.exports = function (handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res);
    } catch (ex) {
      return res.json({
        status: 500,
        message: "invalid inputs",
      });
    }
  };
};
