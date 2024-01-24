import { ApiProperty } from "@nestjs/swagger";

export class TokensResponse {
    @ApiProperty({ default: 'accessToken' })
    accessToken: string;

    @ApiProperty({ default: 'refreshToken' })
    refreshToken: string;
}