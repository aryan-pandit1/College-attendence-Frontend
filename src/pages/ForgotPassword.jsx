import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  forgotPassword,
  verifyOTP,
  resetPassword,
} from "../services/profileService";

import "./ForgotPassword.css";

const ForgotPassword = () => {

  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");

  const [otp, setOtp] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const sendOTP = async () => {

    if (!email) {

      alert("Please enter your email.");

      return;

    }

    try {

      setLoading(true);

      await forgotPassword(email);

      alert("OTP sent successfully.");

      setStep(2);

    }

    catch (err) {

      console.log(err);

      alert(
        err.response?.data?.error ||
        "Unable to send OTP."
      );

    }

    finally {

      setLoading(false);

    }

  };
    const verifyOTPCode = async () => {

    if (!otp) {

      alert("Enter OTP.");

      return;

    }

    try {

      setLoading(true);

      await verifyOTP({

        email,

        otp,

      });

      alert("OTP Verified.");

      setStep(3);

    }

    catch (err) {

      console.log(err);

      alert(
        err.response?.data?.error ||
        "Invalid OTP."
      );

    }

    finally {

      setLoading(false);

    }

  };
    const savePassword = async () => {

    if (newPassword !== confirmPassword) {

      alert("Passwords do not match.");

      return;

    }

    try {

      setLoading(true);

      await resetPassword({

        email,

        otp,

        new_password: newPassword,

      });

      alert(
        "Password changed successfully."
      );

      navigate("/");

    }

    catch (err) {

      console.log(err);

      alert(
        err.response?.data?.error ||
        "Unable to reset password."
      );

    }

    finally {

      setLoading(false);

    }

  };
    return (

    <div className="forgot-page">

      <div className="forgot-card">

        <h2>Forgot Password</h2>

        {
          step === 1 && (

            <>

              <input

                type="email"

                placeholder="Enter Email"

                value={email}

                onChange={(e)=>

                  setEmail(e.target.value)

                }

              />

              <button

                onClick={sendOTP}

                disabled={loading}

              >

                Send OTP

              </button>

            </>

          )
        }

        {
          step === 2 && (

            <>

              <input

                type="text"

                placeholder="Enter OTP"

                value={otp}

                onChange={(e)=>

                  setOtp(e.target.value)

                }

              />

              <button

                onClick={verifyOTPCode}

                disabled={loading}

              >

                Verify OTP

              </button>

            </>

          )
        }

        {
          step === 3 && (

            <>

              <input

                type="password"

                placeholder="New Password"

                value={newPassword}

                onChange={(e)=>

                  setNewPassword(e.target.value)

                }

              />

              <input

                type="password"

                placeholder="Confirm Password"

                value={confirmPassword}

                onChange={(e)=>

                  setConfirmPassword(e.target.value)

                }

              />

              <button

                onClick={savePassword}

                disabled={loading}

              >

                Reset Password

              </button>

            </>

          )
        }

      </div>

    </div>

  );

};

export default ForgotPassword;