export default function Responses(req, res, data) {
  const responseType = req.get("Accept");
  switch (responseType) {
    case "application/json":
      res.status(data.status).json(data.doc);
      break;
    default:
      if (data.isSuccess) {
        req.flash("successMessage", data.success.message);
        const object = new Object();

        object[data.model] = data.doc;
        if (data.isRedirect) {
          res.redirect(data.redirect);
          break;
        } else {
          res.status(data.status).render(`admin/${data.model}`, object);
        }
      } else {
        req.flash("errorMessage", data.err.message);

        if (data.isRedirect) {
          res.redirect(data.redirect);

          break;
        } else {
          res.status(data.status).render(`admin/${data.model}`, data.object);
        }
      }
  }
}
