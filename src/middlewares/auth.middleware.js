const adminAuth = (req, res, next) => {
  console.log("admin middleware is running");
  const token = "zxsffxdfgfdd";
  const isAdminAuthorized = token === "zxsffxdfgfdd";
  if (!isAdminAuthorized) {
    res.status(401).send("Unauthorized");
  } else {
    next();
  }
};

const userAuth = (req, res, next) => {
  console.log("user middleware is running");
  const token = "zxsffxdfgfdd";
  const isUserAuthorized = token === "zxsffxdfgfdd";
  if (!isUserAuthorized) {
    res.status(401).send("Unauthorized");
  } else {
    next();
  }
};

module.exports = { adminAuth, userAuth };
