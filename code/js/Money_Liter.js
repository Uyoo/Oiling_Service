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
  var result
  if(fuel == "gasoline"){
    price = price[0].PRICE
  }else if(fuel == "diesel"){
    price = price[1].PRICE
  }else if(fuel == "LPi"){
    price = price[2].PRICE
  }  
  
  if(inputUnit == "liter"){
    price = Math.round(inputValue * price)
    unit = "원"
  }else if(inputUnit == "won"){
    price = Math.round((inputValue / price)*10)/10
    unit = "리터"    
  }
    
  
  result =  price + unit
  console.log(result)
  
  return result
}
