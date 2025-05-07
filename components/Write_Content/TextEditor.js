"use client"

import dynamic from 'next/dynamic';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import 'highlight.js/styles/atom-one-dark.css';
import rehypeHighlight from 'rehype-highlight';
import { useContext } from 'react';
import { ThemeContext } from '@/app/Providers/ThemeProvider';

import langTypescript from 'highlight.js/lib/languages/typescript';
import langJavascript from 'highlight.js/lib/languages/javascript';
import langBash from 'highlight.js/lib/languages/bash';
import langCpp from 'highlight.js/lib/languages/cpp';
import langJava from 'highlight.js/lib/languages/java';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

export default function TextEditor({ value, onChange }) {
    const { theme } = useContext(ThemeContext);

    const languages = {
        typescript: langTypescript,
        javascript: langJavascript,
        bash: langBash,
        cpp: langCpp,
        java: langJava
    };

    const aliases = {
        ts: 'typescript',
        js: 'javascript',
        'c++': 'cpp'
    };

    return (
        <div data-color-mode={theme} className="w-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md">
            <style jsx global>{`
                .w-md-editor-toolbar {
                    background-color: var(--color-canvas-default);
                    border-bottom: 1px solid var(--color-border-default);
                    padding: 0.5rem;
                }
                
                .w-md-editor-toolbar svg {
                    width: 1.1rem !important;
                    height: 1.1rem !important;
                }
                
                .w-md-editor-toolbar > ul > li > button {
                    padding: 0.2rem !important;
                    margin: 0 0.25rem !important;
                    border-radius: 0.375rem !important;
                }
                
                .w-md-editor-toolbar > ul > li > button:hover {
                    background-color: var(--color-neutral-muted) !important;
                }
                
                .w-md-editor-content {
                    min-height: 300px;
                }
                
                .w-md-editor {
                    box-shadow: none !important;
                }
                
                .wmde-markdown-color {
                    font-size: 1rem;
                }
            `}</style>
            <MDEditor
                value={value}
                onChange={onChange}
                preview="edit"
                className="w-full"
                height={500}
                previewOptions={{
                    rehypePlugins: [
                        [rehypeHighlight, {
                            ignoreMissing: true,
                            languages,
                            aliases
                        }]
                    ]
                }}
            />
        </div>
    );
}
