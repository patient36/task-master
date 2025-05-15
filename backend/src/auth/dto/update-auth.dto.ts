import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, ValidateIf, IsDefined } from 'class-validator';

export class UpdateAuthDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  oldPassword?: string;

  @ValidateIf((o) => o.oldPassword !== undefined)
  @IsString()
  @MinLength(6)
  @IsDefined()
  newPassword?: string;
}
