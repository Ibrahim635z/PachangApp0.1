/**
 * @jest-environment jsdom
 */

const { handleLogin, handleCreateMatch, showMatchDetails } = require('../src/app.js');


// --- PRUEBAS PARA handleLogin ---
describe('handleLogin', () => {
    
    // Mockear (simular) 'alert' antes de cada test en este bloque
    beforeEach(() => {
        // Creamos un "espía" en window.alert y le decimos que no haga nada
        jest.spyOn(window, 'alert').mockImplementation(() => {});
    });

    // Limpiar mocks después de cada test para que no interfieran entre sí
    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('debe devolver true al ser llamada', () => {
        // Comprobamos que la función retorna 'true'
        expect(handleLogin()).toBe(true);
    });

    test('debe llamar a window.alert con el mensaje correcto', () => {
        handleLogin();
        // Comprobamos que la alerta fue llamada 1 vez
        expect(window.alert).toHaveBeenCalledTimes(1);
        // Comprobamos que fue llamada CON el texto específico
        expect(window.alert).toHaveBeenCalledWith(
            'Has hecho clic en "Log In". ¡Funcionalidad pendiente!'
        );
    });
});


// --- PRUEBAS PARA handleCreateMatch ---
describe('handleCreateMatch', () => {
    
    beforeEach(() => {
        jest.spyOn(window, 'alert').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('debe devolver true al ser llamada', () => {
        expect(handleCreateMatch()).toBe(true);
    });

    test('debe llamar a window.alert con el mensaje correcto', () => {
        handleCreateMatch();
        expect(window.alert).toHaveBeenCalledTimes(1);
        expect(window.alert).toHaveBeenCalledWith(
            'Has hecho clic en "Crear Partido". ¡Aquí iría un formulario!'
        );
    });
});


// --- PRUEBAS PARA showMatchDetails ---
describe('showMatchDetails', () => {
    
    let mockCard; // Variable para nuestra "tarjeta" falsa

    beforeEach(() => {
        jest.spyOn(window, 'alert').mockImplementation(() => {});

        // Configurar un "falso" elemento DOM (mock) que simula tu HTML
        // Jest usa 'jsdom' para esto, por eso podemos usar 'document'
        mockCard = document.createElement('div');
        mockCard.innerHTML = `
            <p class="match-location">Campo Universitario - Fuentenueva</p>
            <p class="match-time">16:00</p>
            <p class="match-spots">8/14</p>
        `;
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('debe llamar a alert con los detalles correctos del partido', () => {
        /* * Usamos .call(mockCard) para ejecutar la función 'showMatchDetails' 
         * como si 'this' fuera nuestro 'mockCard'.
         */
        showMatchDetails.call(mockCard);

        const expectedMessage = 'Partido seleccionado:\nLugar: Campo Universitario - Fuentenueva\nHora: 16:00\nPlazas: 8/14';
        
        expect(window.alert).toHaveBeenCalledTimes(1);
        expect(window.alert).toHaveBeenCalledWith(expectedMessage);
    });

    test('debe manejar un error si falta contenido en la tarjeta', () => {
        // Creamos una tarjeta rota (sin los <p> que busca)
        const mockBrokenCard = document.createElement('div');
        
        // Espiamos console.error para que no "ensucie" la salida del test
        jest.spyOn(console, 'error').mockImplementation(() => {});

        showMatchDetails.call(mockBrokenCard);

        // Debe llamar a la alerta de error
        expect(window.alert).toHaveBeenCalledTimes(1);
        expect(window.alert).toHaveBeenCalledWith('Error al mostrar detalles del partido.');
        
        // Opcional: verificar que se registró el error en la consola
        expect(console.error).toHaveBeenCalled();
    });
});
