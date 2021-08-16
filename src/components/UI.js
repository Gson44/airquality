import React, {useState, useEffect}from 'react'
import * as Bluetooth from 'react-bluetooth';
import './UI.css'
import { Chart } from "react-google-charts";
const UI = () => {
    
    const [mqSensor, setMqSensor] = useState("")
    var percentage;
    percentage = (mqSensor*100)/3000
    const options = {
        width: 800,
        height: 300,
        redFrom: 60,
        redTo: 100,
        yellowFrom: 12,
        yellowTo: 60,
        greenFrom:0,
        greenTo:12,
        minorTicks: 10,
        
      };
    
    async function syncBluetooth() {
        await Bluetooth.requestDeviceAsync({
        acceptAllDevices: true,
        optionalServices: ['e34afbf5-9bae-4b72-a515-4018fa518926'] // Required to access service later.
        }).then(device => device.device.gatt.connect())
        .then(service => {
            return service.getPrimaryService('e34afbf5-9bae-4b72-a515-4018fa518926')
        })
        .then(service => {
            return service.getCharacteristic('beb5483e-36e1-4688-b7f5-ea07361b26a8')
        })
        .then(characteristic => characteristic.startNotifications())
        .then(characteristic => {
        characteristic.addEventListener('characteristicvaluechanged',
                                        handleCharacteristicValueChanged);
        console.log('Notifications have been started.');
        })
        .catch(error => { console.error(error); });

        function handleCharacteristicValueChanged(event) {
        const value = event.target.value;
        console.log(`MQ value is ${value.getUint8(0)}`);
        setMqSensor(value.getUint8(0))
        // TODO: Parse Heart Rate Measurement value.
        // See https://github.com/WebBluetoothCG/demos/blob/gh-pages/heart-rate-sensor/heartRateSensor.js
        }      
    }
        
    return(
        <div className="UIcontainer">
            <h1 className="Title">Air Quality</h1>
            {/* <div className="dashboard">
                <h1 className="dashboardTitle">MQ Sensor</h1>
                <img src="data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PGxpbmVhckdyYWRpZW50IGlkPSJhIiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDEgMCAwIC0xIDAgLTE2NDAyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHgxPSIwIiB4Mj0iNTEyIiB5MT0iLTE2NjU4IiB5Mj0iLTE2NjU4Ij48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiMzMWQ4ZmYiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmZjgwZmYiLz48L2xpbmVhckdyYWRpZW50PjxwYXRoIGQ9Im01MTIgMjU2YzAgMTQxLjM4NjcxOS0xMTQuNjEzMjgxIDI1Ni0yNTYgMjU2cy0yNTYtMTE0LjYxMzI4MS0yNTYtMjU2IDExNC42MTMyODEtMjU2IDI1Ni0yNTYgMjU2IDExNC42MTMyODEgMjU2IDI1NnptMCAwIiBmaWxsPSJ1cmwoI2EpIi8+PGcgZmlsbD0iI2ZmZiI+PHBhdGggZD0ibTE3MC45OTYwOTQgMjI4LjY1MjM0NGMtNDguMDUwNzgyIDAtNzIuODY3MTg4LTIxLjI4NTE1Ni05NC43NjE3MTktNDAuMDY2NDA2LTYuMjg5MDYzLTUuMzk0NTMyLTcuMDExNzE5LTE0Ljg2MzI4Mi0xLjYyMTA5NC0yMS4xNTIzNDQgNS4zOTQ1MzEtNi4yODkwNjMgMTQuODYzMjgxLTcuMDExNzE5IDIxLjE1MjM0NC0xLjYxNzE4OCAyMC41NDI5NjkgMTcuNjIxMDk0IDM4LjI4NTE1NiAzMi44MzU5MzggNzUuMjMwNDY5IDMyLjgzNTkzOCAzNi45NDkyMTggMCA1NC42OTE0MDYtMTUuMjE0ODQ0IDc1LjIzNDM3NS0zMi44MzU5MzggMjEuODk4NDM3LTE4Ljc4MTI1IDQ2LjcxNDg0My00MC4wNzAzMTIgOTQuNzY5NTMxLTQwLjA3MDMxMiA0OC4wNTA3ODEgMCA3Mi44NzEwOTQgMjEuMjg5MDYyIDk0Ljc2NTYyNSA0MC4wNzAzMTIgNi4yODkwNjMgNS4zOTQ1MzIgNy4wMTE3MTkgMTQuODYzMjgyIDEuNjIxMDk0IDIxLjE0ODQzOC01LjM5NDUzMSA2LjI5Mjk2OC0xNC44NjMyODEgNy4wMTU2MjUtMjEuMTUyMzQ0IDEuNjIxMDk0LTIwLjU0Mjk2OS0xNy42MjEwOTQtMzguMjg1MTU2LTMyLjgzOTg0NC03NS4yMzQzNzUtMzIuODM5ODQ0cy01NC42OTE0MDYgMTUuMjE4NzUtNzUuMjM0Mzc1IDMyLjgzOTg0NGMtMjEuODk4NDM3IDE4Ljc4MTI1LTQ2LjcxNDg0NCA0MC4wNjY0MDYtOTQuNzY5NTMxIDQwLjA2NjQwNnptMCAwIi8+PHBhdGggZD0ibTE3MC45OTYwOTQgMzA3LjQ1MzEyNWMtNDguMDUwNzgyIDAtNzIuODY3MTg4LTIxLjI4NTE1Ni05NC43NjE3MTktNDAuMDY2NDA2LTYuMjg5MDYzLTUuMzk0NTMxLTcuMDExNzE5LTE0Ljg2MzI4MS0xLjYxNzE4Ny0yMS4xNTIzNDQgNS4zOTQ1MzEtNi4yODkwNjMgMTQuODYzMjgxLTcuMDExNzE5IDIxLjE0ODQzNy0xLjYxNzE4NyAyMC41NDI5NjkgMTcuNjIxMDkzIDM4LjI4NTE1NiAzMi44MzU5MzcgNzUuMjMwNDY5IDMyLjgzNTkzNyAzNi45NDkyMTggMCA1NC42OTE0MDYtMTUuMjE4NzUgNzUuMjM0Mzc1LTMyLjgzOTg0NCAyMS44OTg0MzctMTguNzc3MzQzIDQ2LjcxNDg0My00MC4wNjY0MDYgOTQuNzY5NTMxLTQwLjA2NjQwNiA0OC4wNTA3ODEgMCA3Mi44NjcxODggMjEuMjg1MTU2IDk0Ljc2MTcxOSA0MC4wNjY0MDYgNi4yODkwNjIgNS4zOTQ1MzEgNy4wMTU2MjUgMTQuODYzMjgxIDEuNjIxMDkzIDIxLjE1MjM0NC01LjM5NDUzMSA2LjI4NTE1Ni0xNC44NTkzNzQgNy4wMTU2MjUtMjEuMTQ4NDM3IDEuNjIxMDk0LTIwLjU0Njg3NS0xNy42MjEwOTQtMzguMjg5MDYzLTMyLjgzOTg0NC03NS4yMzQzNzUtMzIuODM5ODQ0LTM2Ljk0OTIxOSAwLTU0LjY5MTQwNiAxNS4yMTg3NS03NS4yMzQzNzUgMzIuODM5ODQ0LTIxLjg5ODQzNyAxOC43ODEyNS00Ni43MTQ4NDQgNDAuMDY2NDA2LTk0Ljc2OTUzMSA0MC4wNjY0MDZ6bTAgMCIvPjxwYXRoIGQ9Im0xNzAuOTk2MDk0IDM4Ni4yNTM5MDZjLTQ4LjA1MDc4MiAwLTcyLjg2NzE4OC0yMS4yODUxNTYtOTQuNzYxNzE5LTQwLjA3MDMxMi02LjI4OTA2My01LjM5NDUzMi03LjAxMTcxOS0xNC44NjMyODItMS42MjEwOTQtMjEuMTQ4NDM4IDUuMzk4NDM4LTYuMjg5MDYyIDE0Ljg2NzE4OC03LjAxNTYyNSAyMS4xNTIzNDQtMS42MjEwOTQgMjAuNTQyOTY5IDE3LjYyMTA5NCAzOC4yODUxNTYgMzIuODM5ODQ0IDc1LjIzMDQ2OSAzMi44Mzk4NDQgMzYuOTQ5MjE4IDAgNTQuNjkxNDA2LTE1LjIxODc1IDc1LjIzNDM3NS0zMi44Mzk4NDQgMjEuODk4NDM3LTE4Ljc3NzM0MyA0Ni43MTQ4NDMtNDAuMDY2NDA2IDk0Ljc2OTUzMS00MC4wNjY0MDYgNDguMDUwNzgxIDAgNzIuODY3MTg4IDIxLjI4NTE1NiA5NC43NjU2MjUgNDAuMDY2NDA2IDYuMjg5MDYzIDUuMzk0NTMyIDcuMDExNzE5IDE0Ljg2MzI4MiAxLjYyMTA5NCAyMS4xNTIzNDQtNS4zOTQ1MzEgNi4yODUxNTYtMTQuODYzMjgxIDcuMDExNzE5LTIxLjE1MjM0NCAxLjYxNzE4OC0yMC41NDI5NjktMTcuNjE3MTg4LTM4LjI4OTA2My0zMi44MzU5MzgtNzUuMjM0Mzc1LTMyLjgzNTkzOC0zNi45NDkyMTkgMC01NC42OTE0MDYgMTUuMjE4NzUtNzUuMjM0Mzc1IDMyLjgzOTg0NC0yMS44OTg0MzcgMTguNzgxMjUtNDYuNzE0ODQ0IDQwLjA2NjQwNi05NC43Njk1MzEgNDAuMDY2NDA2em0wIDAiLz48L2c+PC9zdmc+" sizes="10px"/>
                <h2 className="airValue">{mqSensor} PPM</h2>  
                 
            </div> */}
          <div  className="chart">
          <Chart
          chartType="Gauge"
          data={[["Label","Value"],["Air Quality", percentage]]}
         
          options={options}
         
        />
          </div>
            
         <button onClick={syncBluetooth} className="btButton">Get Bluetooth</button>
         
        
        </div>    
    )
}

export default UI