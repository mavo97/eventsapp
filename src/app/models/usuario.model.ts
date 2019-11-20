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
export class dataUserModel {
    data: userModel
};