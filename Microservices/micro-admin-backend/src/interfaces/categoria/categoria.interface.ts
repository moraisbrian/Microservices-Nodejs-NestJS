import { Document } from "mongoose";
import { Jogador } from "../jogador/jogador.interface";
import { Evento } from "./evento.interface";

export interface Categoria extends Document {
    readonly categoria: string;
    descricao: string;
    eventos: Array<Evento>;
    jogadores: Array<Jogador>;
}