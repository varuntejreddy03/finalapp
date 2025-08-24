import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../../components/layouts/AuthLayout';
import Input from '../../components/Inputs/Input';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';
import toast from 'react-hot-toast';

const VerifyOTP = () => {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();
    const { updateUser } = useContext(UserContext);

    // Get the email from the state passed by the SignUp page
    const email = location.state?.email;

    // Redirect if email is not available (e.g., direct navigation to this page)
    useEffect(() => {
        if (!email) {
            toast.error("Please sign up first.");
            navigate('/signup');
        }
    }, [email, navigate]);

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        if (!otp || otp.length !== 6) {
            setError("Please enter a valid 6-digit OTP.");
            return;
        }
        setError('');
        setLoading(true);

        try {
            const response = await axiosInstance.post(API_PATHS.AUTH.VERIFY_OTP, {
                email,
                otp,
            });

            const { token, user } = response.data;
            if (token) {
                localStorage.setItem("token", token);
                updateUser(user);
                toast.success("Account created successfully!");
                navigate("/dashboard");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "An error occurred during verification.";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">
                <h3 className="text-xl font-semibold text-black">Verify Your Account</h3>
                <p className="text-xs text-slate-700 mt-[5px] mb-6">
                    An OTP has been sent to <strong>{email}</strong>. Please enter it below.
                </p>

                <form onSubmit={handleVerifyOTP}>
                    <Input
                        value={otp}
                        onChange={({ target }) => setOtp(target.value)}
                        label="Enter 6-Digit OTP"
                        placeholder="123456"
                        type="number"
                    />

                    {error && <p className="text-red-500 text-xs pt-2.5">{error}</p>}

                    <button type="submit" className="btn-primary mt-4" disabled={loading}>
                        {loading ? "Verifying..." : "Verify & Create Account"}
                    </button>

                    <p className="text-[13px] text-slate-800 mt-3">
                        Didn't receive an OTP?{" "}
                        <Link className="font-medium text-primary underline" to="/signup">
                            Go back to Sign Up
                        </Link>
                    </p>
                </form>
            </div>
        </AuthLayout>
    );
};

export default VerifyOTP;
