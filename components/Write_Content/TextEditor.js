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
    java: langJava,
  };

  const aliases = {
    ts: 'typescript',
    js: 'javascript',
    'c++': 'cpp',
  };

  return (
    <div data-color-mode={theme} className="w-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md">
      <style jsx global>{`
        /* ─── Remove all unwanted borders and lines ────────────────────────────────── */
        .w-md-editor,
        .w-md-editor-content,
        .wmde-markdown,
        .w-md-editor-toolbar,
        .w-md-editor-content-editor,
        .w-md-editor-content-preview {
          border: none !important;
          box-shadow: none !important;
        }

        /* ─── Toolbar Styling ──────────────────────────────────────────────────────── */
        .w-md-editor-toolbar {
          background-color: var(--color-canvas-default);
          border-bottom: 1px solid var(--color-border-default);
          padding: 8px 12px;
        }
        .w-md-editor-toolbar svg {
          width: 18px !important;
          height: 18px !important;
        }
        .w-md-editor-toolbar > ul > li > button {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          min-width: 32px !important;
          min-height: 32px !important;
          padding: 0 !important;
          margin: 0 2px !important;
          border-radius: 6px !important;
          border: none !important;
        }
        .w-md-editor-toolbar > ul > li > button:hover {
          background-color: var(--color-neutral-muted) !important;
        }

        /* ─── Editor Container ─────────────────────────────────────────────────────── */
        .w-md-editor {
          box-shadow: none !important;
          border: none !important;
        }
        .w-md-editor-content {
          min-height: 300px;
          padding: 0 !important;
          border: none !important;
        }
        .w-md-editor-content-editor,
        .w-md-editor-content-preview {
          border: none !important;
        }

        /* ─── Markdown Preview Content ─────────────────────────────────────────────── */
        .wmde-markdown {
          padding: 20px !important;
          line-height: 1.5;
          font-size: 15px;
          color: var(--color-fg-default);
          background-color: transparent !important;
          border: none !important;
        }

        /* ─── Typography Hierarchy ─────────────────────────────────────────────────── */
        .wmde-markdown h1 {
          font-size: 1.875rem;
          font-weight: 700;
          margin: 20px 0 8px 0;
          padding-bottom: 0;
          border-bottom: none;
          line-height: 1.25;
        }

        .wmde-markdown h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 18px 0 6px 0;
          padding-bottom: 0;
          border-bottom: none;
          line-height: 1.3;
        }

        .wmde-markdown h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 16px 0 6px 0;
          line-height: 1.35;
        }

        .wmde-markdown h4 {
          font-size: 1.125rem;
          font-weight: 600;
          margin: 14px 0 4px 0;
          line-height: 1.4;
        }

        .wmde-markdown h5,
        .wmde-markdown h6 {
          font-size: 1rem;
          font-weight: 600;
          margin: 12px 0 4px 0;
          line-height: 1.4;
        }

        /* ─── First heading has no top margin ─────────────────────────────────────── */
        .wmde-markdown > h1:first-child,
        .wmde-markdown > h2:first-child,
        .wmde-markdown > h3:first-child,
        .wmde-markdown > h4:first-child,
        .wmde-markdown > h5:first-child,
        .wmde-markdown > h6:first-child {
          margin-top: 0 !important;
        }

        /* ─── Paragraphs ───────────────────────────────────────────────────────────── */
        .wmde-markdown p {
          margin: 10px 0;
          line-height: 1.5;
        }

        .wmde-markdown > p:first-child {
          margin-top: 0;
        }

        .wmde-markdown > p:last-child {
          margin-bottom: 0;
        }

        /* ─── Lists ───────────────────────────────────────────────────────────────── */
        .wmde-markdown ul,
        .wmde-markdown ol {
          margin: 12px 0;
          padding-left: 20px;
        }

        .wmde-markdown li {
          margin: 2px 0;
          line-height: 1.5;
        }

        .wmde-markdown li > p {
          margin: 4px 0;
        }

        /* ─── Nested lists ─────────────────────────────────────────────────────────── */
        .wmde-markdown ul ul,
        .wmde-markdown ol ol,
        .wmde-markdown ul ol,
        .wmde-markdown ol ul {
          margin: 4px 0;
        }

        /* ─── Blockquotes ──────────────────────────────────────────────────────────── */
        .wmde-markdown blockquote {
          margin: 16px 0;
          padding: 12px 16px;
          border-left: 4px solid var(--color-accent-emphasis);
          background-color: var(--color-canvas-subtle);
          border-radius: 0 6px 6px 0;
        }

        .wmde-markdown blockquote p {
          margin: 6px 0;
        }

        .wmde-markdown blockquote > p:first-child {
          margin-top: 0;
        }

        .wmde-markdown blockquote > p:last-child {
          margin-bottom: 0;
        }

        /* ─── Code Blocks ──────────────────────────────────────────────────────────── */
        .wmde-markdown pre {
          margin: 16px 0;
          padding: 14px;
          background-color: #282a36 !important;
          border-radius: 6px;
          font-size: 14px;
          line-height: 1.4;
          overflow-x: auto;
          border: 1px solid var(--color-border-default);
        }

        .wmde-markdown pre code {
          background-color: transparent !important;
          padding: 0 !important;
          border-radius: 0 !important;
          font-size: inherit;
          color: inherit;
        }

        /* ─── Inline Code ──────────────────────────────────────────────────────────── */
        .wmde-markdown code {
          background-color: var(--color-neutral-muted);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 14px;
          font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
          border: 1px solid var(--color-border-default);
        }

        /* ─── Tables ───────────────────────────────────────────────────────────────── */
        .wmde-markdown table {
          margin: 16px 0;
          border-collapse: collapse;
          width: 100%;
          border: 1px solid var(--color-border-default);
          border-radius: 6px;
          overflow: hidden;
        }

        .wmde-markdown th {
          background-color: var(--color-canvas-subtle);
          padding: 10px 12px;
          border-bottom: 2px solid var(--color-border-default);
          border-right: 1px solid var(--color-border-default);
          font-weight: 600;
          text-align: left;
        }

        .wmde-markdown td {
          padding: 8px 12px;
          border-bottom: 1px solid var(--color-border-muted);
          border-right: 1px solid var(--color-border-muted);
        }

        .wmde-markdown th:last-child,
        .wmde-markdown td:last-child {
          border-right: none;
        }

        .wmde-markdown tr:last-child td {
          border-bottom: none;
        }

        /* ─── Horizontal Rules ─────────────────────────────────────────────────────── */
        .wmde-markdown hr {
          margin: 24px 0;
          border: none;
          height: 1px;
          background-color: var(--color-border-default);
          border-radius: 1px;
        }

        /* ─── Images ───────────────────────────────────────────────────────────────── */
        .wmde-markdown img {
          max-width: 100%;
          height: auto;
          margin: 12px 0;
          border-radius: 6px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        /* ─── Links ────────────────────────────────────────────────────────────────── */
        .wmde-markdown a {
          color: var(--color-accent-fg);
          text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: border-bottom-color 0.2s ease;
        }

        .wmde-markdown a:hover {
          border-bottom-color: var(--color-accent-fg);
        }

        /* ─── Task Lists ───────────────────────────────────────────────────────────── */
        .wmde-markdown .task-list-item {
          list-style: none;
          margin-left: -24px;
          padding-left: 24px;
        }

        .wmde-markdown .task-list-item input[type="checkbox"] {
          margin-right: 8px;
        }

        /* ─── Remove any remaining borders and lines ───────────────────────────────── */
        .wmde-markdown * {
          border-image: none !important;
        }

        /* ─── Dark mode adjustments ───────────────────────────────────────────────── */
        [data-color-mode="dark"] .wmde-markdown code {
          background-color: rgba(110, 118, 129, 0.4);
          border-color: rgba(240, 246, 252, 0.1);
        }

        [data-color-mode="dark"] .wmde-markdown blockquote {
          background-color: rgba(110, 118, 129, 0.1);
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
            [
              rehypeHighlight,
              {
                ignoreMissing: true,
                languages,
                aliases,
              },
            ],
          ],
        }}
      />
    </div>
  );
}