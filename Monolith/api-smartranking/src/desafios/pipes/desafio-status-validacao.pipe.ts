import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { DesafioStatus } from "../interfaces/desafio-status.enum";

export class DesafioStatusValidacao implements PipeTransform {
    readonly statusPermitidos = [
        DesafioStatus.ACEITO,
        DesafioStatus.NEGADO,
        DesafioStatus.CANCELADO
    ]

    transform(value: any, metadata: ArgumentMetadata) {
        const status = value.status.toUpperCase();

        if (!this.statusValido(status)) {
            throw new BadRequestException(`${status} é um status inválido`);
        }
    }

    private statusValido(status: any): Boolean {
        const index = this.statusPermitidos.indexOf(status);
        return index !== -1;
    }
}