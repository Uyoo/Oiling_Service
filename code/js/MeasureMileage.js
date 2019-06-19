var console = require('console')

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

// ======= inputUnit이 돈(won)인 경우 =======
//00원으로 몇 리터 채울 수 있어? -> return 리터
function won_literWhat(carName, input_value){
  //기름 api에서 기름값 받아오기(가솔린, 디젤, 부탄(Lpi))
  let oilValue = getOilApi()
  
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
  //기름 api에서 기름값 받아오기(가솔린, 디젤, 부탄(Lpi))
  let oilValue = getOilApi()
  
  //cars.js에서 연비(mileage) 받아오기(가솔린, 디젤, 부탄(Lpi))
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
  
  //주행거리 = 주유비 x 연비 ÷ 기름값
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
      object.fuel = key
      object.distance = calculate
      i += 1
      
    } else if(key == 'diesel' && oilValue[i].PRODCD == 'D047'){      
      calculate = input_value * fuels[key][0].mileage / oilValue[i].PRICE
      object.fuel = key
      object.distance = calculate
      i += 1
      
    } else if(key == 'LPi' && oilValue[i].PRODCD == 'K015'){      
      calculate = input_value * fuels[key][0].mileage / oilValue[i].PRICE  
      object.fuel = key
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
//연비 x 리터 = KM
function liter_distanceWhat(carName, input_value){    
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
  let oilValue = getOilApi()
    
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
      object.fuel = key
      object.distance = calculate
      i += 1
      
    } else if(key == 'diesel' && oilValue[i].PRODCD == 'D047'){
      
      calculate = input_value * fuels[key][0].mileage 
      object.fuel = key
      object.distance = calculate
      i += 1
      
    } else if(key == 'LPi' && oilValue[i].PRODCD == 'K015'){
      
      calculate = input_value * fuels[key][0].mileage
      object.fuel = key
      object.distance = calculate
      i += 1      
    }    
  
    liter_distanceWhat.push(object)      
  }
  console.log(liter_distanceWhat)
  
  return ('KM:')
}

//00리터면 기름값 얼마야? -> return 기름값
//평균기름값 x B
function liter_moneyWhat(carName, input_value){
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
  let oilValue = getOilApi()
    
  //평균기름값x리터=KM
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
      object.fuel = key
      object.money = calculate
      i += 1
      
    } else if(key == 'diesel' && oilValue[i].PRODCD == 'D047'){      
      calculate = input_value * oilValue[i].PRICE
      object.fuel = key
      object.money = calculate
      i += 1
      
    } else if(key == 'LPi' && oilValue[i].PRODCD == 'K015'){      
      calculate = input_value * oilValue[i].PRICE
      object.fuel = key
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
function distance_moneyWhat(carName, input_value){
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
  let oilValue = getOilApi()  
  
  //주유비 = 주행거리 ÷ 연비 x 기름값
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
      object.fuel = key
      object.money = calculate
      i += 1
      
    } else if(key == 'diesel' && oilValue[i].PRODCD == 'D047'){
      
      calculate = input_value / fuels[key][0].mileage * oilValue[i].PRICE
      object.fuel = key
      object.money = calculate
      i += 1
      
    } else if(key == 'LPi' && oilValue[i].PRODCD == 'K015'){
      
      calculate = input_value / fuels[key][0].mileage * oilValue[i].PRICE
      object.fuel = key
      object.money = calculate
      i += 1
      
    }    
  
    distance_moneyWhat.push(object)      
  }
  console.log(distance_moneyWhat)
  return ('money:')
}

//00km면 몇 리터 채워야돼? -> return 리터 아반떼 30킬로면 몇리터  (리터=KM/연비)
function distance_literWhat(carName, input_value){    
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
  let oilValue = getOilApi()  
  
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
      object.fuel = key
      object.liter = calculate
      i += 1
      
    } else if(key == 'diesel' && oilValue[i].PRODCD == 'D047'){
      
      calculate = input_value / fuels[key][0].mileage
      object.fuel = key
      object.liter = calculate
      i += 1
      
    } else if(key == 'LPi' && oilValue[i].PRODCD == 'K015'){
      
      calculate = input_value / fuels[key][0].mileage
      object.fuel = key
      object.liter = calculate
      i += 1      
    }    
  
    distance_literWhat.push(object)    
  }
  console.log(distance_literWhat)
  return ('liter:')
}

//장소에 대한 위도, 경도 반환
function getLatLon(place){
  var lon;
  var lat;
  
  const http = require('http')
  let options = {
    format: 'json',
    headers: {
      //'accept': 'application/json',
      'appKey': '1edaa571-09d8-4b11-b060-7170568f2ec4'
    },
    query: {
      'searchKeyword': place,//검색 키워드
      'searchType': 'all',
      'searchtypCd': 'A',
      'radius': 0,//검색반경
      'multiPoint': 'N',
      'count': 1//페이지당 출력되는 개수를 지정
    }
  };
  let response = http.getUrl('https://api2.sktelecom.com/tmap/pois?version=1&format=json&callback=result', options);
  
  lat = response.searchPoiInfo.pois.poi[0].noorLat;
  lon = response.searchPoiInfo.pois.poi[0].noorLon;
  
  console.log(response.searchPoiInfo.pois.poi[0]);
  return [lat, lon];
}

//출발지와 도착지 사이의 거리 반환
function getDistance(start_place, end_place){
  var place_start = String(start_place);
  var place_end = String(end_place);

  var latlon_s;
  var latlon_e;

  //좌표 구하기
  latlon_s = getLatLon(place_start)
  latlon_e = getLatLon(place_end)
  
  var headers = {};
  headers["appKey"] = "1edaa571-09d8-4b11-b060-7170568f2ec4";//실행을 위한 키 입니다. 발급받으신 AppKey(서버키)를 입력하세요.
  const http = require('http');
  let options = {
    format: 'json',
    query: {
      //passAsJson : true,
      startX: latlon_s[1],
      startY: latlon_s[0],
      //목적지 위경도 좌표입니다.
      endX: latlon_e[1],
      endY: latlon_e[0],
      //출발지, 경유지, 목적지 좌표계 유형을 지정합니다.
      reqCoordType: "WGS84GEO",
      resCoordType: "EPSG3857",
      //각도입니다.
      angle: "172",
      //경로 탐색 옵션 입니다.
      searchOption: 0,
      //교통정보 포함 옵션입니다.
      trafficInfo: "N"
    }
  };
  let response2 = http.postUrl('https://api2.sktelecom.com/tmap/routes?version=1&format=json', headers, options);
  let distance = response2.features[0].properties.totalDistance;
  return distance;
}


module.exports.function = function measureMileage (carName, fuel, input_value, input_unit, question, start_place, end_place, end_place_unit) {
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
      
    case 'place':
      var distance_value
      console.log(start_place);
      console.log(end_place);
      distance_value = getDistance(start_place, end_place);
      distance_value = Math.floor(distance_value / 1000);
      //기름값이 얼마인지      
      if(question == 'money_what'){
        result = distance_moneyWhat(carName, distance_value)
      }
      //몇 리터 채워야 하는지
      else if(question == 'liter_what'){
        result = distance_literWhat(carName, distance_value)
      }      
      break;
      
    default:
      
      console.log('Sorry')
  }
    
  return result
}