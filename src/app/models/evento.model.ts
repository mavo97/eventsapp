// tslint:disable-next-line: class-name
export class verEventosModel {
    records: EventModel;
}
export class EventModel {
    costo: string;
    descripcion: string;
    estado: string;
    // tslint:disable-next-line: variable-name
    fecha_fin: string;
    // tslint:disable-next-line: variable-name
    fecha_inicio: string;
    // tslint:disable-next-line: variable-name
    id_evento: string;
    nombre: string;
    ubicacion: string;
}
export class verUsEvento{
    records: UsuarioEventoModel;
 }

export class UsuarioEventoModel{
     apellidos: string;
     correo: string;
     id_evento: string;
     id_usuario: string;
     nombreUsuario: string;
}