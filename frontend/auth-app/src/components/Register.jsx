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
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow" style={{ minWidth: '400px' }}>
                <h2 className="text-center mb-4">Register</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input
                            type="text"
                            name="username"
                            className="form-control"
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
                            className="form-control"
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
                            className="form-control"
                            placeholder="Password"
                            value={registerForm.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <select
                            name="role"
                            className="form-select"
                            value={registerForm.role}
                            onChange={handleChange}
                            required
                        >
                            <option value="" disabled>Select Role</option>
                            <option value="Nurse">Nurse</option>
                            <option value="Patient">Patient</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-success w-100 mb-2">
                        Register
                    </button>
                    <div className="text-center">
                        <a href="/login">Already have an account? Login</a>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register