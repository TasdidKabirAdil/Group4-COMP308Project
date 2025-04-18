import { gql, useMutation } from '@apollo/client'
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';

const LOGIN = gql`
    mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
            user {
                id
                username
                email
                role
            }
        }
    }
`

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [login] = useMutation(LOGIN)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const { data } = await login({ variables: { email, password } })
        .catch((error) => {
          alert('Invalid Credentials');
          console.error("GraphQL Error:", error);
        });
      if (data?.login?.token) {
        localStorage.setItem('token', data.login.token)
        localStorage.setItem('id', data.login.user.id)
        localStorage.setItem('username', data.login.user.username)
        localStorage.setItem('role', data.login.user.role)
        alert('Login Successful')
        setEmail('')
        setPassword('')
        if (data.login.user.role === 'Patient') {
          navigate('/patient');
        } else if (data.login.user.role === 'Nurse') {
          navigate('/nurse')
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      console.error("Unexpected Error:", error);
    }
  }

  return (
    <>
    <h1 style={{paddingTop: '5%', marginBottom: '-10%', color: 'white', fontWeight: 'bold'}}>Welcome To Health Monitor App</h1>
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="d-flex flex-row shadow rounded overflow-hidden" style={{ maxWidth: '800px', width: '100%' }}>

          {/* Left Section */}
          <div className="text-white p-4 d-flex flex-column justify-content-center" style={{ width: '50%', backgroundColor: 'linear-gradient(to left, #00c6ff,rgb(71, 0, 184)' }}>
            <h2 className="fw-bold">Welcome Back!</h2>
            <p className="mb-0">Login to your account to continue.</p>
          </div>

          {/* Right Section - Login Form */}
          <div className="bg-white p-5" style={{ width: '50%' }}>
            <h3 className="text-center mb-4" style={{ fontWeight: 'bold', fontSize: '2rem', fontFamily: 'Prompt, sans-serif' }}>Log In</h3>
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <input
                  type="email"
                  className="form-control rounded-pill px-4"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="password"
                  className="form-control rounded-pill px-4"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100 rounded-pill">
                Login
              </button>
            </form>
            <div className="text-center mt-3">
              <a href="/register" className="text-decoration-none">
                Don’t have an account? <strong>Register</strong>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login