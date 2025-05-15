import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateTaskDto {
    @IsOptional()
    @IsNotEmpty()
    title?: string;

    @IsOptional()
    @IsNotEmpty()
    description?: string;

    @IsOptional()
    @IsNotEmpty()
    dueTime?: Date;

    @IsOptional()
    @IsNotEmpty()
    status?: string

    @IsOptional()
    @IsNotEmpty()
    priority?: string
}
