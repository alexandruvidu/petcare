using System.Text.Json.Serialization;

namespace MobyLabWebProgramming.Core.Errors;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum ErrorCodes
{
    Unknown,
    TechnicalError,
    EntityNotFound,
    AlreadyExists,
    WrongPassword,
    CannotUpdate,
    CannotDelete,
    Unauthorized,
    InvalidData,
    MailSendFailed
}