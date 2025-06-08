'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { WelcomeNook } from '@/components/home/WelcomeNook'
import { FeatureCard } from '@/components/home/FeatureCard'

const features = [
  {
    title: 'Tâm sự mỏng',
    description: 'Một không gian riêng tư để bạn có thể viết ra những suy nghĩ của mình, với sự hỗ trợ từ AI.',
    href: '/tam-su-mong',
    icon: '📝',
  },
  {
    title: 'Hình dáng tôi',
    description: 'Biến những suy nghĩ tiêu cực thành những người bạn dễ thương, giúp bạn hiểu và chấp nhận bản thân hơn.',
    href: '/hinh-dang-toi',
    icon: '🎨',
  },
  {
    title: 'Khám phá',
    description: 'Khám phá những hoạt động và bài tập giúp bạn cân bằng cảm xúc và phát triển bản thân.',
    href: '/kham-pha',
    icon: '🌱',
  },
  {
    title: 'Hỗ trợ',
    description: 'Kết nối với các chuyên gia tâm lý và nhận sự hỗ trợ chuyên nghiệp khi bạn cần.',
    href: '/ho-tro',
    icon: '🤝',
  },
]

export default function HomePage() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null)

  return (
    <div className="min-h-screen">
      {/* Welcome Nook Hero Section */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-b from-warm-linen to-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5" />
        </div>
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <WelcomeNook
            selectedMood={selectedMood}
            onMoodSelect={setSelectedMood}
          />
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-be-vietnam font-semibold text-warm-charcoal">
              Khám phá không gian của bạn
            </h2>
            <p className="mt-4 text-lg text-warm-charcoal/60 max-w-2xl mx-auto">
              Mỗi không gian đều được thiết kế với tình yêu thương và sự thấu hiểu,
              giúp bạn có thể tự do thể hiện và phát triển bản thân.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <FeatureCard {...feature} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section className="py-16 bg-accent-warm-light/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-3xl font-be-vietnam font-semibold text-warm-charcoal">
              An toàn và tin cậy
            </h2>
            <p className="mt-4 text-lg text-warm-charcoal/60 max-w-2xl mx-auto">
              Chúng tôi cam kết tạo ra một không gian an toàn, nơi mọi người đều được
              tôn trọng và lắng nghe. Tất cả thông tin của bạn đều được bảo mật.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
} 