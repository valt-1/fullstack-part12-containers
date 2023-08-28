import React from 'react'

const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        username
        <input
          type='text'
          value={username}
          id='username'
          onChange={handleUsernameChange}
        />
      </div>
      <div>
        password
        <input
          type='password'
          value={password}
          id='password'
          onChange={handlePasswordChange}
        />
      </div>
      <button type='submit' id='loginButton'>login</button>
    </form>
  )
}

export default LoginForm
