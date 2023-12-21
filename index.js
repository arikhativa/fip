

const request = require('request');
const fs = require('fs');

function getSongInfo(callback) {
  const options = {
    url: 'https://www.radiofrance.fr/fip/api/live/webradios/fip',
  };

  request(options, (error, response, body) => {
    if (!error && response.statusCode === 200) {
        const data = JSON.parse(body);
        callback(data);
    } else {
      callback(error || new Error(`Request failed with status code ${response.statusCode}`));
    }
  });
}

// Main function
function main() {
	getSongInfo((data) => {
		const filePath = 'list.txt';

		const textToAppend = `${data.now.firstLine} - ${data.now.secondLine}\n`;

		fs.readFile(filePath, 'utf8', (readErr, content) => {
			if (readErr) {
			  console.error('Error reading file:', readErr);
			  return;
			}
		  
			const firstLine = content.trim().split('\n')[0];
			if (firstLine === textToAppend.trim()) {
				return;
			}

			// Prepend the new text to the existing content
			const updatedContent = textToAppend + content;
		  
			// Write the updated content back to the file
			fs.writeFile(filePath, updatedContent, (writeErr) => {
			  if (writeErr) {
				console.error('Error writing file:', writeErr);
			  }
			});
		});
    }
  );
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

for (let i = 0; i < 20; i++) {
    main();
    sleep(300000); 
}
