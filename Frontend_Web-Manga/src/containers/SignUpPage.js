import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';

import * as UserService from '../services/UserService.js'
import { useEffect, useState } from 'react';
import { useMutationHooks } from '../hooks/useMutationHook.js';
import Loading from '../components/Loading/Loading.js'
import { useNavigate } from 'react-router-dom';
import * as message from "../components/Message/Message.js";

function SignUpPage() {
    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const mutation = useMutationHooks(
        data => UserService.signUpUser(data)
    )

    const { data, isSuccess, isError } = mutation
    const isLoading = mutation.isPending

    useEffect(() => {
        if (isSuccess) {
            message.success()
            handleNavigateSignIn()
        }
        else if (isError) {
            message.error()
        }
    }, [isSuccess, isError])

    const handleOnChangeName = (value) => {
        setName(value)
    }
    const handleOnChangePhone = (value) => {
        setPhone(value)
    }
    const handleOnChangeEmail = (value) => {
        setEmail(value)
    }
    const handleOnChangePassword = (value) => {
        setPassword(value)
    }
    const handleOnChangeConfirmPassword = (value) => {
        setConfirmPassword(value)
    }
    const handleSignUp = () => {
        mutation.mutate({
            name,
            phone,
            email,
            password,
            confirmPassword
        })
    }
    const handleNavigateSignIn = () => {
        navigate('/signin')
    }

    const isFormValid = name !== '' && phone !== '' && email !== '' && password !== '' && confirmPassword !== ''

    return (
        <div className="container signin-up">
            <div className="row justify-content-center">
                <div className="card form-signin-up col-11 col-xs-12 col-sm-10 col-md-8 col-lg-6">
                    <div className="card-body">
                        <div className="header">
                            <h1 className="fs-5">Sign Up</h1>
                        </div>
                        <div className="body">
                            <div className="form-floating mb-3">
                                <input type="name" className="form-control" id="name" placeholder="name@example.com" value={name} onChange={(e) => handleOnChangeName(e.target.value)} />
                                <label htmlFor="signUpName">Name</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="phone" className="form-control" id="phone" placeholder="name@example.com" value={phone} onChange={(e) => handleOnChangePhone(e.target.value)} />
                                <label htmlFor="phone">Phone</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="email" className="form-control" id="email" placeholder="name@example.com" value={email} onChange={(e) => handleOnChangeEmail(e.target.value)} />
                                <label htmlFor="email">Email address</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="password" className="form-control" id="password" placeholder="password" value={password} onChange={(e) => handleOnChangePassword(e.target.value)} />
                                <label htmlFor="password">Password</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="password" className="form-control" id="confirmPassword" placeholder="name@example.com" value={confirmPassword} onChange={(e) => handleOnChangeConfirmPassword(e.target.value)} />
                                <label htmlFor="confirmPassword">Confirm password</label>
                            </div>
                            {data?.status === 'ERR' && <span style={{ color: 'red' }}>{data?.message}</span>}
                            <span>You already have an account?</span>
                            <span className="text-muted label-signinup" onClick={handleNavigateSignIn}>
                                Sign In
                            </span>
                        </div>
                        <Loading isLoading={isLoading}>
                            <button type="button" className="btn btn-primary" onClick={handleSignUp} disabled={!isFormValid}>
                                Sign Up
                            </button>
                        </Loading>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default SignUpPage