const admin = require('firebase-admin');
const functions = require('firebase-functions');

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: "https://miraculous-899ef-default-rtdb.firebaseio.com"
});

// Reference to Firebase Realtime Database
const db = admin.database();
const usedPasswordsRef = db.ref('usedPasswords');

exports.handler = functions.https.onRequest(async (req, res) => {
    if (req.method === "POST") {
        const { password } = req.body;

        try {
            // Get list of used passwords
            const snapshot = await usedPasswordsRef.once('value');
            const usedPasswords = snapshot.val() || [];

            // Check if password is already used
            if (Object.values(usedPasswords).includes(password)) {
                return res.status(400).json({ error: 'Ce mot de passe a déjà été utilisé.' });
            }

            // Save the new password
            const newPasswordRef = usedPasswordsRef.push();
            await newPasswordRef.set(password);

            return res.status(200).json({ message: 'Mot de passe accepté.' });
        } catch (error) {
            console.error("Erreur du serveur:", error);
            return res.status(500).json({ error: 'Erreur du serveur.' });
        }
    } else {
        return res.status(405).json({ error: 'Méthode non autorisée.' });
    }
});
