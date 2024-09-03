import { Outlet, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  logout,
  setUser,
  setOnlineUser,
  setSocketConnection,
} from "../redux/userSlice";
import Sidebar from "../components/Sidebar";
import logo from "/assets/image/Chat-Connect logo.png";
import io from "socket.io-client";
const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loction = useLocation();

  const user = useSelector((state) => state.user);
  console.log(user);

  const fetchUserDetails = async () => {
    try {
      const URL = `api/user-details`;
      const response = await axios({
        url: URL,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      });
      console.log("fetch user detail => ", response?.data?.data);
      dispatch(setUser(response?.data?.data));
      if (response?.data?.logout) {
        dispatch(logout());
        navigate("/email");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  });
  const basePath = loction.pathname === "/";

  useEffect(() => {
    const url = [
      "https://chat-connect-backend-server.onrender.com",
      "http://localhost:8080",
    ];
    const socketConection = io(url[0], {
      auth: {
        token: localStorage.getItem("token"),
      },
    });

    socketConection.on("onlineUser", (data) => {
      console.log(data);
      dispatch(setOnlineUser(data));
    });
    dispatch(setSocketConnection(socketConection));
    return () => {
      socketConection.disconnect();
    };
  }, []);
  return (
    <div className="grid lg:grid-cols-[380px,1fr] h-[100vh] max-h-screen">
      <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
        <Sidebar />
      </section>
      <section className={`${basePath && "hidden"} lg:block relative`}>
        <div
          className={`w-full h-full flex justify-center items-center flex-col gap-2 absolute ${
            !basePath && "hidden"
          }`}
        >
          <div className="relative max-w-sm lg:max-w-xl">
            <img src={logo} alt="logo" width={"100%"} />
            <p className="text-lg lg:text-2xl text-slate-500 absolute left-[31.5%] bottom-0 font-bold">
              Select user to send message
            </p>
          </div>
        </div>
        <Outlet />
      </section>
    </div>
  );
};

export default HomePage;
