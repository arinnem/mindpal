'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

interface FeatureCardProps {
  title: string
  description: string
  href: string
  icon: string
}

export function FeatureCard({ title, description, href, icon }: FeatureCardProps) {
  return (
    <Link href={href}>
      <motion.div
        className="card group h-full flex flex-col"
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-accent-warm-light/20 flex items-center justify-center mb-4">
          <span className="text-2xl" role="img" aria-label={title}>
            {icon}
          </span>
        </div>

        {/* Content */}
        <div className="flex-grow">
          <h3 className="text-xl font-be-vietnam font-semibold text-warm-charcoal mb-2">
            {title}
          </h3>
          <p className="text-warm-charcoal/60">
            {description}
          </p>
        </div>

        {/* Arrow */}
        <div className="mt-4 flex items-center text-accent-warm group-hover:text-accent-warm-dark">
          <span className="text-sm font-medium">Khám phá ngay</span>
          <ArrowRight className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:translate-x-1" />
        </div>
      </motion.div>
    </Link>
  )
} 