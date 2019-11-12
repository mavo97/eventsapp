export class ActividadModel {
    // tslint:disable-next-line: variable-name
    id_actividad?: string;
    nombre: string;
    // tslint:disable-next-line: variable-name
    fecha_inicio: string;
    // tslint:disable-next-line: variable-name
    fecha_fin: string;
    descripcion: string;
    // tslint:disable-next-line: variable-name
    id_evento: string;
}

export class verActividadesModel {
    records: Array<any>;
};