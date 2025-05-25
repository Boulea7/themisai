'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { legalRoles, type LegalRole } from '@/lib/roles';

interface RoleSelectorProps {
  selectedRole: LegalRole;
  onRoleChange: (role: LegalRole) => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ selectedRole, onRoleChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // 服务端渲染时返回静态版本
    return (
      <div className="relative">
        <button className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-lg">{selectedRole.avatar}</span>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">{selectedRole.name}</h3>
              <p className="text-sm text-gray-600">{selectedRole.title}</p>
            </div>
          </div>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    );
  }

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-700 border-blue-200',
      green: 'bg-green-100 text-green-700 border-green-200',
      purple: 'bg-purple-100 text-purple-700 border-purple-200',
      red: 'bg-red-100 text-red-700 border-red-200',
      yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      orange: 'bg-orange-100 text-orange-700 border-orange-200',
      indigo: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getColorClasses(selectedRole.color)}`}>
            <span className="text-lg">{selectedRole.avatar}</span>
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900">{selectedRole.name}</h3>
            <p className="text-sm text-gray-600">{selectedRole.title}</p>
          </div>
        </div>
        <motion.svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* 背景遮罩 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            
            {/* 下拉菜单 */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-20 max-h-96 overflow-y-auto"
            >
              <div className="p-2">
                {legalRoles.map((role) => (
                  <motion.button
                    key={role.id}
                    onClick={() => {
                      onRoleChange(role);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-start space-x-3 p-3 rounded-lg transition-all duration-200 ${
                      selectedRole.id === role.id
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-gray-50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getColorClasses(role.color)}`}>
                      <span className="text-lg">{role.avatar}</span>
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="font-semibold text-gray-900 mb-1">{role.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{role.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {role.specialties.slice(0, 3).map((specialty, index) => (
                          <span
                            key={index}
                            className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                          >
                            {specialty}
                          </span>
                        ))}
                        {role.specialties.length > 3 && (
                          <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                            +{role.specialties.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                    {selectedRole.id === role.id && (
                      <div className="flex-shrink-0">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RoleSelector; 