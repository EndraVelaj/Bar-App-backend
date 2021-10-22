// middleware for doing role-based permissions

const userModel = require ("./databases/Userschema");

export default function permit(...permittedRoles) {

    return (request, response, next) => {

      const isAdmin = await userModel.findOne({isAdmin: req.body.isAdmin});
  
      if (isAdmin && permittedRoles.includes(isAdmin.role)) {
        next(); 
      } else {

        response.status(403).json({message: "No user Access!"}); 
      }
    }
  }