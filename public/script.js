// Initialize EmailJS
(function() {
    emailjs.init("P5sZnQL5xeXagOuEn");
})();

// Handle form submission
document.getElementById('downloadForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Send the password to the server to check if it has been used
    fetch('/.netlify/functions/check-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === "Mot de passe accepté.") {
            alert("Mot de passe valide! Téléchargement en cours...");

            // Trigger download of file (replace with your actual file path)
            const fileUrl = 'ladybug.png'; // Ensure this is the correct file URL
            const a = document.createElement('a');
            a.href = fileUrl;
            a.download = 'miraculous.png'; // File name to be downloaded
            a.click();

            // Send email using EmailJS
            const templateParams = {
                email: email,
                password: password,
            };

            emailjs.send('service_2pmpp5p', 'template_0gmgvlw', templateParams)
                .then((response) => {
                    console.log('Email sent successfully!', response);
                }, (error) => {
                    console.error('Failed to send email:', error);
                });

        } else {
            alert(data.error);  // If password is invalid, alert the user
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Quelque chose s\'est mal passé!');
    });
});
