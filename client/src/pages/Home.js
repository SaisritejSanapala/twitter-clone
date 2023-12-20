import React, { useEffect } from 'react'
import './Home.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faTrash, faComment, faRetweet, faHeart, faHeartBroken } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2'
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../src/config'
import Sidebar from '../components/Sidebar';



const Home = () => {

  const [content, setContent] = useState()
  const [data, setData] = useState([])
  const [show, setShow] = useState(false);
  const [showForReply, setShowForReply] = useState(false);

  const [replyId, setReplyId] = useState("")
  const [image, setImage] = useState({ preview: '', data: '' })


  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleshowForReply = () => setShowForReply(true);
  const handleCloseForReply = () => setShowForReply(false);


  const user = JSON.parse(localStorage.getItem("user"))

  const CONFIG_OBJ = {
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("token")
    }
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



  const handlePostTweet = async () => {

    if (content === "") {
      Swal.fire({
        icon: 'error',
        title: 'Content is mandatory'
      })
    }
    else {
      if (image.data === "") {
        const request = { content }
        axios.post(`${API_BASE_URL}/Api/tweet`, request, CONFIG_OBJ)
          .then((result) => {
            setImage({ preview: '', data: '' })
            setContent("")
            toast.success("Tweet uploaded successfully")
            handleClose()
            getAllTweets()

          })
          .catch((error) => {
            console.log(error)
            toast.error("")
          })

      } else {
        const imgRes = await handleImgUpload();
        const request = { content, image: `${API_BASE_URL}/files/${imgRes.data.fileName}` }
        axios.post(`${API_BASE_URL}/Api/tweet`, request, CONFIG_OBJ)
          .then((result) => {
            setImage({ preview: '', data: '' })
            setContent("")
            toast.success("Tweet uploaded successfully")
            handleClose()
            getAllTweets()

          })
          .catch((error) => { console.log(error) })
      }
    }

  }



  const getAllTweets = async () => {
    await axios.get(`${API_BASE_URL}/API/tweet/`, CONFIG_OBJ)
      .then((result) => {
        setData(result.data.result)

      })
      .catch((error) => { console.log(error) })

  }



  const handleDelete = async (tweetId) => {

    await axios.delete(`${API_BASE_URL}/API/tweet/${tweetId}`, CONFIG_OBJ)
      .then((result) => {
        toast.success(result.data.result)
        getAllTweets()
      })
      .catch((error) => {
        console.log(error)

      })

  }



  const likeTweet = async (tweetId) => {
    await axios.post(`${API_BASE_URL}/Api/tweet/${tweetId}/like`, {}, CONFIG_OBJ)
      .then((result) => {
        toast.success(result.data.success)
        getAllTweets()

      })
      .catch((error) => {
        toast.error(error.response.data.error)


      })


  }

  const dislikeTweet = async (tweetId) => {
    await axios.post(`${API_BASE_URL}/Api/tweet/${tweetId}/dislike`, {}, CONFIG_OBJ)
      .then((result) => {
        toast.success(result.data.success)
        getAllTweets()

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
        getAllTweets()
      })
      .catch((error) => {
        toast.error("some error occurred")

      })


  }


  const handleRetweet = async (tweetId) => {
    await axios.post(`${API_BASE_URL}/API/tweet/${tweetId}/retweet`, {}, CONFIG_OBJ)
      .then((result) => {
        toast.success(result.data.success)
        getAllTweets()
      })
      .catch((error) => {
        toast.error(error.response.data.error)

      })


  }


  useEffect(() => {
    getAllTweets()
  }, [])

  return (

    <>
      <div className='container'>
        <div className='row'>

          <Sidebar />

          <div className='col-md-7 col-sm-12  p-3 border' style={{ minHeight: 100 + "vh" }}>
            <div className='d-flex justify-content-between'>
              <h1>Home</h1>
              <div>
                <Button variant="primary" onClick={handleShow}>
                  Tweet
                </Button>

              </div>
            </div>

            {data.map((tweet) => {

              return (
                <div className='container border' key={tweet._id}>
                  <div className='row'>
                    {tweet.reTweetedBy.length !== 0 ? <span className='ms-2' style={{ fontSize: 10 + "px" }}><FontAwesomeIcon icon={faRetweet} /> Retweeted by @ {tweet.reTweetedBy[tweet.reTweetedBy.length - 1].username}</span> : ""}
                    <div className='col-12'>
                      <div className='d-flex justify-content-between'>

                        <div className='d-flex p-2'>

                          <div className='me-2'>
                            <img src={tweet.tweetedBy.profilePicture} className='profile-pic' alt='profile-pic' />
                          </div>
                          <div className=''>

                            <Link to={`/profile/${tweet.tweetedBy._id} `} className='fw-bold link'>@{tweet.tweetedBy.username}</Link>
                            <span className='text-secondary' style={{ fontSize: 10 + "px" }}> - {new Date(tweet.createdAt).toLocaleDateString()}</span>

                          </div>

                        </div>

                        {tweet.tweetedBy._id === user._id ? <div className='mt-2' style={{ cursor: 'pointer' }}>
                          <FontAwesomeIcon icon={faTrash} onClick={() => handleDelete(tweet._id)} />
                        </div> : ""}

                      </div>

                    </div>

                    <div className='col-12 px-5 '>
                      <div className='ms-2 ' style={{ cursor: 'pointer' }}>
                        <Link to={`/tweet/${tweet._id}`} className='tweet'>
                          <p style={{ overflow: 'auto' }}>{tweet.content}</p>

                          {tweet.image ? <img src={tweet.image} className='tweet-img mb-3' alt='tweetimage' /> : <div></div>}
                        </Link>
                      </div>

                      <div className='mb-2 ms-3'>

                        {tweet.likes.includes(user._id) ? (
                          <span className="me-5">
                            <FontAwesomeIcon
                              icon={faHeart}
                              onClick={() => likeTweet(tweet._id)}
                              className="liked"
                              style={{ cursor: "pointer", color: "red" }}
                            /> {tweet.likes.length}
                          </span>
                        ) : (
                          <span className="me-5">
                            <FontAwesomeIcon
                              icon={faHeart}
                              onClick={() => likeTweet(tweet._id)}
                              style={{ cursor: "pointer" }}
                            /> {tweet.likes.length}
                          </span>
                        )}

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

                </div>
              )


            })
            }

          </div>

        </div>



        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>New Tweet</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <textarea className='form-control mb-3' value={content} onChange={(e) => setContent(e.target.value)} placeholder='Write your tweet'></textarea>
            <FontAwesomeIcon icon={faImage} className='mb-3' />
            <input name="file" type="file" id="drop_zone" className="form-control mb-3" accept=".jpg,.png,.gif" onChange={handleFileSelect} />

            {image.preview && <img src={image.preview} className='w-100' alt='preview' />}

          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handlePostTweet}>
              Tweet
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

export default Home