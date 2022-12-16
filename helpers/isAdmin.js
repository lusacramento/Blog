module.exports = {
  isAdmin: (req, res, next) => {
    // if (req.isAuthenticated() && req.user.isAdmin) {
    //   return next();
    // }
    return next();
    // req.flash(
    //   "errorMessage",
    //   "Acesso negado. Sua credencial não faz parte do grupo de administradores!"
    // );
    // res.redirect("/");
  },
};
