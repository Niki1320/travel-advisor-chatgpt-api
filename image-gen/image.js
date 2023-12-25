const API_KEY = process.OPENAI_API_KEY1 ;
const url = 'https://api.openai.com/v1/images/generations'
const outputImg = document.getElementById('output-img');

document.getElementById('submit-btn').addEventListener('click', () => {
  const prompt = document.getElementById('instruction').value;
  generateImage(prompt);
});

function generateImage(prompt) {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      prompt: prompt,
      n: 1,
      size: '256x256',
      response_format: 'b64_json'
    })
  };

  fetch(url, requestOptions)
    .then(response => response.json())
    .then(data => {
      const imageData = data.data[0].b64_json;
      outputImg.innerHTML = `<img src="data:image/png;base64,${imageData}">`;
    })
    .catch(error => console.error(error));
}