"use client";
import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

export default function DragDrop(props) {
    const [images, setImages] = useState([]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.svg', '.webp']
        },
        onDrop: (acceptedFiles) => {
            const newImages = acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            }));
            setImages(newImages);
        }
    });

    useEffect(() => {
        return () => {
            images.forEach(image => URL.revokeObjectURL(image.preview));
        };
    }, [images]);

    return (
        <div className="w-full max-w-2xl mx-auto mb-6 font-lato">
            <div className="w-full relative pb-[56.25%]">
                <div
                    {...getRootProps({
                        className: `absolute inset-0 dropzone border-2 border-dashed ${isDragActive ? 'border-blue-500' : 'border-gray-300 dark:border-gray-700'} rounded-lg cursor-pointer transition-colors hover:border-gray-400 dark:hover:border-gray-600 bg-white dark:bg-gray-900 overflow-hidden`
                    })}
                >
                    <input {...getInputProps()} />

                    {images.length > 0 ? (
                        <div className="w-full h-full">
                            <img
                                src={images[0].preview}
                                alt={images[0].name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center h-full p-4">
                            <svg
                                className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                ></path>
                            </svg>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">Drop image here or click to select</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">JPG, PNG, GIF (max 2MB)</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
