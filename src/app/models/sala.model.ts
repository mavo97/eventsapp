export class salaModel {
    // tslint:disable-next-line: variable-name
    id_sala?: string;
    nombre: string;
    ubicacion: string;
    estado: string;
    // tslint:disable-next-line: variable-name
    id_actividad: string;
}

export class verSalaModel {
    records: salaModel;
};
export class salaModel2 {
    // tslint:disable-next-line: variable-name
    id_sala?: string;
    // tslint:disable-next-line: variable-name
    id_usuario?: string;
    nombreSala: string;
    correo: string;
    ubicacion: string;
    estado: string;
    // tslint:disable-next-line: variable-name
    nombreEvento: string;
    nombreActividad: string;
    fecha_inicio: string;
    fecha_fin: string;
    rol_usuario: string;
}

export class verSalaModel2 {
    records: salaModel2;
};

export class readAll{
    records: Allsalas;
}
export class Allsalas{
    estado: string;
    id_sala: string;
    nombreActividad: string;
    nombreEvento: string;
    nombreSala: string;
    ubicacion: string;
}