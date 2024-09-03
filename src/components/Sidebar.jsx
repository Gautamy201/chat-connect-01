import { FaUserPlus } from "react-icons/fa";
import { IoChatboxEllipses } from "react-icons/io5";
import { BiLogOutCircle } from "react-icons/bi";
import EditUserDetail from "../components/EditUserDetail";
import Avtar from "../components/Avtar";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { logout } from "../redux/userSlice";
import { GoArrowUpLeft } from "react-icons/go";
import SearchUser from "./SearchUser";
import { MdKeyboardArrowDown } from "react-icons/md";
import { AiOutlineMenuUnfold } from "react-icons/ai";
import moment from "moment";
import { genratePathName } from "../helper/commonFunction ForUse";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(true);
  const [allUser, setAllUser] = useState([]);
  const [openSearchUser, setOpenSearchUser] = useState(false);
  const user = useSelector((state) => state.user);
  const [editSectionOpen, setEditSectionOpen] = useState(false);
  const socketConnection = useSelector((state) => state.user.socketConnection);

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("sidebar", user._id);
      socketConnection.on("allConversation", (data) => {
        const conversationUserData = data.map((item) => {
          if (item.sender._id === item.receiver._id) {
            return {
              ...item,
              userDetail: item.sender,
            };
          } else if (item.receiver._id !== user._id) {
            return {
              ...item,
              userDetail: item.receiver,
            };
          } else {
            return {
              ...item,
              userDetail: item.sender,
            };
          }
        });

        setAllUser(conversationUserData);
      });
    }
  }, [socketConnection, user]);

  return (
    <div
      className={`w-full h-full grid sm:grid-cols-[56px,1fr] grid-cols-[1fr] relative`}
    >
      <div
        className={`bg-brand w-20  sm:w-14 h-full rounded-tr-lg rounded-br-lg py-4 hover:text-primary flex flex-col justify-between items-center absolute sm:static top-0 ${
          openMenu ? "left-0" : "-left-20"
        } z-20`}
      >
        <button
          className={`absolute bg-brand text-xs px-1 py-4 rounded-tr-lg rounded-br-lg top-1/2 -translate-y-1/2 -right-6 pl-6 sm:hidden uppercase text-white`}
          style={{ textOrientation: "upright", writingMode: "vertical-lr" }}
          onClick={() => setOpenMenu(!openMenu)}
        >
          {openMenu ? "close" : "open"}
        </button>
        <div className="flex flex-col gap-2 text-white">
          <NavLink
            className={({ isActive }) =>
              `sm:w-12 sm:h-12 w-16 h-16 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded active:scale-[0.9] text-black ${
                isActive && "bg-slate-200"
              }`
            }
            title="Chat"
            onClick={() => {
              setOpenMenu(!openMenu);
            }}
          >
            <IoChatboxEllipses size={25} />
          </NavLink>
          <button
            className="sm:w-12 sm:h-12 w-16 h-16 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded active:scale-[0.9]"
            title="Add friend"
            onClick={() => {
              setOpenSearchUser(true);
              setOpenMenu(!openMenu);
            }}
          >
            <FaUserPlus size={25} />
          </button>
        </div>
        <div>
          <button
            title={user.name}
            className="sm:w-12 sm:h-12 w-16 h-16 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded active:scale-[0.9]"
            onClick={() => {
              setEditSectionOpen(!editSectionOpen);
              setOpenMenu(!openMenu);
            }}
          >
            <Avtar
              width={30}
              height={30}
              name={user.name}
              imageUrl={user.profile_Pic}
            />
          </button>
          <button
            title="Logout"
            className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded active:scale-[0.9] text-white"
            onClick={() => {
              dispatch(logout);
              navigate("/email");
              setOpenMenu(!openMenu);
            }}
          >
            <BiLogOutCircle size={25} />
          </button>
        </div>
      </div>

      <div className="w-full bg-opacity-20 border-r">
        <div className="w-full h-20 sm:h-16 flex items-center overflow-hidden pl-3 ">
          {/* {!openMenu && (
            <button
              className="sm:hidden flex flex-col items-center px-2 active:scale-[1.1]"
              onClick={() => setOpenMenu(true)}
            >
              <AiOutlineMenuUnfold size={35} />
              <span>Menu</span>
            </button>
          )} */}
          <h2
            className={`text-xl sm:w-fit font-bold p-4 text-slate-800 ${
              openMenu ? "text-center w-full" : "text-left"
            }`}
          >
            Message
          </h2>
        </div>
        <div className="bg-slate-200 p-[0.7px]"></div>
        <div className=" w-full  h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar px-2 gap-1">
          {allUser.length === 0 && (
            <div className="mt-12">
              <div className="flex justify-center items-center my-4 text-slate-500">
                <GoArrowUpLeft size={50} />
              </div>
              <p className="text-lg text-center text-slate-400">
                Explore user to start a conversation with.
              </p>
            </div>
          )}
          {allUser.map((item, index) => {
            return (
              <Link
                to={genratePathName(item.userDetail)}
                className="  grid grid-cols-[60px,1fr] gap-2 relative cursor-pointer overflow-hidden px-2"
                key={index}
              >
                {/* text-overflow: ellipsis; 
overflow: hidden; 
white-space: nowrap; */}
                <div className="py-2 ">
                  <Avtar
                    width={60}
                    height={60}
                    name={item.userDetail.name}
                    imageUrl={item.userDetail.profile_Pic}
                  />
                </div>
                <div className=" flex  w-full flex-grow-2 gap-2 border-t border-gray-300 items-center pr-2 overflow-hidden">
                  <div className=" h-auto w-full overflow-hidden text-ellipsis text-nowrap ">
                    <p className=" capitalize flex justify-between w-full">
                      {item.userDetail.name}
                      <span className="text-xs">
                        {moment(item.messages.updatedAt).format("dddd")}
                      </span>
                    </p>
                    <p className="text-slate-500 text-xs text-ellipsis overflow-hidden whitespace-nowrap w-[210px]">
                      {item.messages.textNessage}
                    </p>
                  </div>
                  <div className="absolute -right-[40px] h-full bottom-0  w-[80px]  hover:right-0 cursor-pointer transition-all ease-in-out duration-100 flex items-end hover:bg-slate-300 hover:bg-opacity-40 px-[10px]">
                    <div className="h-[50%] items-center flex gap-1">
                      <div className="text-xs h-[20px] w-[20px] rounded-full p-1  border bg-primary flex justify-center items-center text-balck font-semibold">
                        <span>{item.unSeenmsg}</span>
                      </div>
                      <div className="text-right w-fit h-fit ">
                        <button>
                          <MdKeyboardArrowDown size={25} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {editSectionOpen && (
        <EditUserDetail data={user} setEditSectionOpen={setEditSectionOpen} />
      )}
      {/* search user section */}
      {openSearchUser && (
        <SearchUser onClose={() => setOpenSearchUser(false)} />
      )}
    </div>
  );
};

export default Sidebar;
