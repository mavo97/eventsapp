// ES6 Modules or TypeScript
import Swal from 'sweetalert2';

export class Alert {
    title: string;
    text: string;

    cargando( title, text ) {

        Swal.fire({
            title: (title),
            text: (text),
            icon: 'info',
            allowOutsideClick: false
          });
        Swal.showLoading();

    }

    exito( title, text ) {

        Swal.fire({
            title: (title),
            text: (text),
            icon: 'success',
          });

    }
    error( title, text ) {

        Swal.fire({
            icon: 'error',
            title: (title),
            text: (text)
          });

    }
    info( title, text ) {

        Swal.fire({
            icon: 'info',
            title: (title),
            text: (text)
          });

    }
}