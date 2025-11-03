/**
 * Lógica para el botón de "Log In".
 * Por ahora, solo muestra una alerta.
 * @returns {boolean} - Devuelve true para indicar que la acción se ejecutó.
 */
function handleLogin() {
    console.log('Intento de login...');
    alert('Has hecho clic en "Log In". ¡Funcionalidad pendiente!');
    return true;
}

/**
 * Lógica para el botón de "Crear Partido".
 * @returns {boolean} - Devuelve true.
 */
function handleCreateMatch() {
    console.log('Intento de crear partido...');
    alert('Has hecho clic en "Crear Partido". ¡Aquí iría un formulario!');
    return true;
}

/**
 * Lógica para cuando se hace clic en una tarjeta de partido.
 * 'this' se refiere a la tarjeta ('.match-card') que disparó el evento.
 */
function showMatchDetails() {
    try {
        const location = this.querySelector('.match-location').textContent;
        const time = this.querySelector('.match-time').textContent;
        const spots = this.querySelector('.match-spots').textContent;
        
        const message = `Partido seleccionado:\nLugar: ${location}\nHora: ${time}\nPlazas: ${spots}`;
        
        console.log(message);
        alert(message);
    } catch (error) {
        console.error('Error al obtener detalles del partido:', error);
        alert('Error al mostrar detalles del partido.');
    }
}
/**
 * Espera a que todo el HTML esté cargado antes de intentar 
   buscar botones y asignarles los eventos de clic.
 */
  
 
 
document.addEventListener('DOMContentLoaded', () => {
    
    console.log('¡Documento HTML cargado! Asignando eventos...');

    // 1. Conectar el botón "Log In" con la función handleLogin
    const loginButton = document.querySelector('.btn-login');
    if (loginButton) {
        loginButton.addEventListener('click', (event) => {
            // event.preventDefault() evita que el enlace <a> (con href="#")
            // haga que la página salte al principio.
            event.preventDefault(); 
            handleLogin();
        });
    } else {
        console.warn('Botón ".btn-login" no encontrado.');
    }

    // 2. Conectar el botón "Crear Partido" con la función handleCreateMatch
    const createMatchButton = document.querySelector('.hero-actions .btn-primary');
    if (createMatchButton) {
        createMatchButton.addEventListener('click', (event) => {
            event.preventDefault();
            handleCreateMatch();
        });
    } else {
        console.warn('Botón ".hero-actions .btn-primary" no encontrado.');
    }

    // 3. Conectar CADA tarjeta de partido con la función showMatchDetails
    const allMatchCards = document.querySelectorAll('.match-card');
    if (allMatchCards.length > 0) {
        allMatchCards.forEach(card => {
            // Aquí no usamos una función flecha para que 'this'
            // dentro de showMatchDetails() sea la 'card' correcta.
            card.addEventListener('click', showMatchDetails);
        });
    } else {
        console.warn('No se encontraron tarjetas ".match-card".');
    }

   
  
});


  module.exports = { handleLogin, handleCreateMatch, showMatchDetails };