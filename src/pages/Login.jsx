import { useForm } from 'react-hook-form';
import axios from 'axios';
import { API_URL } from '../utils/constants';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addUser } from '../reducers/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { ColorRing } from 'react-loader-spinner';
import LOGO from '../assets/images/logo.webp';
import { MdKeyboardArrowRight, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { triggerToast } from '../utils/helper';

const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const onSubmit = async (data) => {
        try {
            const response = await axios(`${API_URL}admin/signin`, {
                method: "POST",
                data,
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            });

            if (response.status === 200) {
                dispatch(addUser(response.data));

                triggerToast('Login successful', 'success');

                navigate('/', { replace: true });
            }
        } catch (error) {
            console.log(error.response.data.error);

            triggerToast(error.response.data.error, 'error');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 flex flex-col items-center">
                <img src={LOGO} className="w-28 mb-6" alt="Logo" />
                <h4 className="text-gray-900 font-semibold text-2xl mb-8">Sign In</h4>
                <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
                    <label htmlFor="email" className="block">
                        <span className="text-gray-700 font-medium text-sm">Email</span>
                        <input
                            type="email"
                            id="email"
                            {...register('email', { required: 'Email is required', })}
                            className="w-full py-2 px-4 mt-2 text-sm bg-gray-50 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                            placeholder="Enter Email"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email?.message}</p>}
                    </label>

                    <label htmlFor="Password" className="block">
                        <span className="text-gray-700 font-medium text-sm">Password</span>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="Password"
                                {...register('password', { required: 'Password is required', })}
                                className="w-full py-2 px-4 mt-2 text-sm bg-gray-50 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                                placeholder="***********"
                            />
                            <button type="button" onClick={togglePasswordVisibility} className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500">
                                {showPassword ? <MdVisibilityOff size="1.3em" /> : <MdVisibility size="1.3em" />}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password?.message}</p>}
                    </label>

                    <div className="text-right">
                        <Link to="/forget-password" className="text-blue-600 text-xs hover:underline">Forget Password?</Link>
                    </div>

                    <button type="submit" disabled={isSubmitting} className="w-full py-2 mt-2 text-base font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-60 flex items-center justify-center">
                        {isSubmitting ?
                            <ColorRing
                                visible={true}
                                height="24"
                                width="24"
                                colors={['#8484c1', "#8484c1", "#8484c1", "#8484c1", "#8484c1"]}
                                wrapperStyle={{ margin: "0 auto" }}
                            />
                            :
                            <>Sign In <MdKeyboardArrowRight className="ml-2 text-lg" /></>
                        }
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;