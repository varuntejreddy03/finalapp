import React, { useState, useContext } from "react"; // 1. Import useContext
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext"; // 2. Import UserContext
import toast from "react-hot-toast";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false); // Added for better UX

    const { updateUser } = useContext(UserContext); // 3. Get the updateUser function from context
    const navigate = useNavigate();

    //Handle login form submission
    const handleLogin = async (e) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            setError("Please enter a valid email address.");
            return;
        }
        if (!password) {
            setError("Please enter your password.");
            return;
        }
        setError("");
        setLoading(true);

        //Login API call
        try {
            const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
                email,
                password,
            });
            const { token, user } = response.data;

            if (token) {
                localStorage.setItem("token", token);
                // 4. THE FIX: Update the user context immediately after login
                updateUser(user); 
                toast.success("Login successful!");
                navigate("/dashboard");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
                <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
                <p className="text-xs text-slate-700 mt-[5px] mb-6">
                    Please enter your credentials to access your account.
                </p>

                <form onSubmit={handleLogin}>
                    <Input
                        value={email}
                        onChange={({ target }) => setEmail(target.value)}
                        label="Email Address"
                        placeholder="john@example.com"
                        type="text"
                    />

                    <Input
                        value={password}
                        onChange={({ target }) => setPassword(target.value)}
                        label="Password"
                        placeholder="********"
                        type="password"
                    />

                    {error && <p className="text-red-500 text-xs pt-2.5">{error}</p>}

                    <button type="submit" className="btn-primary mt-4" disabled={loading}>
                        {loading ? "Logging In..." : "Login"}
                    </button>

                    <p className="text-[13px] text-slate-800 mt-3">
                        Don't have an account?{" "}
                        <Link className="font-medium text-primary underline" to="/signUp">
                            Sign Up
                        </Link>
                    </p>
                </form>
            </div>
        </AuthLayout>
    );
};

export default Login;
