import React, { useState, useEffect, useRef } from 'react';
import { Modal, Input, Avatar, Button, Form, message } from 'antd';
import { useAuth } from '@/app/store/useAuth';
import { imgUrl } from '@/app/lib/url';

const PLACEHOLDER_THUMBNAIL = '/assets/thumbnail.jpeg'
const PLACEHOLDER_PROFILE = '/assets/profile.jpg'

export const EditProfileModal = ( { open, onClose }) => {
    const { user, updateProfile } = useAuth();

    const [ saving, setSaving ] = useState(false);
    const [ profileFile, setProfileFile ] = useState(null);
    const [ thumbnailFile, setThumbnailFile ] = useState(null);

    const [ profilePreview, setProfilePreview ] = useState(
        user?.profile_img ? imgUrl(user?.profile_img) : PLACEHOLDER_PROFILE
    );
    
    const [ thumbnailPreview, setThumbnailPreview ] = useState(
        user?.thumbnail_img ? imgUrl(user?.thumbnail_img) : PLACEHOLDER_THUMBNAIL
    );

    const profileInputRef = useRef(null);
    const thumbnailInputRef = useRef(null);

    useEffect(() => {
        if(!profileFile) {
            setProfilePreview(user?.profile_img ? imgUrl(user?.profile_img) : PLACEHOLDER_PROFILE);
        }
        if(!thumbnailFile) {
            setThumbnailPreview(user?.thumbnail_img ? imgUrl(user?.thumbnail_img) : PLACEHOLDER_THUMBNAIL);
        }
    }, [user])

    useEffect(() => {
        if(!profileFile) return;
        const url = URL.createObjectURL(profileFile);
        setProfilePreview(url);
        return () => URL.revokeObjectURL(url);
    }, [profileFile])

    useEffect(() => {
        if(!thumbnailFile) return;
        const url = URL.createObjectURL(thumbnailFile);
        setThumbnailPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [thumbnailFile])

    const onPickImg = (setter) => (e) => {
        const f = e.target.files?.[0];
        if(!f) return;
        if(!/image\/(png|jpe?g|gif)/i.test(f.type)) {
            message.warning("Please select a valid image file (jpg, jpeg, png, gif)");
            e.target.value = '';
            return;
        }
        setter(f);
    }

    const openProfilePicker = () => {
        if(profileInputRef.current) {
            profileInputRef.current.value = '';
            profileInputRef.current.click();
        }
    }

    const openThumbnailPicker = () => {
        if(thumbnailInputRef.current) {
            thumbnailInputRef.current.value = '';
            thumbnailInputRef.current.click();
        }
    }

    const handleFinish = async (values) => {
        try {
            setSaving(true);
            
            const { success, error } = await updateProfile(values, { 
                profile_img: profileFile,
                thumbnail_img: thumbnailFile
            });

            setSaving(false);
            if(!success) throw new Error(error || "Failed to update profile");
            message.success("Profile updated successfully");
            onClose?.();

        } catch (error) {
            setSaving(false);
            message.error(error?.message || "Failed to update profile");
        }
    }

    const formKey = `${user?.id || 'nouser'}-${open ? 'open' : 'closed'}`;

    return (
    <Modal
        title={<span className='text-xl font-semibold'> Let's Update Your Profile</span>}
        open={open}
        onCancel={onClose}
        confirmLoading={saving}
        okText="Submit"
        centered
        width={640}
        className='!rounded-2xl'
        styles={{ content: { borderRadius: 16}, body: {paddingTop: 8} }}
        okButtonProps={{ form: "editProfileForm", htmlType: "submit" }}
    >
        <div className='relative rounded-2xl overflow-hidden border border-neutral-200'>
            <img 
                src={thumbnailPreview || undefined}
                onError={(e) => e.currentTarget.src = PLACEHOLDER_THUMBNAIL}
                alt='thumbnail'
                className='h-56 w-full object-cover'
            />
        </div>

        <div className='mt-4 flex items-center gap-4'>
            <Avatar src={profilePreview || undefined} size={84} />
            <div className='flex flex-wrap gap-3'>
                <input ref={profileInputRef} type="file" accept='image/png, image/jpeg, image/jpg, image/gif' className='hidden' onChange={onPickImg(setProfileFile)} />
                <Button className='!h-10 !rounded-full !px-4 border-(--secondary-color) !text-(--secondary-color)' onClick={openProfilePicker}>Upload Profile</Button>

                <input ref={thumbnailInputRef} type="file" accept='image/png, image/jpeg, image/jpg, image/gif' className='hidden' onChange={onPickImg(setThumbnailFile)} />
                <Button className='!h-10 !rounded-full !px-4 border-(--secondary-color) !text-(--secondary-color)' onClick={openThumbnailPicker}>Upload Thumbnail</Button>  
            </div>
        </div>

        <Form
            id="editProfileForm"
            key={formKey}
            layout='vertical'
            className='!mt-6'
            requiredMark={false}
            preserve={false}
            initialValues={{
                username: user?.username || '',
                email: user?.email || ''
            }}

            onFinish={handleFinish}
        >
            <Form.Item name='username' rules={[{ required: true, message: "Name is required"}]} >
                <Input placeholder='Full Name' className='!h-12 !rounded-2xl' maxLength={50} />
            </Form.Item>

            <Form.Item name='email' rules={[
                { required: true, message: "Email is required"},
                { type: 'email', message: "Please enter a valid email"}    
            ]} >
                <Input placeholder='email@example.com' className='!h-12 !rounded-2xl' />
            </Form.Item>

        </Form>

    </Modal>
    ) 
}
