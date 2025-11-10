import { IsInt, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';

export class EarnPointDto {
  @IsInt()
  @IsPositive()
  amount!: number;

  @IsString()
  @IsOptional()
  @MaxLength(120)
  description?: string;
}
