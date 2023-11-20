document.getElementById('urlForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const originalUrl = document.getElementById('originalUrl').value;
    console.log(originalUrl);

    try {
        const response = await fetch('http://localhost:5000/api/shorten', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ originalUrl }),
        });

        const data = await response.json();

        if (data.shortUrl) {
            document.getElementById('shortenedUrl').innerHTML = `<label>Shortened URL:</label><br>
            <a id="url" href="${data.shortUrl}" target="_blank">${data.shortUrl}</a>
             <button id="copyButton" onclick="copyToClipboard()"><i class="fa fa-clone" aria-hidden="true"></i></button>`
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

// Add this function to script.js
function copyToClipboard() {
    const shortenedUrlElement = document.getElementById('url');
    const range = document.createRange();
    range.selectNode(shortenedUrlElement);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();

    alert('Copied to clipboard!');
}

