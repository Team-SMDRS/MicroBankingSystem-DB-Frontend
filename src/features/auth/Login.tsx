import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import api from "../../api/axios";
import logo from "../../assets/logo1.png";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await api.post(
        "api/auth/login",
        { username, password },
        { withCredentials: true } // allows storing HttpOnly cookie
      );

      const data = response.data;

      // extract user and access token
      const user = {
        id: data.user.user_id,
        username: data.user.username,
        permissions: data.permissions,
      };
      const accessToken = data.access_token;

      // store in React context; refresh token is handled by cookie
      login(user, accessToken);

      // Debug: Check if cookies are set
      console.log("Cookies after login:", document.cookie);
      console.log("Login response headers:", response.headers);

      navigate("/"); // redirect to dashboard
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-white to-tertiary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-borderLight p-8 animate-slide-in-up">
          {/* Logo and Branding Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="bg-background rounded-2xl shadow-md border border-borderLight p-4 mb-6">
              <img src={logo} alt="MicroBank Logo" className="h-20 w-20 object-contain" />
            </div>
            <h1 className="text-4xl font-bold text-primary text-center mb-2">MicroBank</h1>
            <p className="text-secondary text-center text-sm font-medium mb-1">Professional Banking Solution</p>
            <p className="text-highlight font-semibold text-xs tracking-wider text-center">Smart Banking, Built on Trust.</p>
          </div>

          {/* Divider */}
          <div className="h-0.5 bg-gradient-to-r from-transparent via-borderLight to-transparent mb-6"></div>

          {/* Welcome Message */}
          <p className="text-center text-primary font-semibold text-lg mb-6">Welcome</p>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 animate-slide-down">
              <div className="flex items-start gap-2">
                <span className="text-lg">⚠️</span>
                <p className="font-medium">{error}</p>
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

            {/* Password Input */}
            <div>
              <label className="label-text flex items-center gap-2">
                <span>🔐</span>
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field w-full transition-all duration-300 focus:ring-2 focus:ring-highlight"
                required
                disabled={isLoading}
              />
            </div>

            {/* Login Button */}
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
                  Signing In...
                </>
              ) : (
                <>
                  <span className="mr-2">Sign In</span>
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          {/* Security Info */}
          <div className="mt-6 pt-6 border-t border-borderLight">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="text-lg">🔒</span>
              <p className="text-center text-xs text-secondary font-medium">
                Secure Banking Portal
              </p>
            </div>
            {/* <p className="text-center text-highlight font-semibold text-sm tracking-wide italic">
              "Smart Banking, Built on Trust."
            </p> */}
          </div>

          {/* Footer Info */}
          <div className="mt-4 pt-4 border-t border-borderLight">
            <p className="text-center text-xs text-secondary">
              Powered by <span className="font-semibold text-primary">Team SMDRS</span>
            </p>
            <p className="text-center text-xs text-tertiary mt-1">
              Industry-standard encryption • 24/7 Security
            </p>
          </div>
        </div>

        {/* Security Notice Below Form
        <div className="mt-6 text-center">
          <p className="text-white text-sm font-medium opacity-90">
            �️ Your credentials are encrypted with industry-standard SSL/TLS security
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default Login;
