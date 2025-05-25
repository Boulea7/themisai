'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { Components } from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  const components: Components = {
    // 代码块渲染
    code({ inline, className, children, ...props }: React.ComponentProps<'code'> & { inline?: boolean }) {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      
      return !inline && language ? (
        <SyntaxHighlighter
          style={oneDark as any}
          language={language}
          PreTag="div"
          className="rounded-lg !mt-2 !mb-2"
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code 
          className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm font-mono" 
          {...props}
        >
          {children}
        </code>
      );
    },
    // 标题渲染
    h1: ({ children }) => (
      <h1 className="text-xl font-bold text-gray-900 mt-4 mb-2 border-b border-gray-200 pb-1">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-lg font-semibold text-gray-900 mt-3 mb-2">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-base font-semibold text-gray-900 mt-3 mb-1">
        {children}
      </h3>
    ),
    // 段落渲染
    p: ({ children }) => (
      <p className="text-gray-700 leading-relaxed mb-2">
        {children}
      </p>
    ),
    // 列表渲染
    ul: ({ children }) => (
      <ul className="list-disc list-inside text-gray-700 mb-2 space-y-1">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside text-gray-700 mb-2 space-y-1">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="text-gray-700">
        {children}
      </li>
    ),
    // 引用渲染
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 text-gray-700 italic mb-2">
        {children}
      </blockquote>
    ),
    // 表格渲染
    table: ({ children }) => (
      <div className="overflow-x-auto mb-2">
        <table className="min-w-full border border-gray-300 rounded-lg">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-gray-50">
        {children}
      </thead>
    ),
    tbody: ({ children }) => (
      <tbody className="divide-y divide-gray-200">
        {children}
      </tbody>
    ),
    tr: ({ children }) => (
      <tr className="hover:bg-gray-50">
        {children}
      </tr>
    ),
    th: ({ children }) => (
      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-300">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
        {children}
      </td>
    ),
    // 链接渲染
    a: ({ children, href }) => (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 underline"
      >
        {children}
      </a>
    ),
    // 强调渲染
    strong: ({ children }) => (
      <strong className="font-semibold text-gray-900">
        {children}
      </strong>
    ),
    em: ({ children }) => (
      <em className="italic text-gray-700">
        {children}
      </em>
    ),
    // 分割线渲染
    hr: () => (
      <hr className="border-t border-gray-300 my-4" />
    ),
  };

  return (
    <div className={`prose prose-sm max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer; 