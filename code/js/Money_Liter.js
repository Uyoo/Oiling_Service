let console = require('console')

function getOilApi(){
  const http = require('http')
  let options = {
    format: 'json',
    headers: {
      'accept': 'application/json'
    },
  };
  let response = http.getUrl('http://www.opinet.co.kr/api/avgLastWeek.do?&code=F563190617&out=json', options);
  let oilValue = response.RESULT.OIL  
  oilValue = oilValue.filter((item, index) => {    
    return index == 0 || index == 3 || index == 4
  })
  
  return oilValue
}

module.exports.function = function money_Liter (inputUnit, inputValue, fuel, man) {
  var unit
  var price = getOilApi()
  var result ={}
  if(fuel == "gasoline"){
    price = price[0].PRICE
    result["baseValue"] = price
    result["baseFuel"]="휘발유"
  }else if(fuel == "diesel"){
    price = price[1].PRICE
    result["baseValue"] = price
    result["baseFuel"]="경유"
  }else if(fuel == "LPi"){
    price = price[2].PRICE
    result["baseValue"] = price
    result["baseFuel"]="LPG"
  }  
  
  if(inputUnit == "liter"){
    price = Math.round(inputValue * price)
    unit = "원"
  }else if(inputUnit == "won"){
    if(!inputValue){
      inputValue = 0;
    }    
    if(man){
      man = man.substring(0, man.length-1)
      man = Number(man)    
      inputValue = inputValue + (man*10000)
    }
    
    price = Math.round((inputValue / price)*10)/10
    unit = "ℓ"
  }
  
  result["ans"] = price + unit
  console.log(result)
  
  return result
}
