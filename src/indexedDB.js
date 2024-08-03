const DB_NAME = 'GameScoresDB';
const DB_VERSION = 1;
const STORE_NAME = 'scores';

// Función para abrir y configurar la base de datos
const openDatabase = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });

            objectStore.createIndex('time', 'time', { unique: false });
            objectStore.createIndex('moves', 'moves', { unique: false });
            objectStore.createIndex('time_moves', ['time', 'moves'], { unique: false });
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
}

// Función para obtener todos los registros
const getAllScores = (db) => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const objectStore = transaction.objectStore(STORE_NAME);
        const request = objectStore.getAll();

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
}

// Función para agregar un registro
const addScore = (db, score) => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const objectStore = transaction.objectStore(STORE_NAME);
        const request = objectStore.add(score);

        request.onsuccess = () => {
            resolve();
        };

        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
}

// Función para eliminar un registro
const deleteScore = (db, id) => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const objectStore = transaction.objectStore(STORE_NAME);
        const request = objectStore.delete(id);

        request.onsuccess = () => {
            resolve();
        };

        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
}

const processScore = async (elapsedTime, counter) => {
    const db = await openDatabase();

    const allScores = await getAllScores(db);

    const newScore = {
        time: Math.floor(elapsedTime / 1000), // Convertir elapsedTime a segundos
        moves: counter,
        date: new Date().toISOString()
    };

    // Insertar la nueva puntuación si hay menos de 5 entradas
    if (allScores.length < 5) {
        await addScore(db, newScore);
    } else {
        // Ordenar por tiempo y luego por movimientos
        allScores.sort((a, b) => {
            if (a.time === b.time) {
                return a.moves - b.moves;
            }
            return a.time - b.time;
        });

        // Verificar si la nueva puntuación es mejor que la peor en el top 5
        const worstBestScore = allScores[4];
        const newTimeInSeconds = Math.floor(elapsedTime / 1000);
        if (newTimeInSeconds < worstBestScore.time || (newTimeInSeconds === worstBestScore.time && counter < worstBestScore.moves)) {
            // Eliminar la peor puntuación del top 5
            await deleteScore(db, worstBestScore.id);

            // Agregar la nueva puntuación
            await addScore(db, newScore);
        }
    }
}

export {
    processScore,
    getAllScores,
    openDatabase
};