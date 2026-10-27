using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "merch_items",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "varchar(120)", nullable: false),
                    description = table.Column<string>(type: "varchar(2000)", nullable: true),
                    category = table.Column<string>(type: "varchar(50)", nullable: false),
                    available_colors = table.Column<List<string>>(type: "varchar(7)[]", nullable: false),
                    model_file_path = table.Column<string>(type: "varchar(500)", nullable: true),
                    preview_image_path = table.Column<string>(type: "varchar(500)", nullable: true),
                    is_active = table.Column<bool>(type: "boolean", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_merch_items", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "prints",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "varchar(120)", nullable: false),
                    description = table.Column<string>(type: "varchar(2000)", nullable: true),
                    category = table.Column<string>(type: "varchar(50)", nullable: false),
                    image_file_path = table.Column<string>(type: "varchar(500)", nullable: true),
                    width_px = table.Column<int>(type: "integer", nullable: true),
                    height_px = table.Column<int>(type: "integer", nullable: true),
                    is_active = table.Column<bool>(type: "boolean", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_prints", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "saved_configurations",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "varchar(120)", nullable: false),
                    merch_item_id = table.Column<Guid>(type: "uuid", nullable: false),
                    base_color = table.Column<string>(type: "varchar(7)", nullable: false),
                    share_code = table.Column<string>(type: "varchar(8)", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_saved_configurations", x => x.id);
                    table.ForeignKey(
                        name: "fk_saved_configurations_merch_items_id",
                        column: x => x.merch_item_id,
                        principalTable: "merch_items",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "configuration_prints",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    configuration_id = table.Column<Guid>(type: "uuid", nullable: false),
                    print_id = table.Column<Guid>(type: "uuid", nullable: false),
                    placement = table.Column<string>(type: "varchar(30)", nullable: false),
                    offset_x = table.Column<float>(type: "real", nullable: false),
                    offset_y = table.Column<float>(type: "real", nullable: false),
                    scale = table.Column<float>(type: "real", nullable: false),
                    rotation = table.Column<float>(type: "real", nullable: false),
                    z_index = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_configuration_prints", x => x.id);
                    table.ForeignKey(
                        name: "fk_configuration_prints_prints_id",
                        column: x => x.print_id,
                        principalTable: "prints",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_configuration_prints_saved_configurations_id",
                        column: x => x.configuration_id,
                        principalTable: "saved_configurations",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_configuration_prints_configuration_id",
                table: "configuration_prints",
                column: "configuration_id");

            migrationBuilder.CreateIndex(
                name: "ix_configuration_prints_print_id",
                table: "configuration_prints",
                column: "print_id");

            migrationBuilder.CreateIndex(
                name: "ix_merch_items_category",
                table: "merch_items",
                column: "category");

            migrationBuilder.CreateIndex(
                name: "ix_prints_category",
                table: "prints",
                column: "category");

            migrationBuilder.CreateIndex(
                name: "ix_saved_configurations_merch_item_id",
                table: "saved_configurations",
                column: "merch_item_id");

            migrationBuilder.CreateIndex(
                name: "ix_saved_configurations_share_code",
                table: "saved_configurations",
                column: "share_code",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "configuration_prints");

            migrationBuilder.DropTable(
                name: "prints");

            migrationBuilder.DropTable(
                name: "saved_configurations");

            migrationBuilder.DropTable(
                name: "merch_items");
        }
    }
}
