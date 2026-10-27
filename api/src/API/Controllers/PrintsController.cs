using API.DTOs.Prints;
using API.Modules.Errors;
using Application.Common.Interfaces.Queries;
using Application.Prints.Commands;
using Application.Services.FileStorage;
using Domain.Prints;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Route("prints")]
[ApiController]
public class PrintsController(ISender sender, IPrintQueries printQueries, IFileService fileService)
    : ControllerBase
{
    // Slightly above FileUpload:MaxPrintSizeMb; the exact size is enforced by FileService.
    private const long ImageRequestLimitBytes = 15 * 1024 * 1024;

    [HttpGet("categories")]
    public ActionResult<IEnumerable<string>> GetCategories()
        => Ok(PrintCategory.AllCategoryNames);

    [HttpGet("get-all")]
    public async Task<ActionResult<IReadOnlyList<PrintDto>>> GetAll(
        [FromQuery] string? category,
        [FromQuery] bool onlyActive = true,
        CancellationToken cancellationToken = default)
    {
        PrintCategory? printCategory = null;
        if (!string.IsNullOrWhiteSpace(category))
        {
            if (!PrintCategory.AllCategoryNames.Contains(category))
                return BadRequest($"Unknown category '{category}'.");

            printCategory = PrintCategory.From(category);
        }

        var entities = await printQueries.GetAll(printCategory, onlyActive, cancellationToken);
        return entities.Select(e => PrintDto.FromDomainModel(e, fileService.GetPublicUrl)).ToList();
    }

    [HttpGet("get-by-id/{printId:guid}")]
    public async Task<ActionResult<PrintDto>> Get([FromRoute] Guid printId, CancellationToken cancellationToken)
    {
        var entity = await printQueries.GetById(new PrintId(printId), cancellationToken);

        return entity.Match<ActionResult<PrintDto>>(
            print => PrintDto.FromDomainModel(print, fileService.GetPublicUrl),
            () => NotFound());
    }

    [HttpPost("create")]
    public async Task<ActionResult<PrintDto>> Create(
        [FromBody] CreatePrintDto request,
        CancellationToken cancellationToken)
    {
        var input = new CreatePrintCommand
        {
            Name = request.Name,
            Description = request.Description,
            Category = request.Category
        };

        var result = await sender.Send(input, cancellationToken);

        return result.Match<ActionResult<PrintDto>>(
            print => PrintDto.FromDomainModel(print, fileService.GetPublicUrl),
            e => e.ToObjectResult());
    }

    [HttpPut("update/{printId:guid}")]
    public async Task<ActionResult<PrintDto>> Update(
        [FromRoute] Guid printId,
        [FromBody] UpdatePrintDto request,
        CancellationToken cancellationToken)
    {
        var input = new UpdatePrintCommand
        {
            PrintId = printId,
            Name = request.Name,
            Description = request.Description,
            Category = request.Category,
            IsActive = request.IsActive
        };

        var result = await sender.Send(input, cancellationToken);

        return result.Match<ActionResult<PrintDto>>(
            print => PrintDto.FromDomainModel(print, fileService.GetPublicUrl),
            e => e.ToObjectResult());
    }

    [HttpDelete("delete/{printId:guid}")]
    public async Task<ActionResult<PrintDto>> Delete(
        [FromRoute] Guid printId,
        CancellationToken cancellationToken)
    {
        var input = new DeletePrintCommand
        {
            PrintId = printId
        };

        var result = await sender.Send(input, cancellationToken);

        return result.Match<ActionResult<PrintDto>>(
            print => PrintDto.FromDomainModel(print, fileService.GetPublicUrl),
            e => e.ToObjectResult());
    }

    [HttpPut("upload-image/{printId:guid}")]
    [Consumes("multipart/form-data")]
    [RequestSizeLimit(ImageRequestLimitBytes)]
    [RequestFormLimits(MultipartBodyLengthLimit = ImageRequestLimitBytes)]
    public async Task<ActionResult<PrintDto>> UploadImage(
        [FromRoute] Guid printId,
        IFormFile imageFile,
        CancellationToken cancellationToken)
    {
        var input = new UploadPrintImageCommand
        {
            PrintId = printId,
            ImageFile = imageFile
        };

        var result = await sender.Send(input, cancellationToken);

        return result.Match<ActionResult<PrintDto>>(
            print => PrintDto.FromDomainModel(print, fileService.GetPublicUrl),
            e => e.ToObjectResult());
    }
}
