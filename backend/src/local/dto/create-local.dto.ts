import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreateLocalDto {
	@IsNotEmpty()
	nome: string
}
