import httpStatus from "http-status";

/**
 * @description: Class for creating an error.
 * @param {number} status - Status code.
 * @param {string} message - Error message.
 * @returns {ApiError} - Returns an instance of the ApiError class.
*/

export const ApiError = class ApiError extends Error {
  status: number | string;
  errors: any;
  constructor(status: number, message: string, errors: never[] = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
};

/**
 * @description: Decorator for controller methods.
 * @param {Object} - Object with error message and status.
 * @returns {Function} - Decorator function.
*/

export function controller({
  message,
  status,
}: {
  message: string;
  status: number;
}) {
  return (target: Object, _: string | symbol, descriptor: any) => {
    const original = descriptor.value;
    descriptor.value = async (...args): Promise<any> => {
      try {
        return await original!.apply(target, args);
      } catch (error) {
        if (!error.message) error.message = message || "Internal server error!";
        if (!error.status)
          error.status = status || httpStatus.INTERNAL_SERVER_ERROR;
        return args[1].status(error.status).send({ message: error.message });
      }
    };
  };
}

/**
 * @description: Decorator for service methods.
 * @param {Object} - Object with error message and status.
 * @returns {Function} - Decorator function.
*/

export function service({
  message,
  status,
}: {
  message: string;
  status: number;
}) {
  return (target: Object, _: string | symbol, descriptor: any): any => {
    const original = descriptor.value;
    descriptor.value = async (...args): Promise<any> => {
      try {
        return await original!.apply(target, args);
      } catch (error) {
        if (!error.message) error.message = message;
        if (!error.status) error.status = status;
        throw new ApiError(error.status, error.message, error);
      }
    };
  };
}
