import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional } from "class-validator";

export class Pagination {
    @IsInt()
    @ApiProperty({ type: Number, required: false })
    @IsOptional()
    @Type(() => Number)
    page: string;

    @IsInt()
    @ApiProperty({ type: Number, required: false })
    @IsOptional()
    @Type(() => Number)
    perPage: string;
}