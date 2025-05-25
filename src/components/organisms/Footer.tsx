'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // 服务端渲染时返回静态版本
    return (
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Logo and Description */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">獬</span>
                </div>
                <span className="font-bold text-xl">獬豸 Themis AI</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                专为法学领域打造的垂直特化大语言模型服务平台。獬豸象征公正与法律，Themis代表正义与秩序，为您提供专业、准确的法律咨询与信息服务。
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-lg mb-4">快速链接</h3>
              <ul className="space-y-2">
                {['模型介绍', '功能特性', '使用方法', '开始咨询'].map((item) => (
                  <li key={item}>
                    <a
                      href={`#${item.toLowerCase()}`}
                      className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-semibold text-lg mb-4">联系我们</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <p>邮箱: contact@themis-ai.com</p>
                <p>技术支持: support@themis-ai.com</p>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-yellow-400 mb-2">⚠️ 重要免责声明</h4>
              <p className="text-sm text-gray-300 leading-relaxed">
                獬豸 Themis AI 提供的所有信息和建议仅供参考，不构成正式的法律意见或建议。
                任何法律问题都应咨询具有执业资格的专业律师。我们不对因使用本服务而产生的任何后果承担责任。
              </p>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
              <p>&copy; 2024 獬豸 Themis AI. 保留所有权利。</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="hover:text-white transition-colors duration-200">隐私政策</a>
                <a href="#" className="hover:text-white transition-colors duration-200">服务条款</a>
                <a href="#" className="hover:text-white transition-colors duration-200">使用协议</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  // 客户端渲染时返回带动画的版本
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">獬</span>
              </div>
              <span className="font-bold text-xl">獬豸 Themis AI</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              专为法学领域打造的垂直特化大语言模型服务平台。獬豸象征公正与法律，Themis代表正义与秩序，为您提供专业、准确的法律咨询与信息服务。
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="font-semibold text-lg mb-4">快速链接</h3>
            <ul className="space-y-2">
              {['模型介绍', '功能特性', '使用方法', '开始咨询'].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="font-semibold text-lg mb-4">联系我们</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <p>邮箱: contact@themis-ai.com</p>
              <p>技术支持: support@themis-ai.com</p>
            </div>
          </motion.div>
        </div>

        {/* Disclaimer */}
        <motion.div
          className="border-t border-gray-800 mt-8 pt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-yellow-400 mb-2">⚠️ 重要免责声明</h4>
            <p className="text-sm text-gray-300 leading-relaxed">
              獬豸 Themis AI 提供的所有信息和建议仅供参考，不构成正式的法律意见或建议。
              任何法律问题都应咨询具有执业资格的专业律师。我们不对因使用本服务而产生的任何后果承担责任。
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>&copy; 2024 獬豸 Themis AI. 保留所有权利。</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors duration-200">隐私政策</a>
              <a href="#" className="hover:text-white transition-colors duration-200">服务条款</a>
              <a href="#" className="hover:text-white transition-colors duration-200">使用协议</a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer; 