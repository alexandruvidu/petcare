using System.Net;

namespace MobyLabWebProgramming.Core.Errors;

public static class CommonErrors
{
    public static ErrorMessage UserNotFound =>
        new(HttpStatusCode.NotFound, "User doesn't exist!", ErrorCodes.EntityNotFound);

    public static ErrorMessage EntityNotFound =>
        new(HttpStatusCode.NotFound, "Entity not found.", ErrorCodes.EntityNotFound);

    public static ErrorMessage AlreadyExists =>
        new(HttpStatusCode.Conflict, "The entity already exists.", ErrorCodes.AlreadyExists);

    public static ErrorMessage TechnicalSupport =>
        new(HttpStatusCode.InternalServerError, "An unknown error occurred, contact technical support.", ErrorCodes.TechnicalError);

    public static ErrorMessage Forbidden =>
        new(HttpStatusCode.Forbidden, "You are not authorized to perform this action.", ErrorCodes.Unauthorized);

    public static ErrorMessage InvalidCredentials =>
        new(HttpStatusCode.BadRequest, "Invalid email or password.", ErrorCodes.WrongPassword);

    public static ErrorMessage InvalidData =>
        new(HttpStatusCode.BadRequest, "Some of the provided data is invalid.", ErrorCodes.InvalidData);
}
