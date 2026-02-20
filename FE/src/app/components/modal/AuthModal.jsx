"use client"
import React, { useState, useEffect } from 'react';
import { Modal, Tabs, Form, Input, Button, message } from 'antd';
import { useAuth } from '@/app/store/useAuth';

export const AuthModal = ({ open, onClose }) => {

    const { login, register, loading } = useAuth();
    const [tab, setTab] = useState('login');
    const formKey = open ? 'open' : 'closed';

    useEffect(() => {
        if(!open) setTab('login');
    }, [open]);

    async function onFinishRegister(values) {
        const payload = {
            username: values.username,
            email: values.email,
            password: values.password,
        }

        const { success, error } = await register(payload);
        if(!success) return message.error(error || "Registration failed");
        message.success("Registered successfully. Please login.");

        setTab('login');
    }

    async function onFinishLogin(values) {
        const { success, error } = await login({username: values.username, password: values.password});
        if(!success) return message.error(error || "Login failed");
        message.success("Logged in successfully");

        onClose?.();
    }

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            centered
            width={560}
            title={<span className='text-xl font-semibold'>Welcome to NoteX</span>}
        > 
            <Tabs
                activeKey={tab}
                onChange={setTab}
                items={[
                    {
                        key: 'login',
                        label: 'Login',
                        children: (
                            <Form
                                key={`login-${formKey}`}
                                layout='vertical'
                                onFinish={onFinishLogin}
                                preserve={false}
                            >
                                <Form.Item name="username" label="Username">
                                    <Input placeholder='John' autoComplete='username' />
                                </Form.Item>

                                <Form.Item name="password" label="Password">
                                    <Input.Password placeholder='********' autoComplete='current-password' />
                                </Form.Item>

                                <Button
                                    type='primary'
                                    htmlType='submit'
                                    className='bg-(--secondary-color)'
                                    block
                                >
                                    Login
                                </Button>
                            </Form>
                        )
                    },
                    {
                        key: 'register',
                        label: 'Register',
                        children: (
                            <Form
                                key={`register-${formKey}`}
                                layout='vertical'
                                onFinish={onFinishRegister}
                                preserve={false}
                            >
                                <Form.Item name="username" label="Username">
                                    <Input placeholder='John' autoComplete='username' />
                                </Form.Item>

                                <Form.Item name="email" label="Email">
                                    <Input placeholder='email@example.com' autoComplete='email' />
                                </Form.Item>

                                <Form.Item name="password" label="Password">
                                    <Input.Password placeholder='min 6 Char' autoComplete='new-password' />
                                </Form.Item>

                                <Button
                                    type='primary'
                                    htmlType='submit'
                                    className='bg-(--secondary-color)'
                                    block
                                >
                                    Register
                                </Button>
                            </Form>
                        )
                    }
                ]}
            >
            </Tabs>
        </Modal>
    )   
}