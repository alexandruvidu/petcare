using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MobyLabWebProgramming.Core.DataTransferObjects;
using MobyLabWebProgramming.Core.Enums;
using MobyLabWebProgramming.Core.Responses;
using MobyLabWebProgramming.Infrastructure.Authorization;
using MobyLabWebProgramming.Infrastructure.Services.Interfaces;

namespace MobyLabWebProgramming.Backend.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class BookingController(IBookingService bookingService, IUserService userService) : AuthorizedController(userService)
{
    [Authorize(Roles = nameof(UserRoleEnum.Client))]
    [HttpPost]
    public async Task<ActionResult<RequestResponse>> Create([FromBody] BookingAddDTO booking)
    {
        var currentUser = await GetCurrentUser();
        return currentUser.Result != null
            ? FromServiceResponse(await bookingService.CreateBooking(booking, currentUser.Result.Id))
            : ErrorMessageResult(currentUser.Error);
    }

    [Authorize(Roles = $"{nameof(UserRoleEnum.Client)},{nameof(UserRoleEnum.Sitter)}")]
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<RequestResponse>> Update(Guid id, [FromBody] BookingUpdateDTO update)
    {
        var currentUser = await GetCurrentUser();

        return currentUser.Result != null
            ? FromServiceResponse(await bookingService.UpdateBooking(id, update, currentUser.Result.Id, currentUser.Result.Role))
            : ErrorMessageResult(currentUser.Error);
    }

    [Authorize]
    [HttpGet]
    public async Task<ActionResult<RequestResponse<List<BookingDTO>>>> GetMyBookings()
    {
        var currentUser = await GetCurrentUser();
        return currentUser.Result != null
            ? FromServiceResponse(await bookingService.GetBookingsForUser(currentUser.Result))
            : ErrorMessageResult<List<BookingDTO>>(currentUser.Error);
    }

    [Authorize]
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<RequestResponse<BookingDTO>>> GetById(Guid id)
    {
        var currentUser = await GetCurrentUser();
        return currentUser.Result != null
            ? FromServiceResponse(await bookingService.GetBookingById(id, currentUser.Result))
            : ErrorMessageResult<BookingDTO>(currentUser.Error);
    }
    
    [Authorize(Roles = $"{nameof(UserRoleEnum.Client)},{nameof(UserRoleEnum.Sitter)}")]
    [HttpDelete("{id:guid}")]
    public async Task<ActionResult<RequestResponse>> Delete(Guid id)
    {
        var currentUser = await GetCurrentUser();

        return currentUser.Result != null
            ? FromServiceResponse(await bookingService.DeleteBooking(id, currentUser.Result.Id, currentUser.Result.Role))
            : ErrorMessageResult(currentUser.Error);
    }
}