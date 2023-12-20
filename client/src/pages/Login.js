import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Login.css'
import { useDispatch } from 'react-redux'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_BASE_URL } from '../config'



const Login = () => {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch()
    const navigate = useNavigate()


    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        await axios.post(`${API_BASE_URL}/API/auth/login`, { username, password })
            .then((result) => {

                if (result.status === 200) {
                    localStorage.setItem("token", result.data.result.token);
                    localStorage.setItem('user', JSON.stringify(result.data.result.user));
                    dispatch({ type: 'LOGIN_SUCCESS', payload: result.data.result.user });
                    toast.success("Login successfull")
                    navigate('/');
                    setLoading(false)
                }

            })
            .catch((error) => {
                setLoading(false)
                toast.error(error.response.data.error)
            })

    }



    return (
        <>

            <div className='bg-container d-flex justify-content-center align-items-center border p-5 '>
                <div className="card shadow" >
                    <div className="row g-0">
                        <div className="col-md-6">
                            <img src="https://images.unsplash.com/photo-1611605698335-8b1569810432?auto=format&fit=crop&q=60&w=500&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dHdpdHRlcnxlbnwwfHwwfHx8MA%3D%3D" className="img-fluid rounded-start image" alt="..." />
                        </div>
                        <div className="col-md-6 p-5">

                            {loading ? <div className='col-md-12 mt-3 text-center'>
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div> : ''}
                            <h1>Login</h1>
                            <form onSubmit={(e) => handleSubmit(e)}>
                                <div className="mb-3">

                                    <input type="text" className="form-control" placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} />

                                </div>

                                <div className="mb-3">

                                    <input type="password" className="form-control" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                                </div>

                                <button type="submit" className="btn btn-primary">Submit</button>

                                <p>Don't have an account? <span><Link to="/register">Register here</Link></span></p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <ToastContainer
                position='top-right'
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme='light'
            />
        </>
    )
}

export default Login