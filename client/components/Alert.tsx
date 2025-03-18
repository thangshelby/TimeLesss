import React from "react";
import useGlobalState from "../store";
import { FaRegTimesCircle } from "react-icons/fa";
import { BsCheck2Circle } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";

const Alert = () => {
  const { alert, setGlobalState } = useGlobalState();
  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen
      flex items-center justify-center bg-black 
      bg-opacity-50 transform transition-transform
      duration-300 ${alert.show ? "scale-100" : "scale-0"}`}
    >
      <div
        className="flex flex-col justify-center items-center
        bg-[#151c25] shadow-xl shadow-[#e32970] rounded-xl
        min-w-min py-3 px-10 relative"
      >
        <div 
        onClick={()=>{
          setGlobalState({alert:{show:false,msg:"",color:""}}) 
        }}
        className="right-1 text-xl top-1 absolute hover:cursor-pointer scale-125 duration-300">
          <IoMdClose  />
        </div>
        {alert.color == "red" ? (
          <FaRegTimesCircle className="text-red-600 text-4xl" />
        ) : (
          <BsCheck2Circle className="text-green-600 text-4xl" />
        )}
        <p className="text-white my-3">{alert.msg}</p>
      </div>
    </div>
  );
};

export default Alert;
