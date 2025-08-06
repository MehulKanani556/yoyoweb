import React, { useEffect, useState } from "react";
// import UserImg from "../../Assets/Images/user img.png";
import { FaCamera, FaTimes, FaArrowLeft } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { useFormik } from "formik";
// import { updateUser } from "../../Redux/Slice/user.slice";
// import { IMAGE_URL } from "../../Utils/baseUrl";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../Redux/Slice/user.slice";
import { IMAGE_URL } from "../Utils/baseUrl";
import { decryptData, encryptData } from "../Utils/encryption";

const AdminProfile = () => {
  const userId = sessionStorage.getItem("userId");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [gender, setGender] = useState("male");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const currentUser = useSelector((state) => state.user.currUser);
  const [imageRemoved, setImageRemoved] = useState(false);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      photo: "",
      phoneNo: "",
      gender: "",
    },
    // validationSchema: validationSchema,
    onSubmit: (values) => {
      const encryptedValues = {
        firstName: values.firstName ? encryptData(values.firstName) : '',
        lastName: values.lastName ? encryptData(values.lastName) : '',
        email: values.email ? encryptData(values.email) : '',
        photo: values.photo ? values.photo : '',
        phoneNo: values.phoneNo ? encryptData(values.phoneNo) : '',
        gender: values.gender ? encryptData(values.gender) : '',
        dob: values.dob ? encryptData(values.dob) : ''
      };
      dispatch(
        updateUser({
          id: userId,
          values: encryptedValues,
          file: selectedFile,
        })
      ).then((response) => {
        if (response.payload.success) {
          //   navigate("/profile");
        }
      });
    },
  });
  const {
    handleSubmit,
    setFieldValue,
    handleChange,
    setValues,
    values,
    errors,
    touched,
  } = formik;
  // Store initial values for comparison
  const [initialValues, setInitialValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    photo: "",
    phoneNo: "",
    gender: "",
  });

  // Track if form has changed
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    if (currentUser) {
      const initVals = {
        firstName: decryptData(currentUser.firstName) || "",
        lastName: decryptData(currentUser.lastName) || "",
        email: decryptData(currentUser.email) || "",
        photo: currentUser.photo || "",
        phoneNo: decryptData(currentUser.phoneNo) || "",
        gender: decryptData(currentUser.gender) || "",
      };
      setValues(initVals);
      setInitialValues(initVals);
      setGender(decryptData(currentUser.gender));
    }
  }, [currentUser, setValues]);

  // Check for changes
  useEffect(() => {
    // Compare all fields except photo (handle photo separately)
    const changed =
      values.firstName !== initialValues.firstName ||
      values.lastName !== initialValues.lastName ||
      values.email !== initialValues.email ||
      values.phoneNo !== initialValues.phoneNo ||
      values.gender !== initialValues.gender ||
      selectedFile !== null ||
      (imageRemoved && initialValues.photo && initialValues.photo !== "null");
    setIsChanged(changed);
  }, [values, selectedFile, imageRemoved, initialValues]);


  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImageRemoved(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
        setFieldValue("photo", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setImageRemoved(true);
    setFieldValue("photo", "null");
  };

  return (
    <>
      <button
        type="button"
        className="flex items-center gap-2 m-6 text-white hover:text-blue-400"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft />
        Back
      </button>
      <div className=" flex flex-col items-center justify-center">
        <div className="w-full xl:w-[50%] mt-2 p-4 md:p-10 rounded-lg flex flex-col justify-center gap-10  shadow shadow-[#232323]">
          {/* Back Button */}

          {/* Form Section */}
          <form onSubmit={handleSubmit} >
            <div className="relative group mb-5 flex justify-center">
              <div
                className="relative w-24 h-24 rounded-2xl shadow-2xl overflow-hidden"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, #00C6FF 0%, #0072FF 100%)",
                }}
              >
                {previewUrl ? (
                  <>
                    <img
                      src={previewUrl}
                      alt="Profile Preview"
                      className="cursor-pointer object-cover w-full h-full"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage()}
                      className="absolute h-6 w-6 top-1 right-0 bg-black/50 hover:bg-black/60 bg-opacity-70 hover:bg-opacity-90 text-primary rounded-full opacity-0 group-hover:opacity-100 p-1 transition-opacity flex items-center justify-center"
                    >
                      <FaTimes size={14} />
                    </button>
                  </>
                ) : !imageRemoved &&
                  currentUser?.photo &&
                  currentUser?.photo !== "null" ? (
                  <>
                    <img
                      src={
                        currentUser.photo.startsWith("/uploads/")
                          ? `${IMAGE_URL}${currentUser.photo}`
                          : currentUser.photo
                      }
                      alt="Profile"
                      className="cursor-pointer object-cover w-full h-full"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage()}
                      className="absolute h-6 w-6 top-1 right-0 bg-black/50 hover:bg-black/60 bg-opacity-70 hover:bg-opacity-90 text-primary rounded-full opacity-0 group-hover:opacity-100 p-1 transition-opacity flex items-center justify-center"
                    >
                      <FaTimes size={14} />
                    </button>
                  </>
                ) : (
                  <div className="text-black text-lg font-bold flex w-24 h-24 justify-center items-center">
                    <span className="text-black font-bold text-3xl uppercase">
                    {decryptData(currentUser?.firstName)?.[0] || ""}
                    {decryptData(currentUser?.lastName)?.[0] || ""}
                    </span>
                  </div>
                )}

                <input
                  type="file"
                  id="profileImageInput"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <div
                  onClick={() =>
                    document.getElementById("profileImageInput").click()
                  }
                  className="cursor-pointer absolute bottom-0 right-0 z-50 dark:text-white text-white flex items-center justify-center bg-black/50 hover:bg-black/60 w-8 h-8 rounded-full transition-opacity duration-300"
                >
                  <FaCamera className="text-white/60" />
                </div>
              </div>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="profileImageInput"
                onChange={handleImageUpload}
              />
            </div>

            <div className="user-details w-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* First Name */}
                <div className="w-full flex flex-col">
                  <label className="text-[13px] font-normal text-white/80 mb-[5px]">
                    First Name
                  </label>
                  <input
                    name="firstName"
                    type="text"
                    placeholder="First name"
                    className="w-full bg-[#232323] text-[13px] text-white p-2 rounded j_input_field"
                    onChange={handleChange}
                    value={values.firstName}
                  />
                  {errors.firstName && touched.firstName && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.firstName}
                    </div>
                  )}
                </div>

                {/* Last Name */}
                <div className="w-full flex flex-col">
                  <label className="text-[13px] font-normal text-white/80 mb-[5px]">
                    Last Name
                  </label>
                  <input
                    name="lastName"
                    type="text"
                    placeholder="Last name"
                    className="w-full bg-[#232323] text-[13px] text-white p-2 rounded j_input_field"
                    onChange={handleChange}
                    value={values.lastName}
                  />
                  {errors.lastName && touched.lastName && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.lastName}
                    </div>
                  )}
                </div>

                {/* Mobile No. */}
                <div className="form-group mob-no relative w-full">
                  <label className="text-[13px] font-normal text-white/80 mb-[8px]">
                    Mobile No.
                  </label>
                  <div className="flex items-center w-full">
                    <span className="text-white px-2 pb-[2px] text-[13px] absolute border-r border-[#fff]/40 mr-2">
                      +91
                    </span>
                    <input
                      name="phoneNo"
                      type="tel"
                      placeholder="Mobile Number"
                      maxLength={10}
                      className="w-full bg-[#232323] text-[13px] text-white p-2 pl-12 rounded j_input_field"
                      value={values.phoneNo}
                      onChange={handleChange}
                      readOnly={currentUser?.phoneNo}
                      disabled={currentUser?.phoneNo}
                    />
                  </div>
                  {errors.phoneNo && touched.phoneNo && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.phoneNo}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div className="w-full flex flex-col">
                  <label className="text-[13px] font-normal text-white/80 mb-[5px]">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    className="w-full bg-[#232323] text-[13px] text-white p-2 rounded j_input_field"
                    readOnly
                    value={values.email}
                  />
                </div>

                {/* Gender */}
                {/* <div className="flex flex-col xl:col-span-2">
                <label className="text-white text-sm mb-2">Gender</label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 text-white text-sm cursor-pointer">
                    <input
                      type="radio"
                      className="cursor-pointer j_checkBox_radio"
                      name="gender"
                      value="male"
                      checked={gender === "male"}
                      onChange={() => setGender("male")}
                    />
                    Male
                  </label>
                  <label className="flex items-center gap-2 text-white text-sm cursor-pointer">
                    <input
                      type="radio"
                      className="cursor-pointer j_checkBox_radio"
                      name="gender"
                      value="female"
                      checked={gender === "female"}
                      onChange={() => setGender("female")}
                    />
                    Female
                  </label>
                  <label className="flex items-center gap-2 text-white text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      className="cursor-pointer j_checkBox_radio"
                      value="other"
                      checked={gender === "other"}
                      onChange={() => setGender("other")}
                    />
                    Other
                  </label>
                </div>
              </div> */}
                <div className="flex flex-col xl:col-span-2 items-center">
                  <label className="text-white text-sm mb-2">Gender</label>
                  <div className="flex items-center gap-6">
                    {["male", "female", "other"].map((option) => (
                      <label
                        key={option}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="gender"
                          value={option}
                          checked={gender === option}
                          onChange={() => {
                            setGender(option);
                            setFieldValue("gender", option);
                          }}
                          className="hidden"
                        />
                        <div className="relative w-5 h-5">
                          {/* Gradient border container */}
                          <div
                            className={`absolute inset-0 rounded-full p-0.5 transition-all duration-200 ${gender === option
                              ? "bg-gradient-to-r from-cyan-400 to-blue-500"
                              : "bg-gray-400"
                              }`}
                          >
                            {/* Inner black circle */}
                            <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                              {/* Center gradient dot - shows when checked */}
                              {gender === option && (
                                <div className="w-2.5 h-2.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" />
                              )}
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-300 capitalize">
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.gender && touched.gender && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.gender}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="flex mx-auto mt-10 justify-center items-center py-[6px] md600:py-[10px] px-[6px] md600:px-[10px] md:w-[30%] rounded-[4px] font-semibold text-base gap-3 duration-300 z-20 relative w-full text-white border-none cursor-pointer transition-[background-position] duration-400 ease-in-out"
              style={{
                background:
                  "linear-gradient(to right, #00c6ff, #0072ff, #00c6ff)",
                backgroundSize: "200% 100%",
                backgroundPosition: "left center",
                opacity: isChanged ? 1 : 0.5,
                pointerEvents: isChanged ? "auto" : "none",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundPosition = "right center")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundPosition = "left center")
              }
              disabled={!isChanged}
            >
              Update
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AdminProfile;
