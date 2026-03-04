'use client'

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Modal, Input, message, Spin, Button } from 'antd';
import { useAuth } from '@/app/store/useAuth';
import { colors } from '@/app/constants/colors';
import { colorForNote } from '@/app/utils/color';
import { useFavorite } from '@/app/store/useFavorite';
import { useNote } from '@/app/store/useNote';
import CardNote from '@/app/components/CardNote';

export default function NoteDetailPage() {
    const params = useParams();
    const slug = decodeURIComponent(params?.slug ?? '')
    const router = useRouter();

    const { token, isAuthenticated } = useAuth();
    const loggedIn = isAuthenticated?.() ?? !!token

    const loadFavoriteIds = useFavorite(s => s.loadIds)

    const { detail: note, loadDetail, clearDetail, loading, error } = useNote();

    const [ needPassword, setNeedPassword ] = useState(false);
    const [ password, setPassword ] = useState('');
    const [ passwordHint, setPasswordHint ] = useState('');
    const [ passError, setPassError ] = useState('');
    const [ submitting, setSubmitting ] = useState(false);
    const [ showHint, setShowHint ] = useState(false);
    
    useEffect(() => {
        if (!loggedIn) router.replace('/?auth=1')
        
    }, [loggedIn, router]);

    useEffect(() => {
        if (token) loadFavoriteIds().catch(() => {})
    }, [token, loadFavoriteIds]);

    useEffect(() => {
        if (!loggedIn || !slug) return
        loadDetail(slug).then(res => {
            if (!res.success && /Password/i.test(res.error)) {
                setNeedPassword(true)
            }
        })
        return () => clearDetail();

    }, [slug, loggedIn, loadDetail, clearDetail]);

    const bg = useMemo(() => colorForNote(note || {}, colors), [note])

    const handleSubmitPassword = async () => {
        if (!password.trim()) return message.warning("Enter Password")
        setSubmitting(true);

        try {
            const res =  await loadDetail(slug, password.trim());

            if (res.success) {
                setPassword('')
                setNeedPassword(false)
                setPassError('')
                setShowHint(false)
                setPasswordHint('')
            
            } else {
                setNeedPassword(true)

                if (/Invalid|Wrong/i.test(res.error)){
                    setPassError('Password Invalid, please try again.')
                }

                const hinted = res?.password_hint || res?.data?.password_hint || note?.password_hint || ''
                setPasswordHint(hinted || '')
                setShowHint(!!hinted)
            }

        } catch (error) {
            console.error(error)

        } finally {
            setSubmitting(false)
        }
    }

    if (!loggedIn) return null

    if (loading && !needPassword) {
        return (
            <div className='py-10 text-center text-sm text-neutral-500'>
                <Spin />
            </div>
        )
    }

    if (error && !needPassword) {
        return (
            <div className='py-10 text-center text-sm text-red-500'>
                {error}
            </div>
        )
    }

    return (
        <>
            <div className='max-w-3xl mx-auto'>
                {note && (
                    <CardNote 
                        note={note}
                        bg={bg}
                        showPrivateIcon
                    />
                )}
            </div>

            <Modal
                open={needPassword}
                title={<span className='text-lg font-semibold'>Enter Password</span>}
                mask={{ closable: false }}
                closable={false}
                keyboard={false}
                onCancel={() => {}}
                footer= {[
                    <Button key='back' onClick={() => router.back()}>
                        Back
                    </Button>,

                    <Button
                        key='submit'
                        type='primary'
                        loading={submitting}
                        onClick={handleSubmitPassword}
                    >
                        Open
                    </Button>
                ]}
                centered
                width={420}            
            >
                {passError && (
                    <div className='text-sm text-red-500 mb-2'>
                        {passError}
                    </div>
                )}

                <Input.Password
                    placeholder='Password'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onPressEnter={handleSubmitPassword}
                    status={passError ? 'error' : ''}
                />

                {showHint && passwordHint ? (
                    <p className='text-xs text-neutral-600 mt-2'>
                        <span className='font-medium'>Hint: </span> {passwordHint}
                    </p>
                ) : null}

            </Modal>
        </>
    )
}