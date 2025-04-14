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
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow" style={{ minWidth: '350px' }}>
                <h1 className="text-center mb-4">Login</h1>
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                        Login
                    </button>
                </form>
                <div className="text-center mt-3">
                    <a href="/register">Don't have an account? Register</a>
                </div>
            </div>
        </div>
    );
}

export default Login