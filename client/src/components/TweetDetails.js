import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faComment, faRetweet, faTrash, faHeartBroken } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Swal from 'sweetalert2';
import Sidebar from '../components/Sidebar';

import { API_BASE_URL } from '../config';

const TweetDetails = (props) => {

  const { tweetId } = useParams()

  const user = JSON.parse(localStorage.getItem("user"))


  const [tweet, setTweet] = useState("")
  const [replyId, setReplyId] = useState("")


  const [content, setContent] = useState("")

  const [showForReply, setShowForReply] = useState(false);

  const handleshowForReply = () => setShowForReply(true);
  const handleCloseForReply = () => setShowForReply(false);

  const dispatch = useDispatch()
  const navigate = useNavigate()



  const CONFIG_OBJ = {
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("token")
    }
  }


  const getTweetDetails = async () => {
    await axios.get(`${API_BASE_URL}/API/tweet/${tweetId}`, CONFIG_OBJ)
      .then((tweet) => {
        setTweet(tweet.data.result)

      })
      .catch((error) =>
        console.log(error)
      )
  }




  const handleDelete = async (tweetId) => {

    await axios.delete(`${API_BASE_URL}/API/tweet/${tweetId}`, CONFIG_OBJ)
      .then((result) => {
        toast.success(result.data.result)

        getTweetDetails()

      })
      .catch((error) => {
        console.log(error)

      })

  }




  const likeTweet = async (tweetId) => {
    await axios.post(`${API_BASE_URL}/Api/tweet/${tweetId}/like`, {}, CONFIG_OBJ)
      .then((result) => {
        toast.success(result.data.success)
        getTweetDetails()

      })
      .catch((error) => {
        toast.error(error.response.data.error)

      })


  }

  const dislikeTweet = async (tweetId) => {
    await axios.post(`${API_BASE_URL}/Api/tweet/${tweetId}/dislike`, {}, CONFIG_OBJ)
      .then((result) => {
        toast.success(result.data.success)
        getTweetDetails()

      })
      .catch((error) => {
        toast.error(error.response.data.error)


      })


  }

  const handleRetweet = async (tweetId) => {
    await axios.post(`${API_BASE_URL}/API/tweet/${tweetId}/retweet`, {}, CONFIG_OBJ)
      .then((result) => {
        toast.success(result.data.success)
        getTweetDetails()
      })
      .catch((error) => {
        toast.error(error.response.data.error)

      })


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
        getTweetDetails()

      })
      .catch((error) => {
        toast.error("some error occurred")
        console.log(error)

      })

  }


  useEffect(() => {
    getTweetDetails()

  }, [tweetId])



  return (

    <>
      <div className='container'>
        <div className='row'>

          <Sidebar />

          <div className='col-md-7 col-sm-12  p-3 border' style={{ minHeight: 100 + "vh" }}>
            <h1 className='mb-3'>Tweet</h1>

            {tweet ? (<div className='container border'>
              <div className='row'>

                <div className='col-12'>
                  <div className='d-flex justify-content-between'>
                    <div className='d-flex p-2'>
                      <div className='me-2'>
                        <img src={tweet.tweetedBy.profilePicture} className='profile-pic' alt='profile-pic' />
                      </div>
                      <div >

                        <Link to={`/profile/${tweet.tweetedBy._id} `} className='fw-bold link'>@{tweet.tweetedBy.username}</Link>
                        <span className='text-secondary' style={{ fontSize: 10 + "px" }}> -  {new Date(tweet.createdAt).toLocaleDateString()}</span>
                      </div>

                    </div>

                    {tweet.tweetedBy._id === user._id ? <div className='mt-2' style={{ cursor: 'pointer' }}>
                      <FontAwesomeIcon icon={faTrash} onClick={() => handleDelete(tweet._id)} />
                    </div> : ""}

                  </div>

                </div>

                <div className='col-12 px-5 '>
                  <div className='ms-2' >
                    <p style={{ overflow: 'auto' }}>{tweet.content}</p>
                    {tweet.image ? <img src={tweet.image} className='tweet-img mb-3' alt='tweetimage' /> : ""}

                  </div>

                  <div className='mb-2 ms-3'>

                    {tweet.likes.includes(user._id) ? <span className='me-5 text-danger'> <FontAwesomeIcon icon={faHeart} onClick={() => likeTweet(tweet._id)} style={{ cursor: 'pointer', color: 'red' }} /> {tweet.likes.length} </span> : <span className='me-5'> <FontAwesomeIcon icon={faHeart} onClick={() => likeTweet(tweet._id)} style={{ cursor: 'pointer' }} /> {tweet.likes.length} </span>}
                    <span className="me-5">
                      <FontAwesomeIcon
                        icon={faHeartBroken}
                        onClick={() => dislikeTweet(tweet._id)}
                        style={{ cursor: "pointer" }}
                      />
                    </span>
                    <span className='me-5' style={{ cursor: 'pointer' }}>  <FontAwesomeIcon icon={faComment} onClick={() => { handleshowForReply(); setReplyId(tweet._id) }} /> {tweet.replies.length}</span>
                    <span className='me-5' style={{ cursor: 'pointer' }}>  <FontAwesomeIcon icon={faRetweet} onClick={() => { handleRetweet(tweet._id) }} /> {tweet.reTweetedBy.length}</span>

                  </div>
                </div>
              </div>

            </div>)

              :

              navigate('/')

            }

            <h3>Replies</h3>

            {tweet && tweet.replies ?
              (
                tweet.replies.map((reply) => {

                  return (
                    <div className='container border' key={reply._id}>
                      <div className='row'>

                        <div className='col-12'>
                          <div className='d-flex justify-content-between'>
                            <div className='d-flex p-2'>
                              <div className='me-2'>
                                <img src={reply.tweetedBy.profilePicture} className='profile-pic' alt='profilepic' />
                              </div>
                              <div className=''>

                                <Link to={`/profile/${reply.tweetedBy._id} `} className='fw-bold link' style={{ cursor: 'pointer' }}>@{reply.tweetedBy.username}</Link>
                                <span className='text-secondary' style={{ fontSize: 10 + "px" }}> - {new Date(reply.createdAt).toLocaleDateString()}</span>

                              </div>

                            </div>

                            {reply.tweetedBy._id === user._id ? <div className='mt-2' style={{ cursor: 'pointer' }}>
                              <FontAwesomeIcon icon={faTrash} onClick={() => handleDelete(reply._id)} />
                            </div> : ""}

                          </div>

                        </div>

                        <div className='col-12 px-5 ' style={{ cursor: 'pointer' }}>
                          <div className='ms-2' >
                            <Link to={`/tweet/${reply._id}`} className='tweet'>
                              <p style={{ overflow: 'auto' }}>{reply.content}</p>
                              {reply.image ? <img src={reply.image} className='tweet-img mb-3' alt='tweetimage' /> : ""}
                            </Link>
                          </div>

                          <div className='mb-2 ms-3'>
                            {reply.likes.includes(user._id) ? <span className='me-5 text-danger'> <FontAwesomeIcon icon={faHeart} onClick={() => likeTweet(reply._id)} style={{ cursor: 'pointer', color: 'red' }} /> {reply.likes.length} </span> : <span className='me-5'> <FontAwesomeIcon icon={faHeart} onClick={() => likeTweet(reply._id)} style={{ cursor: 'pointer' }} /> {reply.likes.length} </span>}

                            <span className="me-5">
                              <FontAwesomeIcon
                                icon={faHeartBroken}
                                onClick={() => dislikeTweet(reply._id)}
                                style={{ cursor: "pointer" }}
                              />
                            </span>
                            <span className='me-5' style={{ cursor: 'pointer' }}>  <FontAwesomeIcon icon={faComment} onClick={() => { handleshowForReply(); setReplyId(reply._id) }} /> {reply.replies.length}</span>
                            <span className='me-5' style={{ cursor: 'pointer' }}>  <FontAwesomeIcon icon={faRetweet} /> {reply.reTweetedBy.length}</span>

                          </div>
                        </div>
                      </div>

                    </div>

                  )
                })

              )
              :
              <p>Add a reply</p>

            }

          </div>

        </div>

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

      </div >

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

export default TweetDetails