import { gql, useMutation } from '@apollo/client'
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';

const REGISTER = gql`
    mutation Register($username: String!, $email: String!, $password: String!, $role: String!) {
        register(username: $username, email: $email, password: $password, role: $role) {
            id
            username
            email
            role
            createdAt
        }
    }
`

function Register() {
  const [registerForm, setRegisterForm] = useState({ username: '', email: '', password: '', role: '' })
  const [register] = useMutation(REGISTER)
  const navigate = useNavigate()

  const handleChange = async (e) => {
    e.preventDefault()
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await register({ variables: registerForm })
      if (data) {
        alert('Registration Successful')
        setRegisterForm({ username: '', email: '', password: '', role: '' })
        navigate('/login')
      }
    } catch (error) {
      console.error("GraphQL Error:", error)
    }
  }

  return (
    <>
      <h1 style={{ paddingTop: '5%', marginBottom: '-10%', color: 'white', fontWeight: 'bold' }}>Welcome To Health Monitor App</h1>
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="d-flex flex-row-reverse shadow rounded overflow-hidden" style={{ maxWidth: '850px', width: '100%' }}>

          {/* Right Section (Info Panel - now on right) */}
          <div className="text-white p-4 d-flex flex-column justify-content-center" style={{ width: '50%', backgroundColor: 'linear-gradient(to left, #00c6ff,rgb(71, 0, 184)' }}>
            <h2 className="fw-bold">Let’s Register Account!</h2>
            <p>Enter your information to create an account.</p>
            <p className="mt-3">Already have an account?</p>
            <a href="/login" className="text-white fw-bold text-decoration-underline">
              Log In
            </a>
          </div>

          {/* Left Section - Register Form */}
          <div className="bg-white p-5" style={{ width: '50%' }}>
            <h3 className="text-center mb-4" style={{ fontWeight: 'bold', fontSize: '2rem', fontFamily: 'Prompt, sans-serif' }}>Sign Up</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  type="text"
                  name="username"
                  className="form-control rounded-pill px-4"
                  placeholder="Username"
                  value={registerForm.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="email"
                  name="email"
                  className="form-control rounded-pill px-4"
                  placeholder="Email"
                  value={registerForm.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  name="password"
                  className="form-control rounded-pill px-4"
                  placeholder="Password"
                  value={registerForm.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <select
                  name="role"
                  className="form-select rounded-pill px-4"
                  value={registerForm.role}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Select Role</option>
                  <option value="Nurse">Nurse</option>
                  <option value="Patient">Patient</option>
                </select>
              </div>
              <button type="submit" className="btn btn-success w-100 rounded-pill">
                Register
              </button>
            </form>
          </div>
        </div>
      </div>
    </>

  );

}

export default Register