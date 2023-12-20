import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faImage, faHeart, faComment, faRetweet, faTrash, faBirthdayCake, faLocation, faLocationPin, faLocationPinLock, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Swal from 'sweetalert2';
import Sidebar from '../components/Sidebar';
import './MyProfile.css'
import { API_BASE_URL } from '../config';
import { Link } from 'react-router-dom';

const MyProfile = (props) => {

    const [show, setShow] = useState(false);
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [replyId, setReplyId] = useState("")
    const [name, setName] = useState("")
    const [location, setLocation] = useState("")
    const [dob, setDob] = useState("")

    const [image, setImage] = useState({ preview: '', data: '' })

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleCloseEditProfile = () => setShowEditProfile(false);
    const handleShowEditProfile = () => setShowEditProfile(true);


    const user = JSON.parse(localStorage.getItem('user'))

    const userId = user._id


    const [userDetails, setUserDetails] = useState("")
    const [tweetsAndReplies, setTweetsAndReplies] = useState([])

    const navigate = useNavigate()

    const [content, setContent] = useState()
    const [showForReply, setShowForReply] = useState(false);
    const handleshowForReply = () => setShowForReply(true);
    const handleCloseForReply = () => setShowForReply(false);

    const CONFIG_OBJ = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    }


    const replyTweet = async () => {

        if (content === "") {
            Swal.fire({
                icon: "error",
                title: "Content shouldn't be empty"
            })
        }

        await axios.post(`${API_BASE_URL}/API/tweet/${replyId}/reply`, { content }, CONFIG_OBJ)
            .then((result) => {
                toast.success("replied successfully")
                setContent("")
                handleCloseForReply()
                getUserTweetsAndReplies()

            })
            .catch((error) => {
                toast.error("some error occurred")

            })

    }


    const handleDelete = async (tweetId) => {

        await axios.delete(`${API_BASE_URL}/API/tweet/${tweetId}`, CONFIG_OBJ)
            .then((result) => {
                toast.success(result.data.result)
                getUserTweetsAndReplies()
            })
            .catch((error) => {
                console.log(error)

            })

    }


    const likeTweet = async (tweetId) => {
        await axios.post(`${API_BASE_URL}/Api/tweet/${tweetId}/like`, {}, CONFIG_OBJ)
            .then((result) => {
                toast.success(result.data.success)
                getUserTweetsAndReplies()

            })
            .catch((error) => {
                toast.error(error.response.data.error)
                console.log(error)

            })

    }

    const handleRetweet = async (tweetId) => {
        await axios.post(`${API_BASE_URL}/API/tweet/${tweetId}/retweet`, {}, CONFIG_OBJ)
            .then((result) => {
                toast.success(result.data.success)
                getUserTweetsAndReplies()
            })
            .catch((error) => {
                toast.error(error.response.data.error)

            })

    }


    const getUserDetails = async () => {
        await axios.get(`${API_BASE_URL}/API/user/${userId}`)
            .then((result) => {
                setUserDetails(result.data.user)
            })
            .catch((error) => { console.log(error) })
    }

    const getUserTweetsAndReplies = async () => {
        await axios.post(`${API_BASE_URL}/API/user/${userId}/tweets`)
            .then((result) => {
                setTweetsAndReplies(result.data.tweets)

            })
            .catch((error) => { console.log(error) })
    }


    const handleFileSelect = (event) => {
        const img = {
            preview: URL.createObjectURL(event.target.files[0]),
            data: event.target.files[0]
        }
        setImage(img);
    }

    const handleImgUpload = async () => {
        let formData = new FormData();
        formData.append('file', image.data);

        const response = axios.post(`${API_BASE_URL}/uploadFile`, formData)
        return response;
    }


    const uploadProfilePic = async () => {
        const imgRes = await handleImgUpload();
        const request = { img: `${API_BASE_URL}/files/${imgRes.data.fileName}` }
        axios.post(`${API_BASE_URL}/API/user/${userId}/uploadProfilePic`, request, CONFIG_OBJ)
            .then((result) => {
                setImage({ preview: '', data: '' })
                getUserDetails()
                toast.success("image uploaded successfully")
                handleClose()
            })
            .catch((error) => { console.log(error) })

    }


    const editProfile = async () => {
        if (name === "" || dob === "" || location === "") {
            Swal.fire({
                icon: "error",
                text: "No empty fields should be present"
            })
        }
        else {
            const request = { name, dateOfBirth: dob, location }
            await axios.put(`${API_BASE_URL}/API/user/${userId}/`, request, CONFIG_OBJ)
                .then((result) => {
                    setName("")
                    setLocation("")
                    setDob("")
                    getUserDetails()
                    toast.success("Details uploaded successfully")
                    handleCloseEditProfile()
                })
                .catch((error) => { console.log(error) })
        }
    }

    useEffect(() => {
        getUserDetails();
        getUserTweetsAndReplies();

    }, [])


    return (

        <>
            <div className='container'>
                <div className='row'>

                    <Sidebar />
                    <div className='col-md-7 col-sm-12  p-3 border' style={{ minHeight: 100 + "vh" }}>

                        <h1>Profile</h1>

                        {userDetails !== "" ?

                            <>
                                <div className='d-flex justify-content-between align-items-end mb-3'>
                                    <img className='profile-img' src={userDetails.profilePicture} />
                                    <div>
                                        <button className='btn btn-primary' onClick={() => handleShow()}>Upload profile photo</button>
                                        <button className='btn btn-primary ms-2' onClick={() => handleShowEditProfile()} >Edit</button>


                                    </div>
                                </div>

                                <h4>{userDetails.name}</h4>
                                <h6>{userDetails.username}</h6>

                                <div>
                                    <span className='me-3'><FontAwesomeIcon icon={faBirthdayCake} /> Dob, {userDetails.dateOfBirth ? new Date(userDetails.dateOfBirth).toLocaleDateString() : "(Add your date of birth)"}</span>
                                    <span><FontAwesomeIcon icon={faLocationDot} /> {userDetails.location ? userDetails.location : "(Add your location)"} </span>
                                    <p><FontAwesomeIcon icon={faCalendar} /> Joined {new Date(userDetails.createdAt).toLocaleDateString()}</p>

                                </div>

                                <div className='fw-bold'>
                                    <span className='me-3'>{userDetails.followers.length} followers</span>

                                    <span>{userDetails.following.length} following</span>

                                </div>

                            </>
                            :

                            "User does'nt exist"}

                        <h3 className='text-center'>Tweets and replies</h3>

                        {tweetsAndReplies.map((tweet) => {

                            return (
                                <div className='container border'>
                                    <div className='row'>
                                        {tweet.reTweetedBy.length !== 0 ? <span className='ms-2' style={{ fontSize: 10 + "px" }}><FontAwesomeIcon icon={faRetweet} /> Retweeted by @ {tweet.reTweetedBy[tweet.reTweetedBy.length - 1].username}</span> : ""}
                                        <div className='col-12'>
                                            <div className='d-flex justify-content-between'>

                                                <div className='d-flex p-2'>

                                                    <div className='me-2'>
                                                        <img src={tweet.tweetedBy.profilePicture} className='profile-pic' alt='profile-pic' />
                                                    </div>
                                                    <div className=''>

                                                        <Link to={`/profile/${tweet.tweetedBy._id}`} className='fw-bold link'>@{tweet.tweetedBy.username}</Link>
                                                        <span className='text-secondary' style={{ fontSize: 10 + "px" }}> - {new Date(tweet.createdAt).toLocaleDateString()}</span>

                                                    </div>

                                                </div>

                                                {tweet.tweetedBy._id === user._id ? <div className='mt-2' style={{ cursor: 'pointer' }}>
                                                    <FontAwesomeIcon icon={faTrash} onClick={() => handleDelete(tweet._id)} />
                                                </div> : ""}

                                            </div>

                                        </div>

                                        <div className='col-12 px-5 '>
                                            <div className='ms-2' style={{ cursor: 'pointer' }}>
                                                <Link to={`/tweet/${tweet._id}`} className='tweet'>
                                                    <p style={{overflow: 'auto'}}>{tweet.content}</p>
                                                    {tweet.image ? <img src={tweet.image} className='tweet-img mb-3' alt='tweetimage' /> : ""}
                                                </Link>
                                            </div>

                                            <div className='mb-2 ms-3'>

                                                <span className='me-5'> <FontAwesomeIcon icon={faHeart} onClick={() => likeTweet(tweet._id)} style={{ cursor: 'pointer' }} /> {tweet.likes.length} </span>

                                                <span className='me-5' style={{ cursor: 'pointer' }}>  <FontAwesomeIcon icon={faComment} onClick={() => { handleshowForReply(); setReplyId(tweet._id) }} /> {tweet.replies.length}</span>
                                                <span className='me-5' style={{ cursor: 'pointer' }}>  <FontAwesomeIcon icon={faRetweet} onClick={() => { handleRetweet(tweet._id) }} /> {tweet.reTweetedBy.length}</span>

                                            </div>
                                        </div>
                                    </div>

                                </div>
                            )

                        })
                        }


                    </div>

                </div>


                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Upload Profile Pic</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div class="alert alert-primary" role="alert">
                            Note: The file size should be less than 10 mb
                        </div>
                        <FontAwesomeIcon icon={faImage} className='mb-3' />
                        <input name="file" type="file" id="drop_zone" className="form-control mb-3" accept=".jpg,.png,.gif" onChange={handleFileSelect} />

                        {image.preview && <img src={image.preview} className='w-100' alt='preview' />}

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={uploadProfilePic}>
                            Upload
                        </Button>
                    </Modal.Footer>
                </Modal>


                <Modal show={showEditProfile} onHide={handleCloseEditProfile}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Profile</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='mb-2'>
                            <label for="name">Name</label>
                            <input type='text' id='name' className='form-control' onChange={(e) => setName(e.target.value)} />
                        </div>

                        <div className='mb-2'>
                            <label for="location">Location</label>
                            <input type='text' id='location' className='form-control' onChange={(e) => setLocation(e.target.value)} />
                        </div>

                        <div>
                            <label for="date">Date of birth</label>
                            <input type="date" id='date' className='form-control' onChange={(e) => setDob(e.target.value)} />
                        </div>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseEditProfile}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={editProfile}>
                            Edit
                        </Button>
                    </Modal.Footer>
                </Modal>


                <Modal show={showForReply} onHide={handleCloseForReply}>
                    <Modal.Header closeButton>
                        <Modal.Title>Tweet your reply </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <textarea className='form-control mb-3' value={content} onChange={(e) => setContent(e.target.value)} placeholder='Add your reply'></textarea>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseForReply}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={() => replyTweet()}>
                            Reply
                        </Button>
                    </Modal.Footer>
                </Modal>

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

export default MyProfile