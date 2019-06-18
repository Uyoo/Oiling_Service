let console = require('console')

// ======= inputUnit이 돈(won)인 경우 =======
//00원으로 몇 리터 채울 수 있어? -> return 리터
function won_literWhat(carName, input_value){
  //1. 기름 api에서 기름값 받아오기(가솔린, 디젤, 부탄(Lpi))
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
  
  let won_literWhat = oilValue.map(item => {    
    let calculate = 0
    let object = {
      fuel: '',
      liter: ''
    }
    
    if(item.PRODCD == 'B027'){            
      calculate = input_value / item.PRICE
      object.fuel = 'gasoline'
      object.liter = calculate      
      
    } else if(item.PRODCD == 'D047'){     
      calculate = input_value / item.PRICE 
      object.fuel = 'diesel'
      object.liter = calculate
      
    } else if(item.PRODCD == 'K015'){      
      calculate = input_value / item.PRICE 
      object.fuel = 'LPi'
      object.liter = calculate
    }    
    
    return object
  })
  console.log(won_literWhat)
   
  return 'won_literWhat'
}

//00원으로 몇 km 갈 수 있어? -> return 거리
function won_distanceWhat(carName, input_value){     
  //최근 1주의 주간 평균 유가(전국)
  //1. 기름 api에서 기름값 받아오기(가솔린, 디젤, 부탄(Lpi))
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
  
  //2. cars.js에서 연비(mileage) 받아오기(가솔린, 디젤, 부탄(Lpi))
  const carDatas = require('../data/cars.js')
  let fuels = []
  //모델과 해당되는 객체만 가져오기
  for(let i=0; i<carDatas.length; i++){
    if(carDatas[i].carName == String(carName)){ 
      let data = carDatas[i]  //해당 자동차 정보 객체
      for(let key in data){
        if(key == 'fuel'){
          fuels = data[key]   //해당 자동차의 연료 정보(가솔린, 디젤, LPI)     
          break
        }
      }
      break
    }    
  }  
  
  //주행거리=주유비x연비÷기름값
  let won_distanceWhat = []
  let i = 0
  for(let key in fuels){
    let calculate = 0
    let object = {
      fuel: '',
      distance: ''
    }
    if(key == 'gasoline' && oilValue[i].PRODCD == 'B027'){      
      calculate = input_value * fuels[key][0].mileage / oilValue[i].PRICE     
      object.fuel = 'gasoline'
      object.distance = calculate
      i += 1
      
    } else if(key == 'diesel' && oilValue[i].PRODCD == 'D047'){      
      calculate = input_value * fuels[key][0].mileage / oilValue[i].PRICE
      object.fuel = 'diesel'
      object.distance = calculate
      i += 1
      
    } else if(key == 'LPi' && oilValue[i].PRODCD == 'K015'){      
      calculate = input_value * fuels[key][0].mileage / oilValue[i].PRICE  
      object.fuel = 'LPi'
      object.distance = calculate
      i += 1
    }    
    
    won_distanceWhat.push(object)
  }
  console.log('won_distanceWhat:', won_distanceWhat)
  
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
  console.log(input_value)
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
      //기름값이 얼마인지
      if(question == 'money_what'){
        result = distance_moneyWhat(carName, input_value)
      }

      //몇 리터 채워야 하는지
      else if(question == 'liter_what'){
        result = distance_literWhat(carName, input_value)
      }
      break;
      
    default:
      console.log('Sorry')
  }
    
  return result
}
