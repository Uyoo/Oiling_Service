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

module.exports.function = function money_Liter (inputUnit, inputValue, fuel) {
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
    inputValue = Number(inputValue)
    price = Math.round(inputValue * price)
    unit = "원"
  }else if(inputUnit == "won"){    
    
    if(inputValue.substring(0, 1) == "만"){
      inputValue = 10000
    }else if(inputValue.substring(0, 1) == "천"){
      inputValue = 1000
    }else{
      inputValue = inputValue.split("만")
      if(inputValue.length == 2){
        inputValue = (Number(inputValue[0])*10000) + Number(inputValue[1].substring(1, inputValue[1].length))
      }else{
        inputValue = Number(inputValue)
      }
   }
    
    price = Math.round((inputValue / price)*10)/10
    unit = "ℓ"
  }
  
  result["ans"] = price + unit
  console.log(result)
  
  return result
}
