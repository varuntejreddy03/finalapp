import React, { useState, useContext } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import { validateEmail } from "../../utils/helper";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import uploadImage from "../../utils/uploadImage";
import toast from "react-hot-toast";

const SignUp = () => {
    const [profilePic, setProfilePic] = useState(null);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        
        // --- Form Validation ---
        if (!firstName || !lastName || !validateEmail(email) || !phone || !password) {
            setError("Please fill all fields correctly.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setError("");
        setLoading(true);

        try {
            let profileImageUrl = "";
            if (profilePic) {
                const imgUploadRes = await uploadImage(profilePic);
                profileImageUrl = imgUploadRes.imageUrl || "";
            }

            // --- API Call to Send OTP ---
            const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
                firstName,
                lastName,
                email,
                phone,
                password,
                profileImageUrl
            });

            toast.success(response.data.message);
            // Navigate to the OTP verification page, passing the email in the state
            navigate("/verify-otp", { state: { email: email } });

        } catch (error) {
            const errorMessage = error.response?.data?.message || "An error occurred while signing up.";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">
                <h3 className="text-xl font-semibold text-black">Create an Account</h3>
                <p className="text-xs text-slate-700 mt-[5px] mb-6">
                    Join us and start tracking your expenses and income with ease.
                </p>

                <form onSubmit={handleSignUp}>
                    <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input value={firstName} onChange={({ target }) => setFirstName(target.value)} label="First Name" placeholder="John" type="text" />
                        <Input value={lastName} onChange={({ target }) => setLastName(target.value)} label="Last Name" placeholder="Doe" type="text" />
                        <Input value={email} onChange={({ target }) => setEmail(target.value)} label="Email Address" placeholder="john@example.com" type="text" />
                        <Input value={phone} onChange={({ target }) => setPhone(target.value)} label="Phone Number" placeholder="+1234567890" type="number" />
                        <Input value={password} onChange={({ target }) => setPassword(target.value)} label="Enter Password" placeholder="********" type="password" />
                        <Input value={confirmPassword} onChange={({ target }) => setConfirmPassword(target.value)} label="Confirm Password" placeholder="********" type="password" />
                    </div>

                    {error && <p className="text-red-500 text-xs pt-2.5">{error}</p>}

                    <button type="submit" className="btn-primary mt-4" disabled={loading}>
                        {loading ? "Sending OTP..." : "Sign Up"}
                    </button>

                    <p className="text-[13px] text-slate-800 mt-3">
                        Already a user?{" "}
                        <Link className="font-medium text-primary underline" to="/login">
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </AuthLayout>
    )
}

export default SignUp;
