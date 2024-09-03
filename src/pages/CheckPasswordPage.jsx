import { useEffect, useState } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Avtar from "../components/Avtar";
import { useDispatch } from "react-redux";
import { setToken } from "../redux/userSlice";
const CheckPasswordPage = () => {
  const location = useLocation();
  console.log(location.state._id)
  const dispatch = useDispatch();
  const [data, setData] = useState({
    password: "",
  });
  const navigate = useNavigate();
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };
  const handleSubmite = async (e) => {
    e.preventDefault();
    const URL = `${import.meta.env.REACT_APP_BACKEND_URL}api/password`;
    try {
      const response = await axios({
        method: "post",
        url: URL,
        data: {
          password: data.password,
          userId: location.state._id,
        },
        withCredentials: true,
      });
      toast.success(response.data.message);
      if (response.data.success) {
        console.log("in Passord chek data => " ,response?.data?.token)
        dispatch(setToken(response?.data?.token));
        localStorage.setItem("token", response?.data?.token);
        setData({
          password: "",
        });
        navigate("/");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
  useEffect(() => {
    if (!location?.state?.name) {
      navigate("/email");
    }
  });
  return (
    <div className="mt-5">
      <div className="bg-white w-full max-w-md mx:2 rounded overflow-hidden p-4 mx-auto md:mx-auto">
        <div className="flex flex-col justify-center items-center mb-2">
          <Avtar
            width={70}
            height={70}
            name={location?.state?.name}
            imageUrl={location?.state?.profile_Pic}
          />
          <h2 className="font-semibold text-lg mt-1 capitalize">
            {location?.state?.name}
          </h2>
        </div>
        <form onSubmit={handleSubmite} className="grid gap-4 mt-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="name">Password :</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter Password"
              className="bg-[slate-100] px-2 py-1 focus:outline-none focus:border-primary focus:border-2 border-2 rounded"
              value={data.password}
              onChange={handleOnChange}
              required
            />
          </div>

          <button
            type="submit"
            className="bg-primary hover:bg-secondry text-white  px-4 py-2 rounded mt-2 transition-all duration-100 active:scale-[1.02] font-bold leading-relaxed tracking-wide"
          >
            Login
          </button>
        </form>

        <p className="my-2 text-center">
          <Link
            to={"/forgot-password"}
            className="hover:text-primary font-semibold pl-1"
          >
            Forgot password ?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CheckPasswordPage;
