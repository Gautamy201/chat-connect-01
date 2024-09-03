import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Avtar from "./Avtar";
import { HiDotsVertical } from "react-icons/hi";
import { MdArrowBackIos } from "react-icons/md";
import { BsEmojiSmile } from "react-icons/bs";
import { IoMdAdd } from "react-icons/io";
import { IoMdSend } from "react-icons/io";
import { IoDocumentTextSharp } from "react-icons/io5";
import { FaImage } from "react-icons/fa6";
import { MdVideoLibrary } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import EmojiPicker from "emoji-picker-react";
import uploadFile from "../helper/uplodeFile";
import MediaMessageSender from "../components/MediaMessageSender";
import ShowImageAndVideo from "./ShowImageAndVideo";

import Message from "./Message";

const MessagePage = () => {
  const dispach = useDispatch();
  const [openMediaContainer, setOpenMediaContainer] = useState(false);
  const params = useParams();
  const socketConection = useSelector((state) => state?.user?.socketConnection);
  const user = useSelector((state) => state?.user);
  const [allMessage, setAllMessage] = useState([]);
  const [userData, setUserData] = useState({
    _id: "",
    name: "",
    email: "",
    profile_Pic: "",
    online: false,
  });
  const currentMessage = useRef(null);
  let paramsUserId = params.userId.split("-")[0];
  const [openMediaSendcontainer, setOpenSendMediacontainer] = useState(false);

  const [message, setMessag] = useState({
    textMessage: "",
    imageUrl: "",
    videoUrl: "",
  });
  const [uplodedPersecent, setUploadedPersecent] = useState(null);
  const [imageVideoPadth, setImageVideoPath] = useState({
    pathName: "",
    type: "",
  });
  const [fileData, setFileData] = useState(null);
  const handleUplodeImageBtn = async (e, fileType) => {
    setOpenMediaContainer(false);
    const file = e.target.files[0];
    setFileData(file);
    let pathFile = URL.createObjectURL(file);
    setImageVideoPath((preve) => {
      return {
        ...preve,
        pathName: pathFile,
        type: fileType,
      };
    });
    setOpenSendMediacontainer(true);
  };

  // claer vise and image path and alse close media sender div
  const clearAndCloseMediaContainer = () => {
    setOpenSendMediacontainer(false);
    setFileData(null);
    setImageVideoPath({
      pathName: "",
      type: "",
    });
  };

  const handleMediafileSenderBtn = async (message, type) => {
    setOpenSendMediacontainer(false);
    const uploadPhoto = await uploadFile(fileData, setUploadedPersecent);
    const url = uploadPhoto?.url;

    const messageData = {
      textMessage: message,
      imageUrl: "",
      videoUrl: "",
    };
    if (type === "image") {
      messageData.imageUrl = url;
    } else if (type === "video") {
      messageData.videoUrl = url;
    }
    setImageVideoPath({
      pathName: "",
      type: "",
    });
    setFileData(null);
    setUploadedPersecent(null);

    massgeSender(messageData, user, paramsUserId);

    setMessag({
      textMessage: "",
      imageUrl: "",
      videoUrl: "",
    });
  };
  useEffect(() => {
    if (currentMessage.current) {
      console.log(currentMessage.current);
      currentMessage.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  });

  useEffect(() => {
    if (socketConection) {
      socketConection.emit("message-page", paramsUserId);
      socketConection.on("message-user", (data) => {
        setUserData(data);
      });
      socketConection.on("new-message", (data) => {
        setAllMessage(data);
      });
    }
  }, [socketConection, params, user]);

  const handleMessageSenderBtn = async (e) => {
    e.preventDefault();
    massgeSender(message, user, paramsUserId);
  };
  async function massgeSender(message, user, paramsUserId) {
    if (message.textMessage || message.imageUrl || message.videoUrl) {
      socketConection.emit("send-message", {
        sender: user._id,
        receiver: paramsUserId,
        message: message,
        mesByUserId: user._id,
      });
      setMessag({
        textMessage: "",
        imageUrl: "",
        videoUrl: "",
      });
    }
  }
  return (
    <div>
      <header className="sticky top-0 h-16 bg-white flex justify-between items-center px-5 lg:px-10 border-b">
        <div className="flex items-center gap-4">
          <Link to={"/"} className=" active:scale-[0.9]">
            <MdArrowBackIos size={25} />
          </Link>
          <div>
            <Avtar
              width={50}
              height={50}
              imageUrl={userData.profile_Pic}
              name={userData.name}
              userId={userData._id}
            />
          </div>
          <div>
            <h3 className="font-semibold text-lg my-0 text-ellipsis line-clamp-1 capitalize">
              {userData.name}
            </h3>
            <p className=" text-sm -mt-1">
              {userData.online ? (
                <span className="text-primary">online</span>
              ) : (
                <span className="text-slate-400">offline</span>
              )}
            </p>
          </div>
        </div>
        <div className="text-slate-400">
          <button className="hover:text-primary active:scale-[0.9]">
            <HiDotsVertical />
          </button>
        </div>
      </header>
      {/* ------------------------------------------------- */}
      <div className=" h-[calc(100vh-64px)] relative">
        {openMediaSendcontainer && (
          <MediaMessageSender
            imageVideoPadth={imageVideoPadth}
            close={clearAndCloseMediaContainer}
            sendBtn={handleMediafileSenderBtn}
          />
        )}
        {/* show all messages */}
        <section
          className=" h-[calc(100vh-64px-64px)] relative"
          style={{
            backgroundImage: `url("/assets/image/bg555.jpg")`,
            backgroundSize: "calc(100vh - 128px) 100%",
          }}
        >
          <div className="w-full h-full p-4 overflow-scroll bg-slate-900 bg-opacity-70 sm:px-10">
            {/* show all message */}

            {allMessage.length === 0 && (
              <div className="w-full h-full flex justify-center items-center">
                <div role="status">
                  <svg
                    aria-hidden="true"
                    className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-green-500"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            )}

            {allMessage.length > 0 &&
              allMessage.map((mesg, index) => {
                return (
                  <Message
                    key={index}
                    mesg={mesg}
                    user={user}
                    userData={userData}
                  />
                );
              })}

            {/* ------------------------------- */}
            {uplodedPersecent && imageVideoPadth && (
              <ShowImageAndVideo
                imageVideoPath={imageVideoPadth}
                uploadingPercent={uplodedPersecent}
                imageVideoUrl={message.imageUrl}
              />
            )}
            <div ref={currentMessage} />
          </div>

          {/*media file sub-tab */}
          {openMediaContainer && (
            <div className=" shadow bg-slate-100 w-[200px] p-2 rounded grid absolute bottom-1 left-1 ">
              <button
                className="p-2 hover:bg-slate-200 rounded flex gap-2 items-center text-secondry hover:text-primary "
                onChange={(e) => handleUplodeImageBtn(e, "document")}
              >
                <IoDocumentTextSharp size={20} />
                <span className="text-ellipsis text-lg text-clip-1 font-semibold ">
                  Document
                </span>
                <input
                  type="file"
                  accept="application/pdf /*"
                  className="absolute w-full left-0 top-0 h-full opacity-0 cursor-pointer"
                />
              </button>
              <button
                className="p-2 hover:bg-slate-200 rounded flex gap-2 items-center relative text-secondry hover:text-primary "
                onChange={(e) => handleUplodeImageBtn(e, "image")}
              >
                <FaImage size={20} />
                <span className="text-ellipsis text-lg text-clip-1 font-semibold ">
                  Images
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="absolute w-full left-0 top-0 h-full opacity-0 cursor-pointer"
                />
              </button>
              <button
                className="p-2 hover:bg-slate-200 rounded flex gap-2 items-center relative text-secondry hover:text-primary "
                onChange={(e) => handleUplodeImageBtn(e, "video")}
              >
                <MdVideoLibrary size={20} />
                <span className="text-ellipsis text-lg text-clip-1 font-semibold ">
                  Videos
                </span>
                <input
                  type="file"
                  accept="video/*"
                  className="absolute w-full left-0 top-0 h-full opacity-0 cursor-pointer"
                />
              </button>
            </div>
          )}
          {/*media file sub-tab */}
        </section>

        {/* write a new message */}
        <section className="sticky bottom-0 h-16 bg-white flex gap-4 items-center px-5 lg:px-10 border-t z-30">
          <div className="">
            <button className="active:scale-[0.9] hover:text-primary ">
              <BsEmojiSmile size={22} />
            </button>
          </div>
          <div>
            <button
              className={`active:scale-[0.9] hover:bg-primary p-1 rounded-full transition-all duration-75`}
              onClick={() => setOpenMediaContainer(!openMediaContainer)}
            >
              {openMediaContainer ? (
                <IoMdClose size={25} />
              ) : (
                <IoMdAdd size={25} />
              )}
            </button>
          </div>
          <form
            onSubmit={handleMessageSenderBtn}
            className="w-full flex gap-3 items-center"
          >
            <div className="w-full shadow">
              <input
                type="text"
                placeholder="Type a message"
                className="border w-full px-3 py-2 rounded outline-none focus:outline-primary"
                onChange={(e) =>
                  setMessag((preve) => {
                    return {
                      ...preve,
                      textMessage: e.target.value,
                    };
                  })
                }
                value={message.textMessage}
              />
            </div>
            <div className="" title="Send message">
              <button
                className="active:scale-[0.9] hover:text-primary"
                type="submit"
              >
                <IoMdSend size={30} />
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default MessagePage;
