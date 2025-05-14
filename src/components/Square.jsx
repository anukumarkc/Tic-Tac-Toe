import React from 'react'
import '../App.css'
export default function Square({val,chooseSquare}) {
  return (
    <div className='square' onClick={chooseSquare}>
      {val}
    </div>
  )
}
