import * as UserService from '../services/UserService.js'
import { useEffect, useState } from 'react'
import { useMutationHooks } from '../hooks/useMutationHook.js'
import Loading from '../components/Loading/Loading.js'
import * as message from "../components/Message/Message.js"
import { useSelector, useDispatch } from 'react-redux'
import { updateUser } from '../redux/userSlide.js'
import { getBase64 } from '../utils.js'
import { Button, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

const ProfilePage = () => {
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [avatar, setAvatar] = useState('')
    const [address, setAddress] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const mutation = useMutationHooks(
        async (data) => {
            const { id, access_token, ...rests } = data
            await UserService.updateUser(id, rests, access_token)
        }
    )

    const { data, isSuccess, isError } = mutation

    const isLoading = mutation.isPending
    useEffect(() => {
        if (user) {
            setName(user?.name || '')
            setPhone(user?.phone || '')
            setAvatar(user?.avatar || '')
            setAddress(user?.address || '')
            setEmail(user?.email || '')
            setPassword(user?.password || '')
        }
    }, [user, isSuccess, isError])


    useEffect(() => {
        if (isSuccess) {
            message.success()
            handleGetDetailsUser(user?.id, user?.access_token, dispatch)
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
    const handleOnChangeAvatar = async (info) => {
        const file = info.fileList[0]?.originFileObj
        if (file) {
            const preview = await getBase64(file)
            setAvatar(preview)
        }
    }
    const beforeUpload = (file) => {
        return false
    }
    const handleOnChangeAddress = (value) => {
        setAddress(value)
    }
    const handleOnChangeEmail = (value) => {
        setEmail(value)
    }
    const handleOnChangePassword = (value) => {
        setPassword(value)
    }

    const handleUpdateUser = () => {
        mutation.mutate({
            id: user?.id,
            name,
            phone,
            avatar,
            address,
            email,
            // password,
            access_token: user?.access_token
        })
    }
    const handleGetDetailsUser = async (id, access_token, dispatch) => {
        const res = await UserService.getDetailsUser(id, access_token)
        dispatch(updateUser({ ...res?.data, access_token: access_token }))
    }
    return (
        <>
            <div className="container profile-user" style={{ maxWidth: '100%', margin: '0 auto' }}>
                <div className='row profile-user-box p-0'>
                    <div className="col-12 col-xs-12 col-sm-4 col-md-3 col-lg-3 profile-user-content-block">
                        <div className='profile-user-content-left bg'>
                            <div className='profile-user-content-left-block'>
                                User information
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-xs-12 col-sm-8 col-md-9 col-lg-9 profile-user-content-block">
                        <div className='profile-user-content-right bg'>
                            <div className="row g-2">
                                <div className="form-floating mb-3">
                                    <input type="name" className="form-control" id="name" placeholder="name" value={name} onChange={(e) => handleOnChangeName(e.target.value)} />
                                    <label htmlFor="signUpName">Name</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="phone" className="form-control" id="phone" placeholder="0123123123" value={phone} onChange={(e) => handleOnChangePhone(e.target.value)} />
                                    <label htmlFor="phone">Phone</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="address" className="form-control" id="address" placeholder="123, a, b" value={address} onChange={(e) => handleOnChangeAddress(e.target.value)} />
                                    <label htmlFor="phone">Address</label>
                                </div>
                                <div className="col-6 form-floating mb-3">
                                    <input type="email" className="form-control" id="email" placeholder="name@example.com" value={email} onChange={(e) => handleOnChangeEmail(e.target.value)} disabled />
                                    <label htmlFor="email">Email address</label>
                                </div>
                                <div className="col-6 form-floating mb-3">
                                    <input type="password" className="form-control" id="password" placeholder="password" value={password} onChange={(e) => handleOnChangePassword(e.target.value)} disabled />
                                    <label htmlFor="password">Password</label>
                                </div>
                                <Upload beforeUpload={beforeUpload} onChange={handleOnChangeAvatar} showUploadList={false} maxCount={1}>
                                    <Button icon={<UploadOutlined />}>Select file</Button>
                                </Upload>
                                {avatar && (
                                    <img src={avatar} />
                                )}
                            </div>
                            <Loading isLoading={isLoading}>
                                <div className='item-center'>
                                    <button type="button" className="btn btn-primary" onClick={handleUpdateUser}>
                                        Update
                                    </button>
                                </div>
                            </Loading>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default ProfilePage
