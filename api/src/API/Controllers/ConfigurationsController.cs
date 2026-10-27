using API.DTOs.Configurations;
using API.Modules.Errors;
using Application.Common.Interfaces.Queries;
using Application.Configurations.Commands;
using Application.Services.FileStorage;
using Domain.Configurations;
using Domain.MerchItems;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Route("configurations")]
[ApiController]
public class ConfigurationsController(
    ISender sender,
    ISavedConfigurationQueries configurationQueries,
    IFileService fileService) : ControllerBase
{
    [HttpGet("placements")]
    public ActionResult<IEnumerable<string>> GetPlacements()
        => Ok(PrintPlacement.AllPlacementNames);

    [HttpGet("get-all")]
    public async Task<ActionResult<IReadOnlyList<SavedConfigurationDto>>> GetAll(CancellationToken cancellationToken)
    {
        var entities = await configurationQueries.GetAll(cancellationToken);
        return entities.Select(e => SavedConfigurationDto.FromDomainModel(e, fileService.GetPublicUrl)).ToList();
    }

    [HttpGet("by-merch-item/{merchItemId:guid}")]
    public async Task<ActionResult<IReadOnlyList<SavedConfigurationDto>>> GetByMerchItem(
        [FromRoute] Guid merchItemId,
        CancellationToken cancellationToken)
    {
        var entities = await configurationQueries.GetByMerchItem(new MerchItemId(merchItemId), cancellationToken);
        return entities.Select(e => SavedConfigurationDto.FromDomainModel(e, fileService.GetPublicUrl)).ToList();
    }

    [HttpGet("get-by-id/{configurationId:guid}")]
    public async Task<ActionResult<SavedConfigurationDto>> Get(
        [FromRoute] Guid configurationId,
        CancellationToken cancellationToken)
    {
        var entity = await configurationQueries.GetById(new SavedConfigurationId(configurationId),
            cancellationToken);

        return entity.Match<ActionResult<SavedConfigurationDto>>(
            configuration => SavedConfigurationDto.FromDomainModel(configuration, fileService.GetPublicUrl),
            () => NotFound());
    }

    [HttpGet("by-share-code/{shareCode}")]
    public async Task<ActionResult<SavedConfigurationDto>> GetByShareCode(
        [FromRoute] string shareCode,
        CancellationToken cancellationToken)
    {
        if (shareCode.Length != ShareCodeGenerator.Length)
            return NotFound();

        var entity = await configurationQueries.GetByShareCode(shareCode, cancellationToken);

        return entity.Match<ActionResult<SavedConfigurationDto>>(
            configuration => SavedConfigurationDto.FromDomainModel(configuration, fileService.GetPublicUrl),
            () => NotFound());
    }

    [HttpPost("create")]
    public async Task<ActionResult<SavedConfigurationDto>> Create(
        [FromBody] CreateSavedConfigurationDto request,
        CancellationToken cancellationToken)
    {
        var input = new CreateSavedConfigurationCommand
        {
            Name = request.Name,
            MerchItemId = request.MerchItemId,
            BaseColor = request.BaseColor,
            Prints = ToInputs(request.Prints)
        };

        var result = await sender.Send(input, cancellationToken);

        return await result.Match<Task<ActionResult<SavedConfigurationDto>>>(
            async configuration => await Get(configuration.Id.Value, cancellationToken),
            e => Task.FromResult<ActionResult<SavedConfigurationDto>>(e.ToObjectResult()));
    }

    [HttpPut("update/{configurationId:guid}")]
    public async Task<ActionResult<SavedConfigurationDto>> Update(
        [FromRoute] Guid configurationId,
        [FromBody] UpdateSavedConfigurationDto request,
        CancellationToken cancellationToken)
    {
        var input = new UpdateSavedConfigurationCommand
        {
            ConfigurationId = configurationId,
            Name = request.Name,
            BaseColor = request.BaseColor,
            Prints = ToInputs(request.Prints)
        };

        var result = await sender.Send(input, cancellationToken);

        return await result.Match<Task<ActionResult<SavedConfigurationDto>>>(
            async configuration => await Get(configuration.Id.Value, cancellationToken),
            e => Task.FromResult<ActionResult<SavedConfigurationDto>>(e.ToObjectResult()));
    }

    [HttpDelete("delete/{configurationId:guid}")]
    public async Task<ActionResult<SavedConfigurationDto>> Delete(
        [FromRoute] Guid configurationId,
        CancellationToken cancellationToken)
    {
        var input = new DeleteSavedConfigurationCommand
        {
            ConfigurationId = configurationId
        };

        var result = await sender.Send(input, cancellationToken);

        return result.Match<ActionResult<SavedConfigurationDto>>(
            configuration => SavedConfigurationDto.FromDomainModel(configuration, fileService.GetPublicUrl),
            e => e.ToObjectResult());
    }

    private static List<ConfigurationPrintInput> ToInputs(List<ConfigurationPrintInputDto>? prints)
        => (prints ?? new List<ConfigurationPrintInputDto>())
            .Select(p => new ConfigurationPrintInput(p.PrintId, p.Placement, p.OffsetX, p.OffsetY, p.Scale,
                p.Rotation, p.ZIndex))
            .ToList();
}
