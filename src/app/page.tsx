import React from 'react';
import Navbar from '@/components/organisms/Navbar';
import HeroSection from '@/components/organisms/HeroSection';
import ChatWindow from '@/components/organisms/ChatWindow';
import Footer from '@/components/organisms/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      
      {/* Introduction Section */}
      <section id="introduction" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              关于 獬豸 Themis AI 法学大语言模型
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              獬豸 Themis AI 是专为法学领域打造的垂直特化大语言模型，基于海量法律文献、案例和法规训练而成。
              獬豸象征着公正与法律，Themis 代表正义与秩序，我们致力于为法律从业者、学生和普通用户提供准确、专业的法律信息服务。
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">专业训练</h3>
              <p className="text-gray-600">
                基于大量法律文献、判例和法规进行专门训练，确保回答的专业性和准确性。
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">快速响应</h3>
              <p className="text-gray-600">
                采用先进的 SiliconFlow 推理引擎，提供毫秒级的响应速度，让您快速获得答案。
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">精准理解</h3>
              <p className="text-gray-600">
                深度理解法律语境和专业术语，能够准确把握问题核心，提供针对性建议。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              核心功能特性
            </h2>
            <p className="text-xl text-gray-600">
              獬豸 Themis AI 为您提供全方位的法律服务支持
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: '📖',
                title: '法律条文查询',
                description: '快速查询相关法律条文，获取准确的法规信息和解释。'
              },
              {
                icon: '⚖️',
                title: '案例分析辅助',
                description: '分析类似案例，提供判例参考和法律适用建议。'
              },
              {
                icon: '📝',
                title: '合同草拟建议',
                description: '协助起草各类合同条款，确保合法合规。'
              },
              {
                icon: '💡',
                title: '法律意见生成',
                description: '基于具体情况生成专业的法律分析和建议。'
              },
              {
                icon: '🔍',
                title: '法律术语解释',
                description: '详细解释复杂的法律概念和专业术语。'
              },
              {
                icon: '📊',
                title: '风险评估',
                description: '评估法律风险，提供预防和应对策略。'
              },
              {
                icon: '🏛️',
                title: '诉讼程序指导',
                description: '指导诉讼流程，解答程序性问题。'
              },
              {
                icon: '🤝',
                title: '纠纷解决方案',
                description: '提供多元化的纠纷解决思路和建议。'
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Usage Section */}
      <section id="usage" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              使用场景
            </h2>
            <p className="text-xl text-gray-600">
              獬豸 Themis AI 适用于多种法律服务场景
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">👨‍💼 法律从业者</h3>
              <ul className="space-y-3 text-gray-700">
                <li>• 快速查询法条和判例</li>
                <li>• 辅助案件分析和研究</li>
                <li>• 协助文书起草</li>
                <li>• 法律风险评估</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">🎓 法学学生</h3>
              <ul className="space-y-3 text-gray-700">
                <li>• 学习法律概念和原理</li>
                <li>• 案例分析练习</li>
                <li>• 论文写作辅助</li>
                <li>• 考试复习指导</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">👥 普通用户</h3>
              <ul className="space-y-3 text-gray-700">
                <li>• 日常法律问题咨询</li>
                <li>• 合同条款理解</li>
                <li>• 权益保护指导</li>
                <li>• 法律常识普及</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <ChatWindow />
      <Footer />
      </main>
  );
}
