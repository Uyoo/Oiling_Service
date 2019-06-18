var console = require('console')

// ======= inputUnit이 돈(won)인 경우 =======
//00원으로 몇 리터 채울 수 있어? -> return 리터
function won_literWhat(carName, input_value){
  const http = require('http')
  let options = {
    format: 'json',
    headers: {
      'accept': 'application/json'
    },
  };
  let response = http.getUrl('http://www.opinet.co.kr/api/avgAllPrice.do?out=json&code=F563190617', options);
  console.log(response)
  
  console.log(input_value)
  
  let oilValue = 1500   //현재(최근) 기름값 데이터
  return 'won_literWhat'
}

//00원으로 몇 km 갈 수 있어? -> return 거리
function won_distanceWhat(carName, input_value){
  return 'won_distanceWhat'
}

// ======= inputUnit이 리터(liter)인 경우 =======
//00리터로 몇 km 갈 수 있어? -> return 거리
//SM5 (기름)30리터면 몇KM 갈수 있어?
//연비x리터=KM
function liter_distanceWhat(carName, input_value){  
//인풋값
  console.log(input_value)
  
  
  //carName과 일치하는 연비 데이터를 불러오기 
  const carDatas = require('../data/cars.js')
  let fuels = []
  
  
  //모델과 해당되는 객체만 가져오기
  for(let i=0; i<carDatas.length; i++){
    if(carDatas[i].carName == String(carName)){ 
      let data = carDatas[i]  //해당 자동차 정보 객체
      for(let key in data){
        if(key == 'fuel'){
          fuels = data[key]          
          break
        }
      }
      break
    }    
  }  
  console.log(fuels)
  
  
  //최근 전 주의 전국 평균 기름값 불러오기 인덱스 [0]: B034(일반 휘발유)[3]: D047(경유) [4]: K015(부탄, LPI)
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
  console.log(oilValue)
  
  
  //(연비x리터=KM)
  let liter_distanceWhat = []
  let i = 0
  for(let key in fuels){
    
    let calculate = 0
    let object = {
      fuel: '',
      distance: ''
    }

    if(key == 'gasoline' && oilValue[i].PRODCD == 'B027'){
      calculate = input_value * fuels[key][0].mileage
      object.fuel = 'gasoline'
      object.distance = calculate
      i += 1
      
    } else if(key == 'diesel' && oilValue[i].PRODCD == 'D047'){
      
      calculate = input_value * fuels[key][0].mileage 
      object.fuel = 'diesel'
      object.distance = calculate
      i += 1
      
    } else if(key == 'LPi' && oilValue[i].PRODCD == 'K015'){
      
      calculate = input_value * fuels[key][0].mileage
      object.fuel = 'LPi'
      object.distance = calculate
      i += 1
      
    }    
  
    liter_distanceWhat.push(object)
    
  
  }
  console.log(liter_distanceWhat)
  return ('KM:')
  
 
}

//00리터면 기름값 얼마야? -> return 기름값
//SM5 30리터[B]면 (기름값)얼마야?
//평균기름값xB
function liter_moneyWhat(carName, input_value){
  //인풋값
  console.log(input_value)
  
  
  //carName과 일치하는 연비 데이터를 불러오기 
  const carDatas = require('../data/cars.js')
  let fuels = []
  
  
  //모델과 해당되는 객체만 가져오기
  for(let i=0; i<carDatas.length; i++){
    if(carDatas[i].carName == String(carName)){ 
      let data = carDatas[i]  //해당 자동차 정보 객체
      for(let key in data){
        if(key == 'fuel'){
          fuels = data[key]          
          break
        }
      }
      break
    }    
  }  
  console.log(fuels)
  
  
  //최근 전 주의 전국 평균 기름값 불러오기 인덱스 [0]: B034(일반 휘발유)[3]: D047(경유) [4]: K015(부탄, LPI)
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
  console.log(oilValue)
  
  
  //(평균기름값x리터=KM)
  let liter_moneyWhat = []
  let i = 0
  for(let key in fuels){
    
    let calculate = 0
    let object = {
      fuel: '',
      money: ''
    }

    if(key == 'gasoline' && oilValue[i].PRODCD == 'B027'){
      calculate = input_value * oilValue[i].PRICE
      object.fuel = 'gasoline'
      object.money = calculate
      i += 1
      
    } else if(key == 'diesel' && oilValue[i].PRODCD == 'D047'){
      
      calculate = input_value * oilValue[i].PRICE
      object.fuel = 'diesel'
      object.money = calculate
      i += 1
      
    } else if(key == 'LPi' && oilValue[i].PRODCD == 'K015'){
      
      calculate = input_value * oilValue[i].PRICE
      object.fuel = 'LPi'
      object.money = calculate
      i += 1
      
    }    
  
    liter_moneyWhat.push(object)
    
  
  }
  console.log(liter_moneyWhat)
  return ('money:')

}

// ======= inputUnit이 거리(distance)인 경우 =======
//00km면 기름값 얼마야? -> return 기름값
//SM5 20KM 타면 (기름값)얼마야?  주유비=주행거리÷연비x기름값
function distance_moneyWhat(carName, input_value){
  //인풋값
  console.log(input_value)
  
  
  //carName과 일치하는 연비 데이터를 불러오기 
  const carDatas = require('../data/cars.js')
  let fuels = []
  
  
  //모델과 해당되는 객체만 가져오기
  for(let i=0; i<carDatas.length; i++){
    if(carDatas[i].carName == String(carName)){ 
      let data = carDatas[i]  //해당 자동차 정보 객체
      for(let key in data){
        if(key == 'fuel'){
          fuels = data[key]          
          break
        }
      }
      break
    }    
  }  
  console.log(fuels)
  
  
  //최근 전 주의 전국 평균 기름값 불러오기 인덱스 [0]: B034(일반 휘발유)[3]: D047(경유) [4]: K015(부탄, LPI)
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
  console.log(oilValue)
  
  
  //(주유비=주행거리÷연비x기름값)
  let distance_moneyWhat = []
  let i = 0
  for(let key in fuels){
    
    let calculate = 0
    let object = {
      fuel: '',
      money: ''
    }

    if(key == 'gasoline' && oilValue[i].PRODCD == 'B027'){
      calculate = input_value / fuels[key][0].mileage * oilValue[i].PRICE
      object.fuel = 'gasoline'
      object.money = calculate
      i += 1
      
    } else if(key == 'diesel' && oilValue[i].PRODCD == 'D047'){
      
      calculate = input_value / fuels[key][0].mileage * oilValue[i].PRICE
      object.fuel = 'diesel'
      object.money = calculate
      i += 1
      
    } else if(key == 'LPi' && oilValue[i].PRODCD == 'K015'){
      
      calculate = input_value / fuels[key][0].mileage * oilValue[i].PRICE
      object.fuel = 'LPi'
      object.money = calculate
      i += 1
      
    }    
  
    distance_moneyWhat.push(object)
    
  
  }
  console.log(distance_moneyWhat)
  return ('money:')
}


///////////////////////////SM5 20KM 타면 (기름)몇리터 넣어야되?  리터=KM/연비//////////////////////////////////////////
//00km면 몇 리터 채워야돼? -> return 리터 아반떼 30킬로면 몇리터  (리터=KM/연비)
function distance_literWhat(carName, input_value){
  
  //인풋값
  console.log(input_value)
  
  
  //carName과 일치하는 연비 데이터를 불러오기 
  const carDatas = require('../data/cars.js')
  let fuels = []
  
  
  //모델과 해당되는 객체만 가져오기
  for(let i=0; i<carDatas.length; i++){
    if(carDatas[i].carName == String(carName)){ 
      let data = carDatas[i]  //해당 자동차 정보 객체
      for(let key in data){
        if(key == 'fuel'){
          fuels = data[key]          
          break
        }
      }
      break
    }    
  }  
  console.log(fuels)
  
  
  //최근 전 주의 전국 평균 기름값 불러오기 인덱스 [0]: B034(일반 휘발유)[3]: D047(경유) [4]: K015(부탄, LPI)
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
  console.log(oilValue)
  
  
  //(리터=KM/연비)
  let distance_literWhat = []
  let i = 0
  for(let key in fuels){
    
    let calculate = 0
    let object = {
      fuel: '',
      liter: ''
    }

    if(key == 'gasoline' && oilValue[i].PRODCD == 'B027'){
      calculate = input_value / fuels[key][0].mileage
      object.fuel = 'gasoline'
      object.liter = calculate
      i += 1
      
    } else if(key == 'diesel' && oilValue[i].PRODCD == 'D047'){
      
      calculate = input_value / fuels[key][0].mileage
      object.fuel = 'diesel'
      object.liter = calculate
      i += 1
      
    } else if(key == 'LPi' && oilValue[i].PRODCD == 'K015'){
      
      calculate = input_value / fuels[key][0].mileage
      object.fuel = 'LPi'
      object.liter = calculate
      i += 1
      
    }    
  
    distance_literWhat.push(object)
    
  
  }
  console.log(distance_literWhat)
  return ('liter:')
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