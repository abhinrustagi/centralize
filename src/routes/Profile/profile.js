import React, { useEffect, useState } from "react";
import Helmet from "react-helmet";
import {
  FaChartPie,
  FaEdit,
  FaTrash,
  FaUserAlt,
  FaUserCog,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { Button, showToast } from "../../components";
import useUserInfo from "../../context/user";
import { fb } from "../../lib";
import { AVATAR_PIC } from "../../static";

const Profile = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState();
  const [{ user }] = useUserInfo();

  useEffect(() => {
    if (user === null) {
      navigate("/", { replace: true });
      return;
    }

    if (user?.displayName !== params.username) {
      navigate("/", { replace: true });
      return;
    }

    const res = async () => {
      await fb.findUserProfile(params.username).then((temp) => {
        if (temp.success) setData(temp.data);
        else {
          showToast(
            `There was an error fetching data: ${temp.message}`,
            "danger"
          );
        }
      });
    };

    if (user.uid) res();
    // eslint-disable-next-line
  }, [params.username, user]);

  const proceedToVerifyEmail = (e) => {
    e.preventDefault();
    fb.sendAccountVerificationEMail().then((res) => {
      if (res.success) {
        showToast("Email Sent", "success");
      } else {
        showToast("There was an error: " + res.message, "danger");
      }
    });
  };

  return (
    <>
      <Helmet>
        <title>{params.username}'s Profile – Centralize</title>
      </Helmet>
      {!user?.emailVerified && (
        <div className="bg-yellow-200 py-3">
          <div className="container flex gap-4 flex-wrap items-center justify-between">
            Your email address is unverified.{" "}
            <Button role="btn" type="outline" onClick={proceedToVerifyEmail}>
              Send Verification Email
            </Button>
          </div>
        </div>
      )}
      <div className="container">
        <div className="flex justify-between items-center gap-6 flex-wrap my-8 bg-white rounded-3xl p-4 shadow">
          <div className="flex lg:gap-12 gap-4 items-center flex-wrap">
            <div className="flex items-center gap-2">
              <img
                src={data?.photoUrl ? data?.photoUrl : AVATAR_PIC}
                alt={`${data?.username} avatar pic`}
                className="rounded-full w-16 h-16 object-cover"
              />
              <div className="flex justify-center flex-col">
                <p className="font-bold text-xl h-max">{data?.name}</p>
                <p className="text-gray-500">{data?.username}</p>
              </div>
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">Email</p>
              <p className="font-medium">{data?.email}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">Date Joined</p>
              <p className="font-medium">
                {data?.dateJoined
                  ? data?.dateJoined.split(",")[0].replace(" ", "/")
                  : "Unavailable"}
              </p>
            </div>
          </div>
          <Button role="btn" sm type="primary" onClick={() => {}}>
            <FaEdit />
            Edit Profile
          </Button>
        </div>
      </div>
      <div className="container my-12">
        <div className="mb-10 flex items-center gap-4 flex-wrap">
          <Button href="." type="primary" sm>
            <FaUserAlt /> Sets
          </Button>
          <Button href="." type="primaryGreen" sm>
            <FaChartPie /> Record
          </Button>
          <Button href="." type="primaryGray" sm>
            <FaUserCog /> Profile Settings
          </Button>
        </div>
        <h2 className="text-3xl font-bold">Sets</h2>
        <div className="flex gap-4 items-center my-4">
          <div className="p-5 rounded bg-violet-100">
            <h3 className="font-medium text-lg mb-3">Set Name</h3>
            <div className="flex gap-3 items-center">
              <Button href="." type="outlineRed" sm>
                <FaTrash />
                Delete
              </Button>
              <Button href="." type="outline" sm>
                <FaEdit />
                Edit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
