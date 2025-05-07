"use client"
import CreateBlog from '@/components/Write_Content/CreateBlog'
import DragDrop from '@/components/Write_Content/DragDrop'
import React from 'react'


const write = () => {
    return (
        <div className='p-8 dark:bg-gray-900'>
            <DragDrop />
            <CreateBlog />
        </div>
    )
}

export default write


