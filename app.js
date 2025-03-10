const express = require('express');
const path = require('path');
const archiver = require('archiver');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Folder containing your files
const downloadFolder = path.join(__dirname, 'downloads');

// Ensure the download folder exists
if (!fs.existsSync(downloadFolder)) {
    fs.mkdirSync(downloadFolder, { recursive: true });
}

app.get('/download-files', (req, res) => {
    // Create a ZIP archive
    const archive = archiver('zip', { zlib: { level: 9 } });

    // Set the response headers to force download
    res.setHeader('Content-Disposition', 'attachment; filename="files.zip"');
    res.setHeader('Content-Type', 'application/zip');

    // Pipe the zip archive to the response
    archive.pipe(res);

    // Add files from the folder
    archive.directory(downloadFolder, false);

    // Finalize the archive
    archive.finalize();

    archive.on('error', (err) => {
        res.status(500).send({ error: err.message });
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
