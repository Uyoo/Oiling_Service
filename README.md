# Oiling_Service
<img src="https://d2vmsfj099sbr1.cloudfront.net/newsroom_challenge_silver_team%20image_re.jpg" alt="Prunus" title="A Wild Cherry (Prunus avium) in flower"></br>
[차종별 맞춤 주유 정보 '오일링서비스'의 발표 및 인터뷰 영상 보러가기](https://www.youtube.com/watch?v=o08yZfeC5KI)</br>

[]: optional

<ul>
       <li>발화1) </br>
              - input<br>
              : 자동차(모델), [연료(가솔린, 디젤, LPG)], 돈(00원), 몇 리터 채울 수 있는지 </br>
              : 자동차(모델), [연료(가솔린, 디젤, LPG)], 돈(00원), 몇 KM 갈 수 있는지</br></br>
              - output<br>
              : 00 리터 채울 수 있습니다. -> 연료의 발화가 없다면 휘발유(가솔린), 경유(디젤), LPG 제공 <br>
              : 00 KM 갈 수 있습니다.<br>
       </li>
       </br>
       <li>발화2) </br>
              - input<br>
              : 자동차(모델), [연료(가솔린, 디젤, LPG)], 리터(00리터), 기름값이 얼마인지 </br>
              : 자동차(모델), [연료(가솔린, 디젤, LPG)], 리터(00리터), 몇 KM 갈 수 있는지</br></br>
              - output<br>
              : 약 00원이 나옵니다. -> 부가기능으로 각 주유점(GS, S-Oil) 등에서 제공하는 금액도 서브형태로 제공. <br>
              : 00 KM 갈 수 있습니다.
       </li>
       <br>
       <li>발화3)</br>
              - input<br>
              : 자동차(모델), [연료(가솔린, 디젤, LPG)], [출발지], 도착지, 기름값 얼마인지</br>
              : 자동차(모델), [연료(가솔린, 디젤, LPG)], [출발지], 도착지, 몇 리터 채워야하는지</br>
              ***출발지 언급이 없으면 현재 위치 기반, 있으면 목적지와의 거리 비교***       
              </br></br>
              - output<br>
              : 약 00원이 나옵니다. -> 부가기능으로 각 주유점(GS, S-Oil) 등에서 제공하는 금액도 서브형태로
              : 00 리터 채울 수 있습니다.
       </li>
       </br></br>
       <li>발화4) </br>
              - input<br>
              : 자동차(모델), [연료(가솔린, 디젤, LPG)], 목적지까지의 거리(00KM), 기름값 얼마인지</br>
              : 자동차(모델), [연료(가솔린, 디젤, LPG)], 목적지까지의 거리(00KM), 몇 리터 채워야하는지</br></br>
              - output<br>
              : 약 00원이 나옵니다. -> 부가기능으로 각 주유점(GS, S-Oil) 등에서 제공하는 금액도 서브형태로
              : 00리터 채울 수 있습니다.
       </li>
       </br></br>
       <li>발화5) </br>
               - input<br>
               : 현재(최근) 기름값은 얼마야?</br></br>
               - output<br>
               : 현재 1달 기준 기름값은 약 00원 입니다. -> 부가기능으로 각 주유점(GS, S-Oil) 등에서 제공하는 금액도 서브형태로
       </li>
</ul>
