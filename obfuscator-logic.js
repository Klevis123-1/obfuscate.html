// obfuscator-logic.js - All JavaScript logic for the HTML Obfuscator
// This version implements significantly stronger obfuscation techniques for the output HTML,
// making the dynamically generated JavaScript loader extremely difficult to read and reverse-engineer.

document.addEventListener('DOMContentLoaded', () => {
    const inputHtml = document.getElementById('inputHtml');
    const outputHtml = document.getElementById('outputHtml');
    const obfuscateButton = document.getElementById('obfuscateButton');
    const copyButton = document.getElementById('copyButton');
    const messageBox = document.getElementById('messageBox');
    const messageText = document.getElementById('messageText');

    // Function to display a message to the user with smooth animations
    function showMessage(message, type = 'info') {
        // Reset classes and hide initially
        messageBox.classList.add('hidden', 'opacity-0', 'scale-90');
        messageBox.classList.remove('bg-red-100', 'border-red-400', 'text-red-700', 'bg-green-100', 'border-green-400', 'text-green-700', 'bg-yellow-100', 'border-yellow-400', 'text-yellow-700');
        messageBox.querySelector('svg').classList.remove('text-red-500', 'text-green-500', 'text-yellow-500', 'hover:bg-red-200', 'hover:bg-green-200', 'hover:bg-yellow-200');

        messageText.textContent = message;

        // Apply new type-specific classes
        if (type === 'success') {
            messageBox.classList.add('bg-green-100', 'border-green-400', 'text-green-700');
            messageBox.querySelector('svg').classList.add('text-green-500', 'hover:bg-green-200');
        } else if (type === 'error') {
            messageBox.classList.add('bg-red-100', 'border-red-400', 'text-red-700');
            messageBox.querySelector('svg').classList.add('text-red-500', 'hover:bg-red-200');
        } else { // default info/warning
            messageBox.classList.add('bg-yellow-100', 'border-yellow-400', 'text-yellow-700');
            messageBox.querySelector('svg').classList.add('text-yellow-500', 'hover:bg-yellow-200');
        }

        // Show message with transition
        setTimeout(() => {
            messageBox.classList.remove('hidden');
            messageBox.classList.remove('opacity-0', 'scale-90');
        }, 10); // Small delay to ensure CSS transition is triggered

        // Hide message after 5 seconds with transition
        setTimeout(() => {
            messageBox.classList.add('opacity-0', 'scale-90');
            setTimeout(() => {
                messageBox.classList.add('hidden');
            }, 500); // Duration of the hide transition
        }, 5000); // Total display time
    }

    // Function to obfuscate HTML content
    function obfuscateHtmlContent() {
        try {
            let rawHtml = inputHtml.value;

            if (!rawHtml.trim()) {
                showMessage('Please paste some HTML code to obfuscate!', 'error');
                return;
            }

            // Step 1: Remove HTML comments and minify whitespace from the *input* HTML
            let cleanedHtml = rawHtml
                .replace(/<!--[\s\S]*?-->/g, '') // Remove HTML comments
                .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
                .trim(); // Trim leading/trailing whitespace

            // Step 2: Convert the cleaned HTML into an array of HEXADECIMAL character codes.
            let hexCodes = [];
            for (let i = 0; i < cleanedHtml.length; i++) {
                // Convert char code to hex, pad with leading zero if necessary
                let hex = cleanedHtml.charCodeAt(i).toString(16);
                hexCodes.push(hex.length === 1 ? '0' + hex : hex);
            }
            const hexCodesString = hexCodes.join(''); // Join without separators to make splitting harder

            // Step 3: Create the dynamic loader JavaScript snippet.
            // This JavaScript is heavily obfuscated, with no comments or hints, and minified.
            // Variable names are extremely short (single characters).
            // The logic to reconstruct the HTML from hex characters is dense.
            // The `</script>` bypass is also integrated densely.
            const jsLoader = `(function(){var a='${hexCodesString}',b=[],c,d='';for(c=0;c<a.length;c+=2){b.push(a.substring(c,c+2));}for(c=0;c<b.length;c++){d+=String.fromCharCode(parseInt(b[c],16));}d=d.replace(/<\\x2Fscript>/g,'<'+'/script>');document.open();document.write(d);document.close();})();`;

            // Step 4: Construct the final, fully obfuscated HTML page structure.
            // The main HTML structure (DOCTYPE, html, head, script, body) remains unencoded
            // for correct browser parsing. Only the dynamically injected content is obfuscated
            // via the extremely dense `jsLoader` script.
            const finalObfuscatedHtml = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Obfuscated Page</title>
</head>
<body>
    <script>
        ${jsLoader}
    </script>
</body>
</html>`;

            outputHtml.value = finalObfuscatedHtml;
            showMessage('HTML obfuscated successfully with maximum strength and no hints!', 'success');
        } catch (error) {
            console.error('Obfuscation error:', error);
            showMessage('An unexpected error occurred during obfuscation. Please check your input HTML for valid syntax.', 'error');
        }
    }

    // Function to copy text to clipboard
    function copyToClipboard() {
        if (!outputHtml.value.trim()) {
            showMessage('Nothing to copy! Please obfuscate some HTML first.', 'info');
            return;
        }
        try {
            outputHtml.select(); // Select the text in the output textarea
            outputHtml.setSelectionRange(0, 99999); // For mobile devices

            // Use document.execCommand('copy') for better compatibility in iframes
            document.execCommand('copy');
            showMessage('Obfuscated HTML copied to clipboard!', 'success');
        } catch (err) {
            console.error('Failed to copy text: ', err);
            showMessage('Failed to copy to clipboard. Your browser might not support automatic copying or you are in a restricted environment. Please copy manually.', 'error');
        }
    }

    // Event Listeners
    obfuscateButton.addEventListener('click', obfuscateHtmlContent);
    copyButton.addEventListener('click', copyToClipboard);
});
