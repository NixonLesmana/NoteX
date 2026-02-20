import React from 'react'
import { Card } from "antd";
import { Avatar, Tooltip } from 'antd';
import { RiLockLine, RiStarSFill, RiShareForwardFill, RiUser3Line } from 'react-icons/ri';
import { formatDate } from '../utils/formatDate';
import { imgUrl } from '../lib/url';

const CardNote = ({ note, bg }) => {
    const isPrivateLike = note?.status === "private" || note?.status === "protected"
    const author = note?.user?.username || "Anonymous"
    const date = formatDate(note?.created_at)
    const cardBg = bg || 'var(--secondary-light-color)'

    return (
        <div className='relative'>
            <Card
                className='note-card !border !rounded-2xl cursor-pointer'
                style={{ background: cardBg }}
                styles={{ body: {padding: 16} }}
                hoverable
                tabIndex={0}
                aria-label={note?.title || note?.title !== "Untitled Note" ? `Note titled ${note?.title}` : "Note"}
            >
                {note?.title !== "Untitled Note" &&(
                    <h3 className='font-semibold mb-2 text-neutral-800 text-xl sm:text-base'>
                        {note?.title}
                    </h3>
                )}

                <div
                    className="text-sm text-neutral-800 font-normal break-words"
                    dangerouslySetInnerHTML={{ __html: note?.content }}
                />
                
                <div className='flex flex-row justify-between gap-3 mt-4'>
                    <div className='flex items-center gap-3'>
                        {note?.user?.profile_img
                        ?    
                        <Avatar
                            src={imgUrl(note?.user?.profile_img) || undefined}
                            alt='image user'
                            width={38}
                            className='shrink-0'
                        />
                        :
                        <Avatar
                            src={<RiUser3Line className='text-neutral-800'/>}
                            alt='image user'
                            width={28}
                            className='shrink-0'
                        />
                        }

                        <div className='flex flex-col'>
                            <h4 className='text-base font-semibold truncate'>{note?.user?.username}</h4>
                            <p className='text-xs font-normal'>{date}</p>
                        </div>
                    </div>

                    <div className='flex items-center gap-3'>
                        <Tooltip title={"Private"}>
                            <RiLockLine size={25} className='text-neutral-600'/>
                        </Tooltip>

                        <Tooltip title={"Favorite"}>
                            <RiStarSFill size={25} className='text-neutral-600'/>
                        </Tooltip>

                        <Tooltip title={"Share"}>
                            <RiShareForwardFill size={27} className='text-neutral-600'/>
                        </Tooltip>                      
                    </div>
                </div>
            </Card>            
        </div>
    )
}

export default CardNote