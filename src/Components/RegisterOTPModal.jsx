import { useEffect, useState } from "react";
import {
  verifyRegistrationOTP,
  resendRegistrationOTP,
} from "../services/authService";

const RegisterOTPModal = ({
  email,
  username,
  password,
  onVerified,
  onClose,
}) => {
  const [otp, setOtp] = useState("");

  const [seconds, setSeconds] = useState(60);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (seconds <= 0) return;

    const timer = setTimeout(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [seconds]);

  const handleVerify = async () => {
    if (otp.length !== 6) {

  setError("Please enter the 6-digit OTP.");

  return;

}

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await verifyRegistrationOTP({
        email,
        otp,
      });

      setSuccess(
  "Email verified successfully."
);

setTimeout(() => {
  onVerified();
}, 800);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Invalid OTP."
      );
    }

    setLoading(false);
  };

  const handleResend = async () => {
    setError("");
    setSuccess("");

    try {
      await resendRegistrationOTP(email);

      setSeconds(60);

      setSuccess("OTP sent again.");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Unable to resend OTP."
      );
    }
  };

  return (
    <div className="otp-modal">

      <h2>Email Verification</h2>

      <p>
        Enter the OTP sent to
      </p>

      <strong>{email}</strong>

      <input
       onKeyDown={(e) => {
    if (e.key === "Enter") {
      handleVerify();
    }
  }}

        type="text"
        maxLength={6}
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) =>
  setOtp(
    e.target.value
      .replace(/\D/g, "")
      .slice(0, 6)
  )
}
      />

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      {success && (
        <p className="success-message">
          {success}
        </p>
      )}

      <button
  onClick={handleVerify}
  disabled={
    loading ||
    otp.length !== 6
  }
>
        {loading
          ? "Verifying..."
          : "Verify OTP"}
      </button>

      <button
        disabled={seconds > 0}
        onClick={handleResend}
      >
        {seconds > 0
          ? `Resend in ${seconds}s`
          : "Resend OTP"}
      </button>

      <button
        onClick={onClose}
      >
        Cancel
      </button>

    </div>
  );
};

export default RegisterOTPModal;