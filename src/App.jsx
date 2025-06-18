// import React, { useEffect, useState } from "react";
// import "./App.css";
// import Square from "./components/Square";
// import Patterns from "./components/Patterns";
// export default function App() {
//   const [board, setBoard] = useState(["", "", "", "", "", "", "", "", ""]);
//   const [player, setPlayer] = useState("X");
//   const [result, setResult]= useState({winner:"none", state:"none"})
//    useEffect(()=>{
//     checkWin();
//     checkDraw();
//     player == "X" ? setPlayer("O") : setPlayer("X");
//    },[board])
   
//    useEffect(()=>{
//     if(result.state != "none"){
//     alert(`${result.winner} has won the game`);
//     setBoard(["", "", "", "", "", "", "", "", ""]);
//     }
//    }, [result])

//   const chooseSquare = (square) => {
//     setBoard(
//       board.map((val, idx) => {
//         if (idx === square && val == "") {
//           return player;
//         }
//         return val;
//       })
//     );
    
//   };
//   const checkWin =()=>{
//     Patterns.forEach((currPattern)=>{
//         const firstPlayer = board[currPattern[0]];
//         if(firstPlayer == "") return;
//         let found = true;
//         currPattern.forEach((currSquare)=>{
//             if(board[currSquare] != firstPlayer){
//             found = false;
//             }
//         })
//         if(found){
//             setResult({winner:player, state:"won"})
            
//         }
//     })
//   }

//   const checkDraw =()=>{
//     let filled = true;
//     board.forEach((val)=>{
//         if(val == ""){
//             filled = false;
//         }
//     })
//     if(filled){
//         setResult({winner:"No one", state:"Draw"})
//     }

//   }

//   return (
//     <div className="App">
//       <div className="board">
//         <div className="row">
//           <Square
//             val={board[0]}
//             chooseSquare={() => {
//               chooseSquare(0);
//             }}
//           />
//           <Square val={board[1]}
//             chooseSquare={() => {
//               chooseSquare(1);
//             }} />
//           <Square val={board[2]}
//             chooseSquare={() => {
//               chooseSquare(2);
//             }}/>
//         </div>
//         <div className="row">
//             <Square val={board[3]}
//                 chooseSquare={() => {
//                 chooseSquare(3);
//                 }}/>
//             <Square val={board[4]}
//                 chooseSquare={() => {
//                 chooseSquare(4);
//                 }}/>
//             <Square val={board[5]}
//                 chooseSquare={() => {
//                 chooseSquare(5);
//                 }}/>
//         </div>
//         <div className="row">
//             <Square val={board[6]}
//                 chooseSquare={() => {
//                 chooseSquare(6);
//                 }}/>
//             <Square val={board[7]}
//                 chooseSquare={() => {
//                 chooseSquare(7);
//                 }}/>
//             <Square val={board[8]}
//                 chooseSquare={() => {
//                 chooseSquare(8);
//                 }}/>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [analog, setAnalog] = useState(Date.now() / 1000); // seconds
  const [digital, setDigital] = useState(Date.now() / 1000); // seconds
  const [analogInc, setAnalogInc] = useState(1); // seconds per tick
  const [digitalInc, setDigitalInc] = useState(1);

  useEffect(() => {
    const analogTimer = setInterval(() => {
      setAnalog(prev => prev + parseFloat(analogInc));
    }, 1000);
    return () => clearInterval(analogTimer);
    
  }, [analogInc]);

  useEffect(() => {
    const digitalTimer = setInterval(() => {
      setDigital(prev => prev + parseFloat(digitalInc));
    }, 1000);
    return () => clearInterval(digitalTimer);
  }, [digitalInc]);

  const handleAnalogSync = () => {
    setAnalog(()=> new Date(digital * 1000).getSeconds() );
    setAnalogInc(digitalInc);
  };
  const handleDigitalSync = ()=>{
    setDigital(()=>  new Date(analog * 1000).getSeconds() );
    setDigitalInc(analogInc);
  }

  // Analog time breakdown
  const analogDate = new Date(analog * 1000);
  const aHours = analogDate.getHours() % 12;
  const aMinutes = analogDate.getMinutes();
  const aSeconds = analogDate.getSeconds();

  const hourDeg = (aHours + aMinutes / 60) * 30;
  const minDeg = (aMinutes + aSeconds / 60) * 6;
  const secDeg = aSeconds * 6;

  const digitalTime = new Date(digital * 1000).toLocaleTimeString();
  const analogTime = analogDate.toLocaleTimeString();

  return (
    <div className="app">
      <h2>Clock with Real-Time & Custom Control</h2>
      <div className="clocks">
        <div className="clock-section">
          <h3>Analog Clock</h3>
          <div className="clock-face">
            <div className="hand hour" style={{ transform: `rotate(${hourDeg}deg)` }}></div>
            <div className="hand minute" style={{ transform: `rotate(${minDeg}deg)` }}></div>
            <div className="hand second" style={{ transform: `rotate(${secDeg}deg)` }}></div>
          </div>
          <p>{analogTime}</p>
          <input
            type="number"
            value={analogInc}
            step="0.1"
            onChange={(e) => setAnalogInc(Number(e.target.value))}
          />
      <button className="sync-btn" onClick={handleAnalogSync}>Sync Analog to Digital</button>
        </div>

        <div className="clock-section">
          <h3>Digital Clock</h3>
          <div className="digital-clock">{digitalTime}</div>
          <p>{Math.floor(digital)}</p>
          <input
            type="number"
            value={digitalInc}
            step="0.1"
            onChange={(e) => setDigitalInc(Number(e.target.value))}
          />
      <button className="sync-btn" onClick={handleDigitalSync}>Sync Analog to Digital</button>
        </div>
      </div>
    </div>
  );
}

export default App;