import moment from "moment";
import Avtar from "./Avtar";
import { LiaCheckDoubleSolid } from "react-icons/lia";
const Message = ({ mesg, user, userData }) => {
  return (
    <div
      className={`w-full flex py-2 ${
        user._id === mesg.mesByUserId ? "justify-end" : " justify-start"
      }`}
      style={{
        filter: "drop-shadow(0px 0px 3px black )",
      }}
    >
      {/* ONY FOR TEXT #1892a5 */}
      {mesg.textNessage && !mesg.imageUrl && !mesg.videoUrl && (
        <div
          className={`row p-1 shadow flex gap-1 rounded-[5px] relative max-w-[270px] sm:max-w-[450px] ${
            user._id === mesg.mesByUserId
              ? "bg-primary rounded-tr-none"
              : "bg-slate-700 rounded-tl-none"
          }`}
        >
          <span
            className={`absolute  ${
              user._id === mesg.mesByUserId
                ? "text-primary top-[0px] right-[-6px]"
                : "text-slate-700 top-[0px] left-[-5px]"
            }`}
          >
            {user._id === mesg.mesByUserId ? (
              <svg
                viewBox="0 0 8 13"
                height="13"
                width="8"
                preserveAspectRatio="xMidYMid meet"
                className=""
                version="1.1"
                x="0px"
                y="0px"
                enableBackground="new 0 0 8 13"
              >
                <title>tail-out</title>
                <path
                  opacity="0.13"
                  d="M5.188,1H0v11.193l6.467-8.625 C7.526,2.156,6.958,1,5.188,1z"
                ></path>
                <path
                  fill="currentColor"
                  d="M5.188,0H0v11.193l6.467-8.625C7.526,1.156,6.958,0,5.188,0z"
                ></path>
              </svg>
            ) : (
              <svg
                viewBox="0 0 8 13"
                height="13"
                width="8"
                preserveAspectRatio="xMidYMid meet"
                className=""
                version="1.1"
                x="0px"
                y="0px"
                enableBackground="new 0 0 8 13"
              >
                <title>tail-in</title>
                <path
                  opacity="0.13"
                  fill="#0000000"
                  d="M1.533,3.568L8,12.193V1H2.812 C1.042,1,0.474,2.156,1.533,3.568z"
                ></path>
                <path
                  fill="currentColor"
                  d="M1.533,2.568L8,11.193V0L2.812,0C1.042,0,0.474,1.156,1.533,2.568z"
                ></path>
              </svg>
            )}
          </span>
          <div className="p-1">
            <p className={`text-sm text-white`} style={{ lineHeight: "1.4" }}>
              {mesg.textNessage}
            </p>
          </div>
          <div className="flex h-full items-end gap-1 pr-1 text-gray-200">
            <p className="text-xs">
              {moment(mesg.createdAt).format("hh:mm a")}
            </p>
            <p>
              <LiaCheckDoubleSolid />
            </p>
          </div>
        </div>
      )}
      {/* MEDIA WITH TEXT */}
      {mesg.textNessage && mesg.imageUrl && (
        <div
          className={`p-[2px] rounded-[5px] relative rounded-tr-none w-[200px] sm:w-[250px] ${
            user._id === mesg.mesByUserId ? "bg-primary" : "bg-black"
          }`}
        >
          {/* ---------------- */}
          <span
            className={`absolute top-[0px] right-[-6px] ${
              user._id === mesg.mesByUserId ? "text-primary" : "text-slate-700"
            }`}
          >
            <svg
              viewBox="0 0 8 13"
              height="13"
              width="8"
              preserveAspectRatio="xMidYMid meet"
              className=""
              version="1.1"
              x="0px"
              y="0px"
              enableBackground="new 0 0 8 13"
            >
              <title>tail-out</title>
              <path
                opacity="0.13"
                d="M5.188,1H0v11.193l6.467-8.625 C7.526,2.156,6.958,1,5.188,1z"
              ></path>
              <path
                fill="currentColor"
                d="M5.188,0H0v11.193l6.467-8.625C7.526,1.156,6.958,0,5.188,0z"
              ></path>
            </svg>
          </span>
          {/* -------------- */}
          <div className=" h-[200px] sm:h-[240px] w-[calc(200px-4px)] sm:w-[calc(250px-4px)] rounded overflow-hidden">
            <img className="w-full h-full" src={mesg.imageUrl} />
          </div>
          <div className="p-1 flex flex-col gap-1">
            <div className="p-1">
              <p className={`text-sm text-white`} style={{ lineHeight: "1.4" }}>
                {mesg.textNessage}
              </p>
            </div>
            <div className="flex h-full items-end gap-1 pr-1 ">
              <p className="text-xs text-right w-full opacity-[0.6]">7:20 pm</p>
              <p>
                <LiaCheckDoubleSolid />
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Message;
