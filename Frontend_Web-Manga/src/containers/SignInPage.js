import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';

import * as UserService from '../services/UserService.js'
import { useEffect, useState } from 'react';
import { useMutationHooks } from '../hooks/useMutationHook.js';
import Loading from '../components/Loading/Loading.js'
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { useDispatch } from 'react-redux'
import { updateUser } from '../redux/userSlide.js';


function SignInPage() {
    const navigate = useNavigate()

    const dispatch = useDispatch()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const mutation = useMutationHooks(
        data => UserService.signInUser(data)
    )

    const { data, isSuccess } = mutation
    const isLoading = mutation.isPending

    useEffect(() => {
        if (isSuccess) {
            navigate('/')
            localStorage.setItem('access_token', data?.access_token)
            if (data?.access_token) {
                const decoded = jwtDecode(data?.access_token)
                if (decoded?.id) {
                    handleGetDetailsUser(decoded?.id, data?.access_token)
                }
            }
        }
    }, [isSuccess])

    const handleGetDetailsUser = async (id, access_token) => {
        const res = await UserService.getDetailsUser(id, access_token)
        dispatch(updateUser({ ...res?.data, access_token: access_token }))
    }

    const handleOnChangeEmail = (value) => {
        setEmail(value)
    }
    const handleOnChangePassword = (value) => {
        setPassword(value)
    }
    const handleSignIn = () => {
        mutation.mutate({
            email,
            password
        })
    }

    const handleNavigateSignUp = () => {
        navigate('/signup')
    }

    const isFormValid = email !== '' && password !== ''

    return (
        <>
            <div className="container signin-up">
                <div className="row justify-content-center">
                    <div className="card form-signin-up col-11 col-xs-12 col-sm-10 col-md-8 col-lg-6">
                        <div className="card-body">
                            <div className="header">
                                <h1 className="fs-5">Sign In</h1>
                            </div>
                            <div className="body">
                                <div className="form-floating mb-3">
                                    <input type="email" className="form-control" id="email" placeholder="name@example.com" value={email} onChange={(e) => handleOnChangeEmail(e.target.value)} required />
                                    <label htmlFor="email">Email address</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="password" className="form-control" id="password" placeholder="Password" value={password} onChange={(e) => handleOnChangePassword(e.target.value)} required />
                                    <label htmlFor="password">Password</label>
                                </div>
                                {data?.status === 'ERR' && <span style={{ color: 'red' }}>{data?.message}</span>}
                                <p className="text-muted">Forget password?</p>
                                <span>Don't have an account?</span>
                                <span className="text-muted label-signinup" onClick={handleNavigateSignUp}>
                                    Sign Up
                                </span>
                            </div>
                            <Loading isLoading={isLoading}>
                                <button type="button" className="btn btn-primary" onClick={handleSignIn} disabled={!isFormValid}>
                                    Sign In
                                </button>
                            </Loading>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SignInPage;
