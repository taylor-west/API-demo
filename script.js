function CheckAPI(response) {
  try{
    if (response.status == 404) {
      console.log("ERROR: Bad API Key");
      alert("Error loading API key");
      throw Error();
    } else {
          return response.json();
    }
  }
  catch(Error){
    return Promise.reject();
  }
}
function CheckURL(response) {
  try{
    if (response.status == 404) {
      console.log("ERROR: Invalid URL");
      throw Error();
    } else {
          return response.json();
    }
  }
  catch(Error){
    return Promise.reject();
  }
}
const getKanye = fetch("https://api.kanye.rest")
  getKanye.then(CheckURL)
  .then(function(json){
    //console.log(json);
    let quote = '\"' + json.quote + '\"';
    document.getElementById("quote-block").innerHTML= quote;
  })
  //catches bad URL 404 errors
  .catch(Error);

const getIP = fetch("apiKeys.txt");
  getIP.then(CheckAPI)
  .then(data => {
    //gets API key for IP address
    let ipKey = data.ip;


    document.getElementById("ipSubmit").addEventListener("click",function(event){
      event.preventDefault();
      const ipURL = "https://ipgeolocation.abstractapi.com/v1/?api_key=" + ipKey;
      fetch(ipURL)
        //makes sure that the url goes through successfully
        .then(CheckURL)
        //gets and displays Ip Address
        .then(function(json){
          console.log(json);
          //gathers info
          let ip = json.ip_address;
          let city = json.city;
          let region = json.region;
          let postal_code = json.postal_code;
          let country = json.country;

          let ipUpdateString = "<p>Your IP Address is: <div id=\"ipAddressString\">" + ip + "</div></p>";
          ipUpdateString += "<p>That means that you are in </p>";
          ipUpdateString += "<p><strong>" + city + ", " + region + "</strong></p>";
          //updates IP address and changes block
          document.getElementById("ipResults").innerHTML = ipUpdateString;
          document.getElementById("ip-form").style.display = "none";
          //displays the option to find local pinball machines
          document.getElementById("pinball-block").style.display = "block";
          document.getElementById("pinballSubmit1").addEventListener("click",function(event){
            event.preventDefault();
            document.getElementById("pinball-form").style.display = "none";
            //checks if country is US for the pinball machine
            if(country != "United States"){
              alert("You are located outside of the United States. Unfortuntely this means that we cannot provide data on local pinball machines.")
            }else{
              let pinballURL = "https://pinballmap.com/api/v1/region/" + region + "/location_machine_xrefs.json";
              fetch(pinballURL)
                .then(CheckURL)
                .then(function(json){
                  console.log(json);
                  let numMachinesString = "<p>There are " + json.location_machine_xrefs.length + " pinball machines in your region!</p>";

                  //adds code to DOM to prompt for number of machines to display
                  displayPinballForm = "<form id=\"displayPinballNumberForm\">";
                  displayPinballForm +="<label>Please enter a number between 1-25</label><br/>";
                  displayPinballForm +="<input id=\"pinballInput\" type=\"text\"></input>"
                  displayPinballForm += "<input id=\"pinballSubmit2\" type=\"submit\" value=\submit\" style=\"display: none\"></input></form>";
                  let pinballOutcomeDiv = "<div id=\"pinballOutcomeBlock\"></div>";
                  document.getElementById("pinballResults").innerHTML = numMachinesString + displayPinballForm + pinballOutcomeDiv;
                  //gets number of machines to display
                  document.getElementById("pinballSubmit2").addEventListener("click",function(event){
                    event.preventDefault();
                    try{
                      let inputNum = document.getElementById("pinballInput").value;
                      if(inputNum > 25){
                        alert("You have disobeyed the rules and displeased the gods.");
                        throw(Error);
                      }

                      //outputs a table with the specified number of machines
                      //console.log("Number entered: " + inputNum);
                      let pinballOutcome = "<table id=\"pinballOutcomeTable\"><tr>";
                      pinballOutcome += "<th>#</th><th>Name</th><th>City</th><th>Location</th></tr>";
                      for(let i = 0; i < inputNum; i++){
                        //gathers needed variables
                        let name = json.location_machine_xrefs[i].machine.name;
                        let city = json.location_machine_xrefs[i].location.city;
                        let location = json.location_machine_xrefs[i].location.name;
                        let rowNum = i+1;
                        //adds info to the proper columns in the table
                        let resultString = "<tr><td><strong>" + rowNum + "</strong></td>";
                        resultString += "<td>" + name + "</td>";
                        resultString += "<td>" + city + "</td>";
                        resultString += "<td>" + location + "</td></tr>";
                        //adds the row to the table
                        pinballOutcome += resultString;
                      }
                      pinballOutcome += "</table>";
                      //commits table
                      document.getElementById("pinballOutcomeBlock").innerHTML = pinballOutcome;
                    }catch(Error){
                      //this is error handling for the input. If they put too big of a number, you come here.
                    }
                  })
                })
                .catch(Error);
            }
          })
        })
        //catches bad IP URL
        .catch(Error);
    })
  })
