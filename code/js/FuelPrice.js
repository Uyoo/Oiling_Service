//기름 api 가져오기
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

module.exports.function = function fuelPrice (fuel) {
  let console = require('console')  
  let result = {}   
  
  let fuel_ = String(fuel)
  let data
  switch(fuel_){
    case "gasoline":
      data = getOilApi()[0]
      result["fuel"] = fuel_
      result["price"] = data.PRICE
      result["fuelKorean"]= "가솔린"
      break
      
    case "diesel":
      data = getOilApi()[1]
      result["fuel"] = fuel_
      result["price"] = data.PRICE
      result["fuelKorean"]= "디젤"
      break
    
    case "LPi":
      data = getOilApi()[2]
      result["fuel"] = fuel_
      result["price"] = data.PRICE
      result["fuelKorean"]= "LPi"
      break
      
    default:
      console.log('Sorry')
  } 
  
  return result
}
