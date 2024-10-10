const fs = require('fs');

// Function to format proxy into the format http://user:pass@ip:port
function formatProxy(proxy) {
    let formattedProxy = '';

    try {
        // Split the proxy into parts by ":"
        const parts = proxy.split(':');
        if (parts.length === 4) {
            const ip = parts[0];
            const port = parts[1];
            const user = parts[2];
            const pass = parts[3];

            // Check if the port is a valid number
            if (isNaN(port) || port <= 0 || port > 65535) {
                throw new Error('Invalid port number');
            }

            formattedProxy = `http://${user}:${pass}@${ip}:${port}`;
        } else if (parts.length === 2) {
            // Handle proxy format ip:port (default user:pass)
            const ip = parts[0];
            const port = parts[1];

            // Validate the port number
            if (isNaN(port) || port <= 0 || port > 65535) {
                throw new Error('Invalid port number');
            }

            formattedProxy = `http://user:pass@${ip}:${port}`;
        } else if (parts.length === 3) {
            // Handle proxy format ip:port:user (default pass)
            const ip = parts[0];
            const port = parts[1];
            const user = parts[2];

            // Validate the port number
            if (isNaN(port) || port <= 0 || port > 65535) {
                throw new Error('Invalid port number');
            }

            formattedProxy = `http://${user}:pass@${ip}:${port}`;
        } else {
            console.error(`Invalid proxy format: ${proxy}`);
        }
    } catch (error) {
        console.error(`Error formatting proxy ${proxy}:`, error.message);
    }

    return formattedProxy;
}


// Function to convert proxies and save them to a file
function convertProxies(inputFile, outputFile) {
    fs.readFile(inputFile, 'utf8', (err, data) => {
        if (err) {
            console.error(`Could not read file ${inputFile}:`, err);
            return;
        }

        // Process the data, convert proxies, and save them to a new file
        const proxies = data.split('\n').filter(Boolean); // Filter removes empty lines
        const formattedProxies = proxies.map(proxy => {
            // Remove the date part
            const cleanedProxy = proxy.split(' : ')[0].trim();
            return formatProxy(cleanedProxy);
        });

        fs.writeFile(outputFile, formattedProxies.join('\n'), (err) => {
            if (err) {
                console.error(`Could not write to file ${outputFile}:`, err);
            } else {
                console.log(`Formatted proxies saved to ${outputFile}`);
            }
        });
    });
}

// Run the conversion
convertProxies('inproxy.txt', 'outproxy.txt');
