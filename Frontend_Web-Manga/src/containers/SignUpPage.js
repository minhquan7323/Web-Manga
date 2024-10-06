import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';

import * as UserService from '../services/UserService.js'
import { useState } from 'react';
import { useMutationHooks } from '../hooks/useMutationHook.js';
import Loading from '../components/Loading/Loading.js'

function SignUpPage() {
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const mutation = useMutationHooks(
        data => UserService.signUpUser(data)
    )

    const { data } = mutation
    const isLoading = mutation.isPending

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
    return (
        <div className="modal fade user-backdrop" id="signUpModal" data-bs-backdrop="false" data-bs-keyboard="true" tabIndex="-1" aria-labelledby="signUpModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="signUpModalLabel">Sign Up</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
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
                        <p className="text-muted">
                            <span href="#" className='label-signinup' data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target="#signInModal" >
                                Sign In
                            </span>
                        </p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                            Close
                        </button>
                        <Loading isLoading={isLoading}>
                            <button type="button" className="btn btn-primary" onClick={handleSignUp}>
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