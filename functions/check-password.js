const admin = require('firebase-admin');
const functions = require('firebase-functions');

// Initialize Firebase Admin SDK
admin.initializeApp();

// Reference to Firebase Realtime Database
const db = admin.database();
const usedPasswordsRef = db.ref('usedPasswords');

exports.handler = functions.https.onRequest(async (req, res) => {
  if (req.method === "POST") {
    const { password } = req.body; // Get password from the form

    try {
      // Get list of used passwords from Firebase Realtime Database
      const snapshot = await usedPasswordsRef.once('value');
      const usedPasswords = snapshot.val() || [];

      // Check if password has been used
      if (usedPasswords.includes(password)) {
        return res.status(400).json({ error: 'Ce mot de passe a déjà été utilisé.' });
      }

      // If it's a new password, add it to Firebase
      usedPasswords.push(password);
      await usedPasswordsRef.set(usedPasswords);

      // Respond that the password was accepted
      return res.status(200).json({ message: 'Mot de passe accepté.' });
    } catch (error) {
      return res.status(500).json({ error: 'Erreur du serveur.' });
    }
  } else {
    return res.status(405).json({ error: 'Méthode non autorisée.' });
  }
});
