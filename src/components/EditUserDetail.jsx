import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import Avtar from "../components/Avtar";
import { MdOutlineEdit } from "react-icons/md";
import { MdSave } from "react-icons/md";
import { IoMdCamera } from "react-icons/io";
import uploadFile from "../helper/uplodeFile";
import deleteUploadFile from "../helper/deleteUploadFile.js";
import { MdClose } from "react-icons/md";
import axios from "axios";
import toast from "react-hot-toast";
const EditUserDetail = ({ data, setEditSectionOpen }) => {
  const [userData, setUserData] = useState({
    name: "",
    profile_Pic: "",
  });
  const [name, setName] = useState("");

  const [editName, setEditName] = useState(false);

  useEffect(() => {
    setUserData((preve) => {
      return {
        ...preve,
        ...data,
      };
    });
    setName(data.name);
  }, [data]);
  const [loderForImage, setLoderForImage] = useState(false);

  const [uplodedPersecent, setUploadedPersecent] = useState(null);
  const handleUploadPhoto = async (e) => {
    setLoderForImage(true);
    try {
      if (userData.profile_Pic) {
        await deleteUploadFile(userData.profile_Pic);
      }

      const file = e.target.files[0];
      const uploadPhoto = await uploadFile(file, setUploadedPersecent);

      const URL = `${import.meta.env.REACT_APP_BACKEND_URL}api/update-user`;
      const response = await axios({
        method: "post",
        url: URL,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: {
          profile_Pic: uploadPhoto?.url,
        },
        withCredentials: true,
      });
      console.log(response);
      toast.success(response?.data?.message);
      if (response.data.success) {
        setUserData((preve) => {
          return {
            ...preve,
            ...response?.data,
          };
        });
        setLoderForImage(false);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      setLoderForImage(false);
    }
  };

  const handleSubmite = async (data, e) => {
    e.preventDefault();
    console.log(data);
    const URL = `${import.meta.env.REACT_APP_BACKEND_URL}api/update-user`;
    try {
      const response = await axios({
        method: "post",
        url: URL,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data,
        withCredentials: true,
      });
      console.log(response);
      toast.success(response?.data?.message);
      if (response.data.success) {
        setName(userData.name);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
    }
  };
  return (
    <div className="absolute top-0 left-0 bg-gray-700 bg-opacity-40 w-screen h-screen flex justify-center items-center z-10">
      <div className="bg-white m-1 rounded p-4 py-5 w-full max-w-xs relative shadow">
        <div className="absolute left-1/2 -translate-x-1/2 top-[-50px] border-[3px]  border-t-white border-l-white   border-r-transparent border-b-transparent rounded-full rotate-45 shadow bg-white">
          <div className="-rotate-45 relative">
            <Avtar
              width={100}
              height={100}
              name={userData.name}
              imageUrl={userData.profile_Pic}
            />
            {loderForImage && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-500 bg-opacity-60 w-full h-full rounded-full overflow-hidden">
                <span
                  className="bg-green-400 bg-opacity-50 h-full inline-block w-full"
                  style={{ width: `${uplodedPersecent}%` }}
                ></span>
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm animate-prime ">
                  Uploading
                </span>
              </div>
            )}
            <button
              title="Change Profile_pic"
              className="absolute bottom-1 left-1/2 -translate-x-1/2 opacity-[0.6] active:scale-[0.9] overflow-hidden"
            >
              {!loderForImage && (
                <>
                  <IoMdCamera size={25} />
                  <input
                    className="absolute z-10 top-0 left-0 opacity-0 cursor-pointer"
                    type="file"
                    onChange={(e) => handleUploadPhoto(e)}
                  />
                </>
              )}
            </button>
          </div>
        </div>
        <button
          className="absolute -top-6 -right-6 hover:text-red-500 font-bold active:scale-[1.3]"
          onClick={() => setEditSectionOpen(false)}
        >
          <IoClose size={20} />
        </button>
        <h2 className="font-semibold mt-10 text-center">Profile Detail</h2>
        <div className="grid gap-3 mt-3">
          <div>
            <div className=" flex flex-col gap-1">
              {editName ? (
                <form onSubmit={(e) => handleSubmite({ name: name }, e)}>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={name}
                      name="name"
                      id="name"
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full py-1 px-2 focus:outline-none focus:border-primary border border-green-700 rounded"
                    />
                    <button
                      title="Edit your name"
                      type="submit"
                      className="flex items-center text-green-600 gap-1 active:scale-[0.9]"
                    >
                      <MdSave /> <span className="text-sm">Save</span>
                    </button>

                    <button
                      onClick={() => setEditName(false)}
                      title="Edit your name"
                      type="submit"
                      className="flex items-center text-red-600 gap-1 active:scale-[0.9]"
                    >
                      <MdClose /> <span className="text-sm">Cancle</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex gap-5 justify-center">
                  <p className="">{userData.name}</p>
                  <button
                    title="Edit your name"
                    type="button"
                    className="flex items-center text-yellow-600 gap-1 active:scale-[0.9]"
                    onClick={() => setEditName(true)}
                  >
                    <MdOutlineEdit />
                    <span className="text-sm">Change Name</span>
                  </button>
                </div>
              )}
            </div>
          </div>
          {/* ------------ */}
        </div>
      </div>
    </div>
  );
};

export default EditUserDetail;
