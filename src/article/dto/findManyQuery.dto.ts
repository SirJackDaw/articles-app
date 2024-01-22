import { ApiProperty } from "@nestjs/swagger";
import { Pagination } from "./pagintation";
import { IsDateString, IsInt, IsNumber, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";

export class FindManyQuery extends Pagination {
    @IsString()
    @IsOptional()
    @ApiProperty({ type: String, required: false })
    authorName: string;

    // @ApiProperty({ type: Date, required: false })
    // dateFrom: Date;

    // @ApiProperty({ type: Date, required: false })
    // dateTo: Date;

    @IsDateString()
    @IsOptional()
    @ApiProperty({ type: Date, required: false })
    dateFrom: string;

    @IsDateString()
    @IsOptional()
    @ApiProperty({ type: Date, required: false })
    dateTo: string;

    @IsInt()
    @Type(() => Number)
    @IsOptional()
    @ApiProperty({ required: false })
    timezone: string;
}