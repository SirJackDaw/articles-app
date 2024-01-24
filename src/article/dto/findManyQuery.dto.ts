import { ApiProperty } from "@nestjs/swagger";
import { Pagination } from "./pagintation";
import { IsDateString, IsInt, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";

export class FindManyQuery extends Pagination {
    @IsString()
    @IsOptional()
    @ApiProperty({ type: String, required: false, default: 'name' })
    authorName: string;

    @IsDateString()
    @IsOptional()
    @ApiProperty({ type: String, required: false, default: '2024-01-23T13:38:28Z' })
    dateFrom: string;

    @IsDateString()
    @IsOptional()
    @ApiProperty({ type: String, required: false, default: '2024-01-23T13:38:28Z' })
    dateTo: string;

    @IsInt()
    @Type(() => Number)
    @IsOptional()
    @ApiProperty({ required: false, default: 7 })
    timezone: string;
}