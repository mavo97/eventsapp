export class UsuarioModel {
    // tslint:disable-next-line: variable-name
    id_usuario?: string;
    nombre: string;
    apellidos: string;
    telefono: string;
    correo: string;
    contrasena: string;
    // tslint:disable-next-line: variable-name
    rol_usuario: string;
}

export class tokenModel {
    message: string;
    data: userModel;
};
export interface userModel {
        // tslint:disable-next-line: variable-name
        id_usuario?: string;
        nombre: string;
        apellidos: string;
        telefono: string;
        correo: string;
        contrasena: string;
        // tslint:disable-next-line: variable-name
        rol_usuario: string;
}
export interface userSala {
    // tslint:disable-next-line: variable-name
    id_usuario?: string;
    id_sala?: string;
    nombreUsuario: string;
    apellidos: string;
    correo: string;
}

export class dataUserModel {
    data: userModel
};
export class dataUserSala {
    data: userSala
};
export interface userModel2 {
    // tslint:disable-next-line: variable-name
    id_usuario?: string;
    nombre: string;
    apellidos: string;
    telefono: string;
    correo: string;
    // tslint:disable-next-line: variable-name
    rol_usuario: string;
}
export class dataUserModel2 {
    records: userModel2
};