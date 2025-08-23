"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";

import {
  User,
  Mail,
  Phone,
  Shield,
  Clock,
  Calendar,
  Car,
  Loader,
  MapPin,
  Star,
} from "lucide-react";
import axios from "axios";

const ProfilePage = () => {
  const params = useParams();
  const userToken = params?.userToken;
  const [userData, setUserData] = useState(null);
  const [edit, setedit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [updatedata, setupdatedata] = useState({
    name: "",
    email: "",
    age: "",
    phoneNumber: "",
  });

  const handlechange = (e) => {
    const { name, value } = e.target;
    setupdatedata({ ...updatedata, [name]: value });
  };

  const handlesub = async (e) => {
    e.preventDefault();
    setedit(!edit);
    const response = await axios.put(
      `/api/user-profile/${userToken}`,
      updatedata
    );
    console.log(response.data.success);
    if (response.data.success) {
      alert("profile updated successfully");
    } else {
      alert("profile update went wrong");
    }
  };
  const nowedit = () => {
    setedit(true);
  };
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userToken) return;

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/user-profile/${userToken}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.ok && result.data) {
          updatedata.name = result.data.name;
          updatedata.email = result.data.email;
          updatedata.phoneNumber = result.data.phoneNumber;
          updatedata.age = result.data.age;

          setUserData(result.data);
        } else {
          throw new Error("Invalid response format or no data found");
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userToken]);

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid date";
    }
  };

  const formatPhone = (phone) => {
    if (!phone) return "Not provided";
    const phoneStr = phone.toString();
    if (phoneStr.length === 10) {
      return phoneStr.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
    }
    return phoneStr;
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#fffef9" }}
      >
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#fffef9" }}
      >
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Error Loading Profile
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#fffef9" }}
      >
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <p className="text-gray-600 text-lg">No user data available</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-white"
      style={{ backgroundColor: "#fffef9" }}
    >
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Profile Header */}
          <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 px-8 py-12">
            <div className="absolute inset-0 bg-black opacity-20"></div>
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
              <div className="absolute top-4 right-4">
                <Car className="w-24 h-24 text-white opacity-10" />
              </div>
            </div>

            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
                {/* Profile Image */}
                <div className="relative">
                  <div className="w-36 h-36 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/20">
                    <span className="text-4xl font-bold text-white">
                      {getInitials(userData.name)}
                    </span>
                  </div>
                  {userData.verified && (
                    <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-3 shadow-xl border-2 border-white">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>

                {/* Profile Info */}
                <div className="text-center lg:text-left flex-1">
                  <h1 className="text-5xl font-bold text-white mb-3">
                    <input value={updatedata.name}></input>
                  </h1>
                  <div className="flex flex-col lg:flex-row lg:items-center space-y-3 lg:space-y-0 lg:space-x-8 text-gray-300 mb-4">
                    <div className="flex items-center justify-center lg:justify-start space-x-2">
                      <Mail className="w-5 h-5" />
                      <span className="text-lg">{userData.email}</span>
                    </div>
                    {userData.verified && (
                      <div className="flex items-center justify-center lg:justify-start space-x-2">
                        <Shield className="w-5 h-5 text-green-400" />
                        <span className="text-green-400 font-semibold text-lg">
                          Verified User
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                    <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                      <span className="text-white font-medium">
                        Member since{" "}
                        {new Date(userData.createdAt).getFullYear()}
                      </span>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                      <span className="text-white font-medium">
                        ⭐ Active User
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Personal Information */}
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                    <User className="w-6 h-6 mr-3 text-gray-600" />
                    Personal Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        Full Name
                      </label>
                      <p className="text-lg text-gray-800 font-medium bg-white p-3 rounded-lg">
                        <input
                          name="name"
                          readOnly={!edit}
                          value={updatedata.name}
                          onChange={handlechange}
                        ></input>
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        Age
                      </label>
                      <p className="text-lg text-gray-800 font-medium bg-white p-3 rounded-lg">
                        <input
                          name="age"
                          readOnly={!edit}
                          value={updatedata.age}
                          onChange={handlechange}
                        ></input>
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        Email Address
                      </label>
                      <p className="text-lg text-gray-800 font-medium bg-white p-3 rounded-lg">
                        <input
                          name="email"
                          readOnly={!edit}
                          value={updatedata.email}
                          onChange={handlechange}
                        ></input>
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        Phone Number
                      </label>
                      <p className="text-lg text-gray-800 font-medium bg-white p-3 rounded-lg flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-gray-500" />
                        <input
                          name="phoneNumber"
                          readOnly={!edit}
                          value={updatedata.phoneNumber}
                          onChange={handlechange}
                        ></input>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Activity Timeline */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-gray-600" />
                    Account Activity
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          Account Created
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(userData.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          Last Updated
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(userData.updatedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <button
                      className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center justify-center"
                      onClick={() => {
                        window.location.href = "/user/ride";
                      }}
                    >
                      <Car className="w-4 h-4 mr-2" />
                      Book a Ride
                    </button>
                    <button className="w-full bg-white border-2 border-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:border-gray-300 transition-colors flex items-center justify-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      View Trips
                    </button>
                    {edit ? (
                      <div>
                        {" "}
                        <button
                          className="w-full bg-white border-2 border-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:border-gray-300 transition-colors flex items-center justify-center"
                          onClick={handlesub}
                        >
                          <MapPin className="w-4 h-4 mr-2" />
                          Save profile
                        </button>
                      </div>
                    ) : (
                      <div>
                        {" "}
                        <button
                          className="w-full bg-white border-2 border-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:border-gray-300 transition-colors flex items-center justify-center"
                          onClick={nowedit}
                        >
                          <MapPin className="w-4 h-4 mr-2" />
                          Edit Profile
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
