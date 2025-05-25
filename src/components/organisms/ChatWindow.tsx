'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import MarkdownRenderer from '../atoms/MarkdownRenderer';
import RoleSelector from '../molecules/RoleSelector';
import ThinkingProcess from '../molecules/ThinkingProcess';
import { sendChatMessageStream, formatErrorMessage, isLegalRelated, parseThinkingContent, type ChatMessage as APIChatMessage } from '@/lib/api';
import { getDefaultRole, type LegalRole } from '@/lib/roles';

interface Message {
  id: string;
  content: string;
  thinking?: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  isStreaming?: boolean;
}

// 根据角色获取示例问题
const getExampleQuestions = (roleId: string): string[] => {
  const questionMap: Record<string, string[]> = {
    general: [
      '什么是合同违约？如何处理？',
      '民事诉讼的基本流程是什么？',
      '如何查询相关法律条文？',
      '法律纠纷有哪些解决方式？',
    ],
    corporate: [
      '公司注册需要哪些材料？',
      '如何起草商业合同？',
      '企业合规体系如何建立？',
      '股权转让的法律风险有哪些？',
    ],
    civil: [
      '离婚财产如何分割？',
      '房产纠纷如何处理？',
      '人身损害赔偿标准是什么？',
      '遗产继承的法律程序？',
    ],
    criminal: [
      '刑事案件的诉讼流程？',
      '如何进行刑事辩护？',
      '企业如何防范刑事风险？',
      '什么情况下可以取保候审？',
    ],
    intellectual: [
      '如何申请专利保护？',
      '商标侵权如何维权？',
      '著作权保护范围是什么？',
      '商业秘密如何保护？',
    ],
    labor: [
      '劳动合同纠纷如何解决？',
      '工伤赔偿标准是什么？',
      '如何申请劳动仲裁？',
      '加班费如何计算？',
    ],
    student: [
      '如何分析经典法律案例？',
      '法条应该怎么理解？',
      '司法考试如何备考？',
      '法学论文怎么写？',
    ],
  };
  
  return questionMap[roleId] || questionMap.general;
};

const ChatWindow: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<LegalRole>(getDefaultRole());
  const [messages, setMessages] = useState<Message[]>([]);
  
  // 初始化消息
  useEffect(() => {
    const defaultRole = getDefaultRole();
    setMessages([
      {
        id: '1',
        content: `您好！我是 ${defaultRole.name}，${defaultRole.description}。请问有什么可以为您服务的吗？`,
        sender: 'assistant',
        timestamp: new Date(),
      },
    ]);
  }, []);
  
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // 处理角色切换
  const handleRoleChange = (newRole: LegalRole) => {
    setSelectedRole(newRole);
    
    // 添加角色切换提示消息
    const roleChangeMessage: Message = {
      id: Date.now().toString(),
      content: `已切换到 ${newRole.name}。我是${newRole.title}，${newRole.description}。我的专业领域包括：${newRole.specialties.join('、')}。请问有什么可以为您服务的吗？`,
      sender: 'assistant',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, roleChangeMessage]);
  };

  const scrollToBottom = useCallback((force = false) => {
    if (force || shouldAutoScroll) {
      // 只滚动聊天容器内部，不影响页面滚动
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
    }
  }, [shouldAutoScroll]);

  // 检查用户是否手动滚动了聊天区域
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 50; // 50px 容差
      setShouldAutoScroll(isNearBottom);
    }
  };

  useEffect(() => {
    // 只有在应该自动滚动时才滚动
    if (shouldAutoScroll) {
      scrollToBottom();
    }
  }, [messages, shouldAutoScroll, scrollToBottom]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);
    
    // 发送消息时只滚动聊天容器内部，不影响页面滚动
    setShouldAutoScroll(true);
    setTimeout(() => scrollToBottom(true), 100);

    try {
      // 检查是否为法律相关问题，如果不是则给出友好提示
      if (!isLegalRelated(currentInput)) {
        const suggestionMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: `感谢您的问题。我是 獬豸 Themis AI 法律顾问，专门为您提供法律相关的咨询服务。

您的问题似乎不是法律相关的。我可以帮助您解答以下类型的法律问题：
• 法律条文查询和解释
• 合同条款分析
• 法律程序指导
• 案例分析参考
• 法律风险评估

请您重新提出一个法律相关的问题，我将竭诚为您服务！`,
          sender: 'assistant',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, suggestionMessage]);
        setIsLoading(false);
        return;
      }

      // 构建聊天历史
      const chatHistory: APIChatMessage[] = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));

      // 创建流式响应的消息
      const streamingMessageId = (Date.now() + 1).toString();
      const streamingMessage: Message = {
        id: streamingMessageId,
        content: '',
        sender: 'assistant',
        timestamp: new Date(),
        isStreaming: true,
      };

      setMessages(prev => [...prev, streamingMessage]);

      let fullContent = '';
      let currentThinking = '';
      let currentAnswer = '';

      // 使用流式API
      await sendChatMessageStream(
        currentInput,
        chatHistory,
        selectedRole.id,
        (chunk: string) => {
          fullContent += chunk;
          
          // 解析思考过程和回答
          const { thinking, answer } = parseThinkingContent(fullContent);
          currentThinking = thinking;
          currentAnswer = answer;

          // 更新消息内容
          setMessages(prev => prev.map(msg => 
            msg.id === streamingMessageId 
              ? { 
                  ...msg, 
                  content: currentAnswer,
                  thinking: currentThinking,
                  isStreaming: true 
                }
              : msg
          ));
        },
        (error: string) => {
          console.error('Stream error:', error);
          
          const errorMessage: Message = {
            id: (Date.now() + 2).toString(),
            content: `抱歉，发生了错误：${error}

请您：
• 检查网络连接是否正常
• 稍后重试您的问题
• 如果问题持续存在，请联系技术支持`,
            sender: 'assistant',
            timestamp: new Date(),
          };

          setMessages(prev => prev.filter(msg => msg.id !== streamingMessageId).concat([errorMessage]));
        },
        () => {
          // 流式响应完成
          setMessages(prev => prev.map(msg => 
            msg.id === streamingMessageId 
              ? { 
                  ...msg, 
                  content: currentAnswer,
                  thinking: currentThinking,
                  isStreaming: false 
                }
              : msg
          ));
        }
      );

    } catch (error) {
      console.error('Chat error:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `抱歉，发生了错误：${formatErrorMessage(error)}

请您：
• 检查网络连接是否正常
• 稍后重试您的问题
• 如果问题持续存在，请联系技术支持`,
        sender: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: '1',
        content: `对话已清除。我是 ${selectedRole.name}，${selectedRole.description}。请问有什么新的法律问题需要咨询吗？`,
        sender: 'assistant',
        timestamp: new Date(),
      },
    ]);
    // 清除对话后重置自动滚动状态，但不强制滚动页面
    setShouldAutoScroll(true);
  };

  const handleCopyMessage = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopySuccess(messageId);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (error) {
      console.error('复制失败:', error);
    }
  };

  return (
    <section id="chat" className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            开始您的法律咨询
          </h2>
          <p className="text-xl text-gray-600">
            与 獬豸 Themis AI 智能法律顾问实时对话，获取专业的法律建议
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden relative"
        >
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 bg-white/20 rounded-full flex items-center justify-center`}>
                  <span className="text-white text-lg">{selectedRole.avatar}</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold">{selectedRole.name}</h3>
                  <p className="text-blue-100 text-sm">{selectedRole.title} · 在线服务</p>
                </div>
              </div>
              <button
                onClick={handleClearChat}
                className="text-white/80 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-white/10"
                title="清除对话"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Role Selector */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="mb-2">
              <h4 className="text-sm font-medium text-gray-700 mb-2">选择专业顾问</h4>
              <RoleSelector
                selectedRole={selectedRole}
                onRoleChange={handleRoleChange}
              />
            </div>
            <div className="flex flex-wrap gap-1 mt-3">
              {selectedRole.specialties.map((specialty, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>

          {/* Messages Area */}
          <div 
            ref={messagesContainerRef}
            onScroll={handleScroll}
            className="h-96 overflow-y-auto p-6 space-y-4"
          >
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="relative group max-w-xs lg:max-w-md">
                    {/* 思考过程展示 */}
                    {message.sender === 'assistant' && message.thinking && (
                      <ThinkingProcess 
                        thinking={message.thinking}
                        autoCollapse={!message.isStreaming}
                      />
                    )}
                    
                    {/* 消息气泡 */}
                    <div
                      className={`px-4 py-3 rounded-2xl ${
                        message.sender === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      {message.sender === 'assistant' ? (
                        <MarkdownRenderer 
                          content={message.content}
                          className="text-sm leading-relaxed"
                        />
                      ) : (
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      )}
                      
                      {/* 流式输入指示器 */}
                      {message.isStreaming && (
                        <motion.div
                          className="flex items-center space-x-1 mt-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="w-1 h-1 bg-gray-400 rounded-full"
                              animate={{ scale: [1, 1.5, 1] }}
                              transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                delay: i * 0.2,
                              }}
                            />
                          ))}
                        </motion.div>
                      )}
                      
                      <div className="flex items-center justify-between mt-2">
                        <p className={`text-xs ${
                          message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                        {message.sender === 'assistant' && !message.isStreaming && (
                          <button
                            onClick={() => handleCopyMessage(message.content, message.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded hover:bg-gray-200 ml-2"
                            title="复制消息"
                          >
                            {copySuccess === message.id ? (
                              <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex justify-start"
              >
                <div className="bg-gray-100 px-4 py-3 rounded-2xl">
                  <div className="flex space-x-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 滚动到底部按钮 */}
          {!shouldAutoScroll && (
            <div className="absolute bottom-4 right-4">
              <button
                onClick={() => {
                  setShouldAutoScroll(true);
                  scrollToBottom(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-all duration-200 flex items-center space-x-2"
                title="滚动到最新消息"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                <span className="text-xs">新消息</span>
              </button>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t border-gray-200 p-6">
            <div className="flex space-x-4">
              <div className="flex-1">
                <Input
                  type="textarea"
                  placeholder="请输入您的法律问题..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  rows={2}
                  disabled={isLoading}
                />
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                variant="primary"
                className="self-end"
              >
                {isLoading ? '发送中...' : '发送'}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              按 Enter 发送，Shift + Enter 换行
            </p>
          </div>
          
          {/* 简洁免责声明 */}
          <div className="px-6 pb-4">
            <p className="text-xs text-gray-400 text-center">
              獬豸 Themis AI 可能会出错，请核实重要信息。回答仅供参考，不构成正式法律意见。
            </p>
          </div>
        </motion.div>

        {/* Example Questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-8"
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            💡 向 {selectedRole.name} 提问：
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getExampleQuestions(selectedRole.id).map((question, index) => (
              <motion.button
                key={question}
                onClick={() => setInputValue(question)}
                className="text-left p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-gray-700 text-sm">{question}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ChatWindow; 