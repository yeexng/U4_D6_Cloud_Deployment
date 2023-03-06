import { checkSchema, validationResult } from "express-validator";
import createHttpError from "http-errors";

const authorSchema = {
  name: {
    in: ["body"],
    isString: {
      errorMessage: "Please fill in a name...",
    },
  },
};

export const checkAuthorSchema = checkSchema(authorSchema); // this function creates a middleware,

export const triggerBadRequest = (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors.array());
  if (errors.isEmpty()) {
    next(); //if no error then we can continue the flow
  } else {
    next(
      createHttpError(400, "Errors during author validation", {
        errorsList: errors.array(),
      })
    );
  }
};
//use / import it in the index.js wanted
