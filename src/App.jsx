import React, { useEffect, useState } from "react";
import "./App.css";
import Square from "./components/Square";
import Patterns from "./components/Patterns";
export default function App() {
  const [board, setBoard] = useState(["", "", "", "", "", "", "", "", ""]);
  const [player, setPlayer] = useState("X");
  const [result, setResult]= useState({winner:"none", state:"none"})
   useEffect(()=>{
    checkWin();
    checkDraw();
    player == "X" ? setPlayer("O") : setPlayer("X");
   },[board])
   
   useEffect(()=>{
    if(result.state != "none"){
    alert(`${result.winner} has won the game`);
    setBoard(["", "", "", "", "", "", "", "", ""]);
    }
   }, [result])

  const chooseSquare = (square) => {
    setBoard(
      board.map((val, idx) => {
        if (idx === square && val == "") {
          return player;
        }
        return val;
      })
    );
    
  };
  const checkWin =()=>{
    Patterns.forEach((currPattern)=>{
        const firstPlayer = board[currPattern[0]];
        if(firstPlayer == "") return;
        let found = true;
        currPattern.forEach((currSquare)=>{
            if(board[currSquare] != firstPlayer){
            found = false;
            }
        })
        if(found){
            setResult({winner:player, state:"won"})
            
        }
    })
  }

  const checkDraw =()=>{
    let filled = true;
    board.forEach((val)=>{
        if(val == ""){
            filled = false;
        }
    })
    if(filled){
        setResult({winner:"No one", state:"Draw"})
    }

  }

  return (
    <div className="App">
      <div className="board">
        <div className="row">
          <Square
            val={board[0]}
            chooseSquare={() => {
              chooseSquare(0);
            }}
          />
          <Square val={board[1]}
            chooseSquare={() => {
              chooseSquare(1);
            }} />
          <Square val={board[2]}
            chooseSquare={() => {
              chooseSquare(2);
            }}/>
        </div>
        <div className="row">
            <Square val={board[3]}
                chooseSquare={() => {
                chooseSquare(3);
                }}/>
            <Square val={board[4]}
                chooseSquare={() => {
                chooseSquare(4);
                }}/>
            <Square val={board[5]}
                chooseSquare={() => {
                chooseSquare(5);
                }}/>
        </div>
        <div className="row">
            <Square val={board[6]}
                chooseSquare={() => {
                chooseSquare(6);
                }}/>
            <Square val={board[7]}
                chooseSquare={() => {
                chooseSquare(7);
                }}/>
            <Square val={board[8]}
                chooseSquare={() => {
                chooseSquare(8);
                }}/>
        </div>
      </div>
    </div>
  );
}
