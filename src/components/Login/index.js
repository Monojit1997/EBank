import {Component} from 'react'

import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

class Login extends Component {
  state = {
    username: '',
    password: '',
    showSubmitError: false,
    errorMsg: '',
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({
      password: event.target.value,
    })
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
    })
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const convertUserName = parseInt(username)
    const convertPassword = parseInt(password)
    const userDetails = {convertUserName, convertPassword}
    const url = 'https://apis.ccbp.in/ebank/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    console.log(response)
    const data = await response.json()
    console.log(data)
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {username, password, showSubmitError, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div>
        <div>
          <div>
            <img
              src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
              alt="website login"
            />
          </div>
          <form onSubmit={this.submitForm}>
            <h1>Welcome Back!</h1>
            <label htmlFor="username">USER id</label>
            <input
              type="text"
              placeholder="Enter USER id"
              id="username"
              value={username}
              onChange={this.onChangeUsername}
            />
            <label htmlFor="password">PIN</label>
            <input
              type="password"
              placeholder="Enter PIN"
              id="password"
              value={password}
              onChange={this.onChangePassword}
            />
            <button type="submit">Login</button>
            {showSubmitError && <p>*{errorMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}
export default Login
