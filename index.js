

const request = require('request');
const fs = require('fs');

function getSongInfo(callback) {
  const options = {
    url: 'https://www.radiofrance.fr/api/v2.1/stations/fip/live/webradios/fip',
  };

  request(options, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const data = JSON.parse(body);
      callback(data);
    } else {
      callback(error || new Error(`Request failed with status code ${response.statusMessage}`));
    }
  });
}

// Main function
function main() {
	getSongInfo((data) => {
		const filePath = 'list.txt';

		const textToAppend = `${data.now.firstLine} - ${data.now.secondLine}\n`;

		fs.appendFile(filePath, textToAppend, (err) => {
			if (err) {
			  console.error('Error appending text:', err);
			} else {
			  console.log('Text appended successfully.');
			}
		  })
    }
  );
}

main();
