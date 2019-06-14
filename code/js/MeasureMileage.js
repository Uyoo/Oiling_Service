var console = require('console') 

// ======= inputUnit이 돈(won)인 경우 =======
//00원으로 몇 km 갈 수 있어? -> return 거리
function won_literWhat(carName, input_value){
  let oilValue = 1500   //현재(최근) 기름값 데이터
  return 'won_literWhat'
}

//00원으로 몇 리터 채울 수 있어? -> return 리터
function won_distanceWhat(carName, input_value){
  return 'won_distanceWhat'
}

// ======= inputUnit이 리터(liter)인 경우 =======
//00리터로 몇 km 갈 수 있어? -> return 거리
function liter_distanceWhat(carName, input_value){  
  const carDatas = require('../data/cars.js') 
  console.log(carDatas)
  
  //모델과 해당되는 객체만 가져오기
  let fuelEfficiency = []
  for(let i=0; i<carDatas.length; i++){
    if(carDatas[i].carName == String(carName)){      
      fuelEfficiency.push(carDatas[i])
      break
    }    
  }
  console.log(fuelEfficiency)
  
  return 'liter_distanceWhat'
}

//00리터면 기름값 얼마야? -> return 기름값
function liter_moneyWhat(carName, input_value){
  return 'liter_moneyWhat'
}

// ======= inputUnit이 거리(distance)인 경우 =======
//00km면 기름값 얼마야? -> return 기름값
function distance_moneyWhat(carName, input_value){
  return 'distance_moneyWhat'
}

//00km면 몇 리터 채워야돼? -> return 리터
function distance_literWhat(carName, input_value){
  return 'distance_literWhat'
}

module.exports.function = function measureMileage (carName, fuel, input_value, input_unit, question) {
  var console = require('console')  
  let result = ''       
  
  let input_unit = String(input_unit)
  switch (input_unit) {    
    case 'won':
      //몇 km로 갈 수 있는지      
      if(question == 'distance_what'){  
        result = won_distanceWhat(carName, input_value)
      }

      //몇 리터를 넣을 수 있는지
      else if(question == 'liter_what'){        
        result = won_literWhat(carName, input_value)
      }
      break;
      
    case 'liter':
      //몇 km로 갈 수 있는지
      if(question == 'distance_what'){
        result = liter_distanceWhat(carName, input_value)
      }

      //기름값이 얼마인지
      else if(question == 'money_what'){
        result = liter_moneyWhat(carName, input_value)        
      }
      break;
    case 'distance':
      //몇 리터 채워야 하는지
      if(question == 'money_what'){
        result = distance_moneyWhat(carName, input_value)
      }

      //기름값이 얼마인지
      else if(question == 'liter_what'){
        result = distance_literWhat(carName, input_value)
      }
      break;
      
    default:
      console.log('Sorry')
  }
    
  return result
}