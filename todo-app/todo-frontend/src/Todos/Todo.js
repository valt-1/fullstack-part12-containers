import React from 'react'

const doneInfo = (onClickDelete) => {
  return (
    <>
      <span>This todo is done</span>
      <span>
        <button onClick={onClickDelete}> Delete </button>
      </span>
    </>
  )
}

const notDoneInfo = (onClickDelete, onClickComplete) => {
  return (
    <>
      <span>
        This todo is not done
      </span>
      <span>
        <button onClick={onClickDelete}> Delete </button>
        <button onClick={onClickComplete}> Set as done </button>
      </span>
    </>
  )
}

const Todo = ({ todo, onClickDelete, onClickComplete }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '70%', margin: 'auto' }}>
      <span>
        {todo.text} 
      </span>
      {todo.done ? doneInfo(onClickDelete) : notDoneInfo(onClickDelete, onClickComplete)}
    </div>
  )
}

export default Todo
