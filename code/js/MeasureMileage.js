let console = require('console')

//장소에 대한 위도, 경도 반환
function getLatLon(place){
  let lon;
  let lat;
  
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
  
  lat = response.searchPoiInfo.pois.poi[0].noorLat
  lon = response.searchPoiInfo.pois.poi[0].noorLon
  
  console.log(response.searchPoiInfo.pois.poi[0])
  
  return [lat, lon];
}

//출발지와 도착지 사이의 거리 반환
function getDistance(latlon_s, latlon_e){  
  var headers = {}
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
  let response = http.postUrl('https://api2.sktelecom.com/tmap/routes?version=1&format=json', headers, options);
  let distance = response.features[0].properties.totalDistance;
  
  return distance;
}

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

function getDatas(carDatas, name){
  for(let i=0; i<carDatas.length; i++){
    if(carDatas[i].carName == name){
      return [carDatas[i].represent, carDatas[i].modelYear, name]
    }
  }
}

function makeResult(carName, input_value, f, choice){
  //최근 1주의 주간 평균 유가(전국)
  //기름 api에서 기름값 받아오기(가솔린, 디젤, 부탄(Lpi))
  let oilValue = getOilApi()
  
  //cars.js에서 연비(mileage) 받아오기(가솔린, 디젤, 부탄(Lpi))
  const carDatas = require('../data/cars.js')    
  let data_rep //대표 모델 정보
  let data_subModels //서브 모델 정보
  let car //차 이름
  let calculate //계산 값
  
  let copys = JSON.parse(JSON.stringify(carDatas))
  let datas = getDatas(copys, String(carName))
  //모델과 해당되는 객체만 가져오기
  data_rep = datas[0]
  data_subModels = datas[1]
  car = datas[2]
  
  //주행거리 = 주유비 x 연비 ÷ 기름값            
  if(data_rep.fuel == 'gasoline'){     
    calculate = distinChoice(f(input_value, data_rep.mileage, oilValue[0].PRICE), choice)
  } else if(data_rep.fuel == 'diesel'){
    calculate = distinChoice(f(input_value, data_rep.mileage, oilValue[1].PRICE), choice)
  } else if(data_rep.fuel == 'LPi'){      
    calculate = distinChoice(f(input_value, data_rep.mileage, oilValue[2].PRICE), choice)
  }
  
  function distinChoice(calculate, choice) {
    if(choice == "distance"){
      return Math.floor(Math.round(calculate))      
    }else if(choice == "money"){
      return Math.floor(Math.round(calculate/10)*10)
    }
    else{    
      return Math.round(calculate*10)/10
    }
  }
  function getunit(choice){
    if(choice == "distance"){
      return "km"        
    }else if(choice == "money"){
      return "원"  
    }
    else{    
      return "ℓ"  
    }
  } 
  function getKoreanfuel(fuelname){
    if(fuelname == "gasoline"){
      return "가솔린"        
    }else if(fuelname == "diesel"){
      return "디젤"  
    }
    else{    
      return "LPi"  
    }
  } 

  
  calculate = distinChoice(calculate, choice)
    
  data_rep["res"] = calculate  
  data_rep["carName"] = car
  data_rep["unit"]  = getunit(choice)
  data_rep["fuelKorean"]  = getKoreanfuel(data_rep.fuel)
  delete data_rep["mileage"]   
  
  for(let t=0; t<data_subModels.length; t++){ //각 연식 모델들에 대해 계산
    let model = data_subModels[t]
    for(let key in model.fuel){ //해당 연식의 주종에 대해 계산
      if(key == 'gasoline'){        
        for(let j = 0; j < model.fuel.gasoline.length; j++){ //해당 주종에 각 엔진들에 대해 결과 삽입
          calculate = distinChoice(f(input_value, model.fuel[key][j].mileage, oilValue[0].PRICE), choice)
          data_subModels[t].fuel[key][j]["res"] = calculate 
          delete data_subModels[t].fuel[key][j]["mileage"]
        }
      }else if(key == 'diesel'){        
        for(let j = 0; j < model.fuel.diesel.length; j++){
          calculate = distinChoice(f(input_value, model.fuel[key][j].mileage, oilValue[1].PRICE), choice)
          data_subModels[t].fuel[key][j]["res"] = calculate
          delete data_subModels[t].fuel[key][j]["mileage"]
        }
      }else if(key == 'LPi'){        
        for(let j = 0; j < model.fuel.LPi.length; j++){
          calculate = distinChoice(f(input_value, model.fuel[key][j].mileage, oilValue[2].PRICE), choice)
          data_subModels[t].fuel[key][j]["res"] = calculate
          delete data_subModels[t].fuel[key][j]["mileage"]
        }
      }
    }
  }
  
  console.log(data_rep.res)
  
  return {
    data_rep: data_rep, 
    data_subModels: data_subModels
  }
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//00원으로 몇 km 갈 수 있어? -> return 거리
function won_distanceWhat(carName, input_value){
  const f = (a, b, c) => a * b / c
  let choice = "distance"
  let result
  
  result = makeResult(carName, input_value, f, choice)
  console.log(result)
  return result
}

// ======= inputUnit이 리터(liter)인 경우 =======
//00리터로 몇 km 갈 수 있어? -> return 거리
//연비 x 리터 = KM
function liter_distanceWhat(carName, input_value){    
  const f = (a, b, c) => a * b
  let choice = "distance"
  var result
    
  result = makeResult(carName, input_value, f, choice)
  
  console.log(result)
  return result
}
// ======= inputUnit이 거리(distance)인 경우 =======
//00km면 기름값 얼마야? -> return 기름값
function distance_moneyWhat(carName, input_value){
  const f = (a, b, c) => a / b * c
  let choice = "money"
  var result
   
  result = makeResult(carName, input_value, f, choice)
    
  console.log(result)
  return result
}

//00km면 몇 리터 채워야돼? -> return 리터 아반떼 30킬로면 몇리터  (리터=KM/연비)
function distance_literWhat(carName, input_value){    
  const f = (a, b, c) => a / b
  let choice = "liter"
  var result
   
  result = makeResult(carName, input_value, f, choice)
  
  console.log(result)
  return result
}

module.exports.function = function measureMileage (carName, inputValue, inputUnit, question, 
                                                    startPlace, startPlaceMyPos, endPlace, endPlaceUnit) {
  let console = require('console')  
  let result = ''
  
  let input_unit = String(inputUnit)
  switch (input_unit) {    
    case 'won':
      //몇 km로 갈 수 있는지      
      if(question == 'distance_what'){  
        result = won_distanceWhat(carName, inputValue)
      }

      //몇 리터를 넣을 수 있는지
      else if(question == 'liter_what'){        
        result = won_literWhat(carName, inputValue)
      }
      break;
      
    case 'liter':
      //몇 km로 갈 수 있는지
      if(question == 'distance_what'){
        result = liter_distanceWhat(carName, inputValue)
      }

      //기름값이 얼마인지
      else if(question == 'money_what'){
        result = liter_moneyWhat(carName, inputValue)        
      }
      break;
    case 'distance':
      //기름값이 얼마인지
      if(question == 'money_what'){
        result = distance_moneyWhat(carName, inputValue)
      }

      //몇 리터 채워야 하는지
      else if(question == 'liter_what'){
        result = distance_literWhat(carName, inputValue)
      }
      break;
      
    case 'place':
      let distance_value 
      let latlon_s
      let latlon_e
      
      //목적지 및 목저지유닛이 존재하는 경우
      if(endPlace != undefined && endPlaceUnit != undefined){      
        
        //출발지 키워드가 존재하는 경우
        if(startPlace != undefined){
          console.log('start_place: ', startPlace)
          console.log('end_place: ', endPlace)
          
          //위도 경도 구하기
          latlon_s = getLatLon(startPlace)
          latlon_e = getLatLon(endPlace)
          distance_value = getDistance(latlon_s, latlon_e)
          distance_value = Math.floor(distance_value / 1000)
          console.log(distance_value)
          
          //기름값이 얼마인지      
          if(question == 'money_what'){
            result = distance_moneyWhat(carName, distance_value)
          }
          //몇 리터 채워야 하는지
          else if(question == 'liter_what'){
            result = distance_literWhat(carName, distance_value)
          }      
          
        } 
        
        //출발지 키워드가 존재하지 않은 경우 ex.여기서, x
        else{          
          //위도 경도 구하기
          latlon_s = [startPlaceMyPos.latitude, startPlaceMyPos.longitude] 
          latlon_e = getLatLon(endPlace)          
          distance_value = getDistance(latlon_s, latlon_e)
          distance_value = Math.floor(distance_value / 1000)
          
          console.log(distance_value)
          
          //기름값이 얼마인지      
          if(question == 'money_what'){
            result = distance_moneyWhat(carName, distance_value)
          }
          //몇 리터 채워야 하는지
          else if(question == 'liter_what'){
            result = distance_literWhat(carName, distance_value)
          }      
        } 
      }
      
      else {
        result = '목적지를 입력해주세요'
      }
      
      break;
      
    default:      
      console.log('Sorry')
  }
    
  return result
}