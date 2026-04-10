// sendToDB.js - Version Firebase uniquement (pas de PHP)

export async function sendToDB(call, data, url) {
    
    try {
        // Import Firebase
        const { sendToFirebase } = await import('../firebase-config.js');
        
        console.log('Sending data to Firebase...');
        
        // Déterminer la collection Firebase selon l'URL
        let collectionName = 'experiment_data';
        
        if (url) {
            if (url.includes('LearningTask')) {
                collectionName = 'learning_task_trials';
            } else if (url.includes('TransferTask')) {
                collectionName = 'transfer_task_trials';
            } else if (url.includes('MatchingProbability')) {
                collectionName = 'matching_probability';
            } else if (url.includes('Demographics')) {
                collectionName = 'demographics';
            } else if (url.includes('Test')) {
                collectionName = 'connection_tests';
            }
        }
        
        // Envoyer à Firebase
        const result = await sendToFirebase(collectionName, data);
        
        if (result.success) {
            console.log('Data saved to Firebase:', collectionName, result.id);
        } else {
            console.error('Firebase save failed:', result.error);
            
            // Alerte si échec
            if (call === 0) { // Ne montrer l'alerte qu'une fois
                alert('Unable to save data. Please check your internet connection.');
            }
        }
        
    } catch (error) {
        console.error('Error in sendToDB:', error);
        
        // Alerte si Firebase complètement inaccessible
        if (call === 0) {
            alert('Unable to connect to database. Please check your internet connection and refresh the page.');
        }
    }
}