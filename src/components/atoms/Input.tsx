'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'textarea';
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  disabled?: boolean;
  error?: string;
  className?: string;
  rows?: number;
}

const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  onKeyPress,
  disabled = false,
  error,
  className = '',
  rows = 3,
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  const baseClasses = 'w-full px-3 py-2 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';
  
  const stateClasses = error 
    ? 'border-red-500 bg-red-50' 
    : 'border-gray-300 bg-white hover:border-gray-400 focus:border-blue-500';
    
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : '';

  const combinedClasses = `${baseClasses} ${stateClasses} ${disabledClasses} ${className}`;

  const inputProps = {
    placeholder,
    value,
    onChange,
    onKeyPress,
    disabled,
    className: combinedClasses,
  };

  if (!isClient) {
    // 服务端渲染时返回静态版本
    return (
      <div className="w-full">
        {type === 'textarea' ? (
          <textarea
            {...inputProps}
            rows={rows}
          />
        ) : (
          <input
            {...inputProps}
            type={type}
          />
        )}
        {error && (
          <p className="mt-1 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      {type === 'textarea' ? (
        <motion.textarea
          {...inputProps}
          rows={rows}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        />
      ) : (
        <motion.input
          {...inputProps}
          type={type}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
      {error && (
        <motion.p
          className="mt-1 text-sm text-red-600"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.2 }}
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default Input; 