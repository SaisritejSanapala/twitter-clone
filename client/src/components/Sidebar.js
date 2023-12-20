import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faHome, faUser, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import '../pages/Home.css'
import axios from 'axios';
import { API_BASE_URL } from '../config';
const Sidebar = () => {

const user = JSON.parse(localStorage.getItem("user"))
    const dispatch = useDispatch()
    const navigate = useNavigate()
  const [userDetails, setUserDetails] = useState("")

    const[show, setShow] = useState(false)
    const handleClose = () => setShow(false)

    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        dispatch({ type: "LOGIN_ERROR" });
        navigate("/login");
    }

    const getUserDetails = async () => {
        await axios.get(`${API_BASE_URL}/API/user/${user._id}`)
          .then((result) => {
            setUserDetails(result.data.user)
    
       
          })
          .catch((error) => { console.log(error) })
      }

  

useEffect(() => {
    getUserDetails()
})

    return (
        <div className='col-md-3 p-3 '>

            <nav className="nav d-flex  flex-column justify-content-between sidebar ">
                <div className='d-flex flex-column'>
                    <NavLink className="navbar-brand text-primary" to={'/'} >
                        <FontAwesomeIcon icon={faComments} style={{ fontSize: 30 + "px" }} />
                    </NavLink>
                    <NavLink className=" btn nav-btn text-black mt-3" to={'/'} > <FontAwesomeIcon icon={faHome} style={{ fontSize: 20 + "px" }} className='me-2' /> Home</NavLink>
                    <NavLink className=" btn nav-btn text-black" to={`/myprofile`} ><FontAwesomeIcon icon={faUser} style={{ fontSize: 20 + "px" }} className='me-2' /> Profile</NavLink>
                    <a className=" btn nav-btn text-black" onClick={() => setShow(true)}><FontAwesomeIcon icon={faArrowRightFromBracket} style={{ fontSize: 20 + "px" }} className='me-2' />Logout</a>

                </div>

                <div className='d-flex'>
                    <img src={userDetails.profilePicture} className='profile-pic me-2 mt-2' />
                    <div className=''>
                        <h5>{userDetails.name}</h5>
                        <p>@{userDetails.username}</p>

                    </div>
                </div>
            </nav>




            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Logout</Modal.Title>
                </Modal.Header>
                <Modal.Body>
             <p>Are you sure you want to logout?</p>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => handleLogout()}>
                        Logout
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    )
}

export default Sidebar

