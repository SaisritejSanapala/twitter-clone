import React, { useState } from 'react'
import './Login.css'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_BASE_URL } from '../config'



const Register = () => {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)

        await axios.post(`${API_BASE_URL}/API/auth/register`, { name, email, username, password })
            .then((result) => {
      
                toast.success(result.data.result)
                setLoading(false)
         
                navigate('/login')
            })
            .catch((error) => {
                setLoading(false)
                toast.error(error.response.data.error)
                console.log(error)

            })
    }


    return (

        <>

            <div className='bg-container d-flex justify-content-center align-items-center border p-5 '>
                <div className="card shadow" >
                    <div className="row g-0">
                        <div className="col-md-6 ">
                            <img src="https://images.unsplash.com/photo-1611605698335-8b1569810432?auto=format&fit=crop&q=60&w=500&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dHdpdHRlcnxlbnwwfHwwfHx8MA%3D%3D"
                                className="img-fluid rounded-start image" alt="..." />
                        </div>
                        <div className="col-md-6 p-5">
                            {loading ? <div className='col-md-12 mt-3 text-center'>
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div> : ''}
                            <h1 className='mb-3'>Register</h1>
                            <form onSubmit={(e) => handleSubmit(e)}>
                                <div className="mb-3">

                                    <input type="text" className="form-control" placeholder='Full Name' value={name} onChange={(e) => setName(e.target.value)} />

                                </div>
                                <div className="mb-3">

                                    <input type="email" className="form-control" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />

                                </div>
                                <div className="mb-3">

                                    <input type="text" className="form-control" placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} />

                                </div>
                                <div className="mb-3">

                                    <input type="password" className="form-control" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                                </div>

                                <button type="submit" className="btn btn-primary ">Submit</button>

                                <p className='mt-3'>Already have an account? <span><Link to="/login">Login</Link></span></p>
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

export default Register