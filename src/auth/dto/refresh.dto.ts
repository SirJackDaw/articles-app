import { ApiProperty } from "@nestjs/swagger";

export class Refresh {
    @ApiProperty({ default: 'refreshToken' })
    token: string;
}