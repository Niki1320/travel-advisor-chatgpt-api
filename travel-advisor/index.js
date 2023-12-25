const movieBossText = document.getElementById('movie-boss-text')
const outputContainer=document.getElementById('output-container')
const url ="https://api.openai.com/v1/completions";
const OPENAI_API_KEY1=process.env.OPENAI_API_KEY1;
const OPENAI_API_KEY2=process.env.OPENAI_API_KEY2;
const OPENAI_API_KEY3=process.env.OPENAI_API_KEY3;
const url1 = 'https://api.openai.com/v1/images/generations'

$(window).on('load', function() {
    $("#output-container").css("display","block");
});

//document.getElementById("send-btn-dest")
document.addEventListener('DOMContentLoaded',()=> {
    const src = localStorage.getItem('usersrc');
    const dest = localStorage.getItem('userdest');
    addButtonToContainer('src-button', src);
    
    if(dest) {
        var userInput=dest;
        $("#output-container").css("display","block");
        fetchBotReply(userInput);
        addButtonToContainer('dest-button', userInput);
        fetchBotNames(userInput);
    }
    
})
function addButtonToContainer(containerId, point) {
    const container = document.getElementById(containerId);
    
    const button = document.createElement('button');
    button.textContent = point;
    button.classList.add('point-button');

    // Add a click event listener to each button to do something when clicked
    button.addEventListener('click', () => {
        fetchDetails(point);
    });

    // Add the button to the container
    container.appendChild(button);
}

// Function to display the points in the specified containers
function displayPoints(points) {
    // Clear any previous content
    const containers = document.getElementsByClassName('button-container');
    // Array.from(containers).forEach((container) => {
    //     container.innerHTML = '';
    // });

    // Separate the points into three groups (you can adjust the logic as needed)
    const group1 = points.slice(0, 1);
    const group2 = points.slice(1, 2);
    const group3 = points.slice(2,3);
    const group4 = points.slice(3,4);
    const group5 = points.slice(4,5);

    // Add buttons to the corresponding containers
    //addButtonToContainer('dest-button', userInput);
    group1.forEach((point) => addButtonToContainer('container1', point));
    group2.forEach((point) => addButtonToContainer('container2', point));
    group3.forEach((point) => addButtonToContainer('container3', point));
    group4.forEach((point) => addButtonToContainer('container4', point));
    group5.forEach((point) => addButtonToContainer('container5', point));
}


async function fetchBotReply(userInput) {
    var prompt=$("#setup-textarea").val();
    fetch(url,{
        method:'POST',
        headers: {
            'Content-Type':'application/json',
            'Authorization':"Bearer "+OPENAI_API_KEY1
        },
        body: JSON.stringify({
            'model':'text-davinci-003',
            'prompt': `Generate a short message to enthusiastically with say an ${userInput} sounds interesting and it will take a few minutes to think about it
            ###
            outline: chennai
            message: That is a beautiful place to visit let me see how I can help you.
            ###
            outline: Hawaii
            message: That is  a wonderful vacation spot.
            ###
  
            outline: ${userInput}
            message:`,
            'max_tokens': 100
        })
        }).then(response=>response.json()).then(data=>{
            console.log(data.choices[0].text );

            setTimeout(function(){
                $("#output-container").css("display","block");
                

        },1000)
    })
}
async function fetchBotNames(userInput) {
    var prompt=$("#setup-textarea").val();
    fetch(url,{
        method:'POST',
        headers: {
            'Content-Type':'application/json',
            'Authorization':"Bearer "+OPENAI_API_KEY1
        },
        body: JSON.stringify({
            'model':'text-davinci-003',
            'prompt': `Generate the names of top 5 tourist destinations for the place ${userInput} such that with respect to the first destination, sort all others based on distance in the place ${userInput}`,
            'max_tokens': 100
        })
        }).then(response=>response.json()).then(data=>{
            console.log(data.choices[0].text );
            
            setTimeout(function(){
                $("#output-container").css("display","block");
                const generatedResponse=data.choices[0].text;
                const points=generatedResponse.split('\n').filter((point) => point.trim() !== '');
                
                displayPoints(points);
                
                
        },1000)
    })
}
async function fetchDetails(points) {
    var prompt=$("#setup-textarea").val();
    fetch(url,{
        method:'POST',
        headers: {
            'Content-Type':'application/json',
            'Authorization':"Bearer "+OPENAI_API_KEY2
        },
        body: JSON.stringify({
            'model':'text-davinci-003',
            'prompt': `Generate a description for the place ${points}
            ###
            outline:Tropical Paradise
            message:Escape to a tropical paradise with pristine white-sand beaches, crystal-clear turquoise waters, and swaying palm trees. Immerse yourself in the warm embrace of the sun and indulge in water sports or simply relax in a hammock by the shore.
            ###
            outline:Enchanting Mountain Retreat
            message:Discover an enchanting mountain retreat nestled amidst lush forests and snow-capped peaks. Breathe in the crisp mountain air as you embark on scenic hikes, witness cascading waterfalls, and unwind in charming cabins with stunning views.
            ###
            outline:${points}
            message:`,
            'max_tokens': 200,
        })
        }).then(response=>response.json()).then(data=>{
            outputContainer.innerText=data.choices[0].text;
            fetchImagePrompt(points);
    })
}
async function fetchImagePrompt(points) {
    try {
      const response = await fetchAPI(url, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + OPENAI_API_KEY3
        },
        body: JSON.stringify({
          'model': 'text-davinci-003',
          'prompt': `Give a short description of an image that best represents the place ${points}. The description should be rich in visual detail but contain no names.`,
          max_tokens: 100
        })
      });
  
      const data = await response.json();
      const imagePrompt = data.choices[0].text.trim();
      fetchImageUrl(imagePrompt);
     //movieBossText.innerText = imagePrompt;
    } catch (error) {
      console.error("Error:", error);
    }
  }
  
  async function fetchImageUrl(imagePrompt){
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': "Bearer "+OPENAI_API_KEY1
      },
      body: JSON.stringify({
        prompt:`${imagePrompt}. There should be no text in this image.`,
        n: 1,
        size: '512x512',
        response_format: 'b64_json'
      })
    };
    fetch(url1, requestOptions)
    .then(response => response.json())
    .then(data => {
        document.getElementById('output-img-container').innerHTML="I exist"
      //const imageData = data.data[0].b64_json;
      if (data.data && data.data.length > 0) {
        
        document.getElementById('output-img-container').innerHTML = `<img src="data:image/png;base64,${data.data[0].b64_json}">`;
      }
      
    //   document.getElementById('view-pitch-btn').addEventListener('click', ()=>{
    //   document.getElementById('setup-container').style.display = 'none'
    //   document.getElementById('output-container').style.display = 'flex'
      
    })
    
  }
  
  // Helper function to handle fetch and rate limits
  async function fetchAPI(url, options) {
    const response = await fetch(url, options);
    if (response.status === 429) {
      // Handle rate limit by waiting and retrying the request after a delay
      const retryAfter = parseInt(response.headers.get('Retry-After')) || 1;
      await sleep(retryAfter * 1000);
      return fetchAPI(url, options); // Retry the request
    }
    return response;
  }
  
  // Helper function to introduce delay using setTimeout
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }