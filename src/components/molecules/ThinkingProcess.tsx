'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MarkdownRenderer from '../atoms/MarkdownRenderer';

interface ThinkingProcessProps {
  thinking: string;
  isVisible?: boolean;
  autoCollapse?: boolean;
}

const ThinkingProcess: React.FC<ThinkingProcessProps> = ({ 
  thinking, 
  isVisible = true,
  autoCollapse = true 
}) => {
  const [isExpanded, setIsExpanded] = useState(!autoCollapse);
  const [hasAutoCollapsed, setHasAutoCollapsed] = useState(false);

  // 自动折叠逻辑
  React.useEffect(() => {
    if (autoCollapse && !hasAutoCollapsed && thinking) {
      const timer = setTimeout(() => {
        setIsExpanded(false);
        setHasAutoCollapsed(true);
      }, 3000); // 3秒后自动折叠

      return () => clearTimeout(timer);
    }
  }, [thinking, autoCollapse, hasAutoCollapsed]);

  if (!thinking || !isVisible) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="mb-3"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-50 w-full text-left"
      >
        <motion.div
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.div>
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 bg-blue-500 rounded-full"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
          <span className="font-medium">AI 思考过程</span>
          {!isExpanded && hasAutoCollapsed && (
            <span className="text-xs text-gray-400">(已自动折叠)</span>
          )}
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span className="text-sm font-medium text-blue-800">思考中...</span>
              </div>
              <div className="text-sm text-blue-700">
                <MarkdownRenderer 
                  content={thinking} 
                  className="prose-blue prose-sm"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ThinkingProcess; 