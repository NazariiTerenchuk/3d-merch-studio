using API.DTOs.MerchItems;
using API.Modules.Errors;
using Application.Common.Interfaces.Queries;
using Application.MerchItems.Commands;
using Application.Services.FileStorage;
using Domain.MerchItems;
using Domain.PagedResults;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Route("merch-items")]
[ApiController]
public class MerchItemsController(ISender sender, IMerchItemQueries merchItemQueries, IFileService fileService)
    : ControllerBase
{
    // Request caps sit slightly above FileUpload limits; the exact size is enforced by FileService.
    private const long ModelRequestLimitBytes = 60 * 1024 * 1024;
    private const long PreviewRequestLimitBytes = 10 * 1024 * 1024;

    [HttpGet("categories")]
    public ActionResult<IEnumerable<string>> GetCategories()
        => Ok(MerchCategory.AllCategoryNames);

    [HttpGet("get-all")]
    public async Task<ActionResult<IReadOnlyList<MerchItemSummaryDto>>> GetAll(
        [FromQuery] string? category,
        [FromQuery] bool onlyActive = true,
        CancellationToken cancellationToken = default)
    {
        MerchCategory? merchCategory = null;
        if (!string.IsNullOrWhiteSpace(category))
        {
            if (!MerchCategory.AllCategoryNames.Contains(category))
                return BadRequest($"Unknown category '{category}'.");

            merchCategory = MerchCategory.From(category);
        }

        var entities = await merchItemQueries.GetAll(merchCategory, onlyActive, cancellationToken);
        return entities.Select(e => MerchItemSummaryDto.FromDomainModel(e, fileService.GetPublicUrl)).ToList();
    }

    [HttpGet("paged")]
    public async Task<ActionResult<PagedResult<MerchItemDto>>> GetPaged(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        CancellationToken cancellationToken = default)
    {
        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var (items, totalCount) = await merchItemQueries.GetPaged(page, pageSize, cancellationToken);

        return new PagedResult<MerchItemDto>(
            Items: items.Select(e => MerchItemDto.FromDomainModel(e, fileService.GetPublicUrl)).ToList(),
            TotalCount: totalCount,
            Page: page,
            PageSize: pageSize
        );
    }

    [HttpGet("get-by-id/{merchItemId:guid}")]
    public async Task<ActionResult<MerchItemDto>> Get([FromRoute] Guid merchItemId,
        CancellationToken cancellationToken)
    {
        var entity = await merchItemQueries.GetById(new MerchItemId(merchItemId), cancellationToken);

        return entity.Match<ActionResult<MerchItemDto>>(
            merchItem => MerchItemDto.FromDomainModel(merchItem, fileService.GetPublicUrl),
            () => NotFound());
    }

    [HttpPost("create")]
    public async Task<ActionResult<MerchItemDto>> Create(
        [FromBody] CreateMerchItemDto request,
        CancellationToken cancellationToken)
    {
        var input = new CreateMerchItemCommand
        {
            Name = request.Name,
            Description = request.Description,
            Category = request.Category,
            AvailableColors = request.AvailableColors
        };

        var result = await sender.Send(input, cancellationToken);

        return result.Match<ActionResult<MerchItemDto>>(
            merchItem => MerchItemDto.FromDomainModel(merchItem, fileService.GetPublicUrl),
            e => e.ToObjectResult());
    }

    [HttpPut("update/{merchItemId:guid}")]
    public async Task<ActionResult<MerchItemDto>> Update(
        [FromRoute] Guid merchItemId,
        [FromBody] UpdateMerchItemDto request,
        CancellationToken cancellationToken)
    {
        var input = new UpdateMerchItemCommand
        {
            MerchItemId = merchItemId,
            Name = request.Name,
            Description = request.Description,
            Category = request.Category,
            AvailableColors = request.AvailableColors,
            IsActive = request.IsActive
        };

        var result = await sender.Send(input, cancellationToken);

        return result.Match<ActionResult<MerchItemDto>>(
            merchItem => MerchItemDto.FromDomainModel(merchItem, fileService.GetPublicUrl),
            e => e.ToObjectResult());
    }

    [HttpDelete("delete/{merchItemId:guid}")]
    public async Task<ActionResult<MerchItemDto>> Delete(
        [FromRoute] Guid merchItemId,
        CancellationToken cancellationToken)
    {
        var input = new DeleteMerchItemCommand
        {
            MerchItemId = merchItemId
        };

        var result = await sender.Send(input, cancellationToken);

        return result.Match<ActionResult<MerchItemDto>>(
            merchItem => MerchItemDto.FromDomainModel(merchItem, fileService.GetPublicUrl),
            e => e.ToObjectResult());
    }

    [HttpPut("upload-model/{merchItemId:guid}")]
    [Consumes("multipart/form-data")]
    [RequestSizeLimit(ModelRequestLimitBytes)]
    [RequestFormLimits(MultipartBodyLengthLimit = ModelRequestLimitBytes)]
    public async Task<ActionResult<MerchItemDto>> UploadModel(
        [FromRoute] Guid merchItemId,
        IFormFile modelFile,
        CancellationToken cancellationToken)
    {
        var input = new UploadMerchItemModelCommand
        {
            MerchItemId = merchItemId,
            ModelFile = modelFile
        };

        var result = await sender.Send(input, cancellationToken);

        return result.Match<ActionResult<MerchItemDto>>(
            merchItem => MerchItemDto.FromDomainModel(merchItem, fileService.GetPublicUrl),
            e => e.ToObjectResult());
    }

    [HttpPut("upload-preview/{merchItemId:guid}")]
    [Consumes("multipart/form-data")]
    [RequestSizeLimit(PreviewRequestLimitBytes)]
    [RequestFormLimits(MultipartBodyLengthLimit = PreviewRequestLimitBytes)]
    public async Task<ActionResult<MerchItemDto>> UploadPreview(
        [FromRoute] Guid merchItemId,
        IFormFile previewFile,
        CancellationToken cancellationToken)
    {
        var input = new UploadMerchItemPreviewCommand
        {
            MerchItemId = merchItemId,
            PreviewFile = previewFile
        };

        var result = await sender.Send(input, cancellationToken);

        return result.Match<ActionResult<MerchItemDto>>(
            merchItem => MerchItemDto.FromDomainModel(merchItem, fileService.GetPublicUrl),
            e => e.ToObjectResult());
    }
}
