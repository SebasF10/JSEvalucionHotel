// ============================================================
//  INDEX.JS — Login y registro de usuarios
// ============================================================

// Cambia entre las pestañas de Login y Registro en la página de inicio.
function switchTab(tab) {
    // Obtiene el primer botón de pestaña (Login) y el segundo (Registro).
    const btnLogin = document.querySelectorAll('.tab-btn')[0];
    const btnRegistro = document.querySelectorAll('.tab-btn')[1];
    // Obtiene los formularios de login y registro en el DOM.
    const formLogin = document.getElementById('form-login');
    const formRegistro = document.getElementById('form-registro');

    // Si la pestaña solicitada es login, activa el formulario de login.
    if (tab === 'login') {
        btnLogin.classList.add('active');
        btnRegistro.classList.remove('active');
        formLogin.classList.add('active');
        formRegistro.classList.remove('active');
    } else {
        // Si la pestaña solicitada es registro, activa el formulario de registro.
        btnRegistro.classList.add('active');
        btnLogin.classList.remove('active');
        formRegistro.classList.add('active');
        formLogin.classList.remove('active');
    }
}

// CARGAR ADMIN DESDE JSON
// Lee el usuario administrador definido en Json/index.json.
async function cargarAdmin() {
    try {
        // Realiza la petición al JSON que contiene los datos de administrador.
        const respuesta = await fetch('Json/index.json');
        const datos = await respuesta.json();
        // Retorna el objeto admin, o null si no existe.
        return datos.admin || null;
    } catch (error) {
        // Si la petición falla, escribe el error en la consola y retorna null.
        console.error('Error al cargar el admin desde JSON:', error);
        return null;
    }
}

// Guardar y cargar usuarios normales en localStorage.
function guardarUsuariosLocal(usuarios) {
    // Transformar el arreglo de usuarios en JSON y guardarlo.
    localStorage.setItem('usuarios_plataforma', JSON.stringify(usuarios));
}

function cargarUsuariosLocal() {
    // Lee el JSON de usuarios desde localStorage.
    const datos = localStorage.getItem('usuarios_plataforma');
    // Si hay datos, parsea el JSON; si no, retorna un arreglo vacío.
    return datos ? JSON.parse(datos) : [];
}

// VALIDACIONES
function validarEmail(email) {
    // Expresión regular para verificar el formato básico de correo.
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validarTelefono(telefono) {
    // Permite solo números con longitud entre 7 y 15 dígitos.
    return /^[0-9]{7,15}$/.test(telefono);
}

function validarContraseña(password) {
    // La contraseña debe tener entre 5 y 20 caracteres.
    return password.length >= 5 && password.length <= 20;
}

function validarIdentificacion(id) {
    // La identificación debe ser numérica y contar entre 5 y 20 dígitos.
    return /^[0-9]{5,20}$/.test(id);
}

// REGISTRAR USUARIO
// Valida los campos, evita que el admin use el mismo email y guarda el usuario en localStorage.
async function registrarUsuario(event) {
    // Evita que el formulario envie la página y recargue.
    event.preventDefault();

    // Lee los valores ingresados en los campos de registro.
    const nombres = document.getElementById("nombres").value.trim();
    const identificacion = document.getElementById("identificacion").value.trim();
    const email = document.getElementById("email").value.trim();
    const contraseña = document.getElementById("contraseña").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const nacionalidad = document.getElementById("nacionalidad").value.trim();

    // Valida que no falte ningún campo obligatorio.
    if (!nombres || !identificacion || !email || !contraseña || !telefono || !nacionalidad) {
        mostrarAlerta("VALIDACIONES: Debes completar todos los campos.");
        return;
    }

    // Valida el formato del correo.
    if (!validarEmail(email)) {
        mostrarAlerta("VALIDACIONES: El correo electrónico no tiene un formato válido.");
        return;
    }

    // Valida la longitud de la contraseña.
    if (!validarContraseña(contraseña)) {
        mostrarAlerta("VALIDACIONES: La contraseña debe tener entre 6 y 20 caracteres.");
        return;
    }

    // Valida que la identificación sea numérica.
    if (!validarIdentificacion(identificacion)) {
        mostrarAlerta("VALIDACIONES: La identificación debe contener solo números (5-20 dígitos).");
        return;
    }

    // Valida el teléfono.
    if (!validarTelefono(telefono)) {
        mostrarAlerta("VALIDACIONES: El teléfono debe contener solo dígitos y tener entre 7 y 15 números.");
        return;
    }

    // Comprueba si el email corresponde al administrador.
    const admin = await cargarAdmin();
    if (admin && admin.email === email) {
        mostrarAlerta("VALIDACIONES: No puedes registrarte con el correo del administrador.");
        return;
    }

    // Carga los usuarios existentes para verificar que no haya duplicados.
    const usuarios = cargarUsuariosLocal();
    const existe = usuarios.find(u => u.email === email);
    if (existe) {
        mostrarAlerta("VALIDACIONES: Ya existe una cuenta registrada con ese correo electrónico.");
        return;
    }

    // Crea el objeto nuevo del usuario.
    const nuevoUsuario = {
        nombres,
        identificacion,
        email,
        contraseña,
        telefono,
        nacionalidad,
        rol: "usuario"
    };

    // Agrega el nuevo usuario al arreglo y lo guarda en localStorage.
    usuarios.push(nuevoUsuario);
    guardarUsuariosLocal(usuarios);

    // Notifica que el registro fue exitoso, limpia el formulario y cambia a login.
    mostrarAlerta("¡Cuenta registrada correctamente! Ya puedes iniciar sesión.");
    document.getElementById("formRegistro").reset();
    switchTab('login');
}

// INICIAR SESIÓN
// Comprueba primero si es admin y luego si es usuario normal.
async function iniciarSesion() {
    // Lee los valores ingresados en los campos de login.
    const correo = document.getElementById("login-correo").value.trim();
    const contraseña = document.getElementById("login-password").value.trim();

    // Valida que ambos campos estén completos.
    if (!correo || !contraseña) {
        mostrarAlerta("VALIDACIONES: Debes ingresar correo y contraseña.");
        return;
    }

    // Valida el formato del correo antes de continuar.
    if (!validarEmail(correo)) {
        mostrarAlerta("VALIDACIONES: El correo ingresado no tiene un formato válido.");
        return;
    }

    // Intenta autenticar como administrador.
    const admin = await cargarAdmin();
    if (admin && admin.email === correo && admin.contraseña === contraseña) {
        // Si coincide con admin, guarda la sesión en sessionStorage.
        sessionStorage.setItem('usuario_activo', admin.email);
        sessionStorage.setItem('usuario_rol', 'admin');
        mostrarAlerta(`¡Bienvenido/a, ${admin.nombres}!`);
        // Redirige al inicio después de iniciar sesión.
        window.location.href = "Inicio.html";
        return;
    }

    // Si no es admin, busca el usuario normal en localStorage.
    const usuarios = cargarUsuariosLocal();
    const usuario = usuarios.find(u => u.email === correo && u.contraseña === contraseña);

    if (usuario) {
        // Si encuentra usuario, guarda la sesión del usuario.
        sessionStorage.setItem('usuario_activo', usuario.email);
        sessionStorage.setItem('usuario_rol', usuario.rol || 'usuario');
        mostrarAlerta(`¡Bienvenido/a, ${usuario.nombres}!`);
        window.location.href = "Inicio.html";
    } else {
        // Si no hay coincidencia, muestra un mensaje de error.
        mostrarAlerta("VALIDACIONES: Correo o contraseña incorrectos. Verifica tus datos e intenta de nuevo.");
    }
}

// MOSTRAR ALERTA
// Muestra un mensaje simple en una ventana emergente del navegador.
function mostrarAlerta(mensaje) {
    alert(mensaje);
}

// EVENT LISTENERS
// Configura los eventos una vez que el DOM esté cargado.
document.addEventListener("DOMContentLoaded", function () {
    // El formulario de registro envía el evento registrarUsuario.
    document.getElementById("formRegistro").addEventListener("submit", registrarUsuario);
    // El botón de login dispara la función iniciarSesion.
    document.getElementById("btnLogin").addEventListener("click", iniciarSesion);
});