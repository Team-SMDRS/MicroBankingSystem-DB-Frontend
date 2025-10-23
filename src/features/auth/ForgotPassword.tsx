import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../../assets/logo1.png";
import axios from "axios";

const ForgotPassword = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // Send data to the API
      await axios.post(
        "https://api.sangeethnipun.cf/send-email",
        {
          to: "NOne",
          subject: "None",
          message: `${email}, ${username}`,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setSuccess("Password reset instructions have been sent to your email!");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Failed to send reset email"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-white to-tertiary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Forgot Password Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-borderLight p-8 animate-slide-in-up">
          {/* Logo and Branding Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="bg-background rounded-2xl shadow-md border border-borderLight p-4 mb-6">
              <img src={logo} alt="MicroBank Logo" className="h-20 w-20 object-contain" />
            </div>
            <h1 className="text-4xl font-bold text-primary text-center mb-2">MicroBank</h1>
            <p className="text-textSecondary text-center text-sm font-medium mb-1">Reset Your Password</p>
          </div>

          {/* Divider */}
          <div className="h-0.5 bg-gradient-to-r from-transparent via-borderLight to-transparent mb-6"></div>

          {/* Info Message */}
          <p className="text-center text-textSecondary text-sm mb-6">
            Enter your username and email address to receive password reset instructions.
          </p>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 animate-slide-down">
              <div className="flex items-start gap-2">
                <span className="text-lg">⚠️</span>
                <p className="font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border-2 border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 animate-slide-down">
              <div className="flex items-start gap-2">
                <span className="text-lg">✓</span>
                <p className="font-medium">{success}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Input */}
            <div>
              <label className="label-text flex items-center gap-2">
                <span>👤</span>
                Username
              </label>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field w-full transition-all duration-300 focus:ring-2 focus:ring-highlight"
                required
                disabled={isLoading}
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="label-text flex items-center gap-2">
                <span>📧</span>
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field w-full transition-all duration-300 focus:ring-2 focus:ring-highlight"
                required
                disabled={isLoading}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="button-primary w-full mt-8 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center font-semibold text-lg py-3 hover:shadow-lg"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  <span>Send Reset Instructions</span>
                </>
              )}
            </button>
          </form>

          {/* Back to Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-textSecondary">
              Remember your password?{" "}
              <Link to="/login" className="text-primary hover:text-highlight font-medium transition-colors duration-200">
                Back to Login
              </Link>
            </p>
          </div>

          {/* Footer Info */}
          <div className="mt-4 pt-4 border-t border-borderLight">
            <p className="text-center text-xs text-textSecondary">
              Powered by <span className="font-semibold text-primary">Team SMDRS</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
