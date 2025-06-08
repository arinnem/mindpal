'use client'

import React from 'react';
import { VIETNAMESE_HOTLINES } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { LifeBuoyIcon } from '@/components/icons/LifeBuoyIcon';
import { UsersIcon } from '@/components/icons/UsersIcon';
import { CalendarDaysIcon } from '@/components/icons/CalendarDaysIcon';
import { VideoIcon } from '@/components/icons/VideoIcon';

export default function SupportPage() {
  return (
    <div className="container mx-auto p-4">
      <div className="text-center mb-10 pt-6">
        <LifeBuoyIcon className="w-16 h-16 text-soft-clay mx-auto mb-4 opacity-70"/>
        <h2 className="text-3xl font-bold font-be-vietnam text-soft-clay mb-3">Tìm kiếm sự hỗ trợ</h2>
        <p className="text-warm-charcoal/80 max-w-2xl mx-auto">
          Đôi khi, chúng ta cần sự giúp đỡ từ những người có chuyên môn. Tại đây, bạn có thể tìm thấy thông tin về các nguồn lực hỗ trợ tâm lý chuyên nghiệp.
        </p>
      </div>

      {/* Emergency Hotlines Section */}
      <section className="mb-12 p-6 bg-red-500/10 rounded-xl shadow-md border border-red-500/30">
        <h3 className="text-2xl font-semibold font-be-vietnam text-red-600 mb-4">Hỗ trợ khẩn cấp</h3>
        <p className="text-warm-charcoal mb-4">
          Nếu bạn hoặc ai đó bạn biết đang gặp khủng hoảng hoặc cần giúp đỡ ngay lập tức, xin đừng ngần ngại liên hệ các đường dây nóng sau:
        </p>
        <ul className="space-y-2">
          {VIETNAMESE_HOTLINES.map((hotline) => (
            <li key={hotline.name} className="text-warm-charcoal">
              <strong className="font-semibold">{hotline.name}:</strong>{' '}
              <a href={`tel:${hotline.number.replace(/\s/g, '')}`} className="text-red-600 hover:underline font-medium">
                {hotline.number}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-warm-charcoal/80">
          Hãy nhớ rằng, tìm kiếm sự giúp đỡ là một hành động dũng cảm. Bạn không đơn độc.
        </p>
      </section>

      {/* Information about Professional Therapy */}
      <section className="mb-12">
        <h3 className="text-2xl font-semibold font-be-vietnam text-warm-charcoal mb-6">Tìm hiểu về trị liệu tâm lý</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white rounded-xl shadow-lg border border-soft-clay/20">
            <h4 className="text-xl font-semibold text-soft-clay mb-2">Trị liệu là gì?</h4>
            <p className="text-sm text-warm-charcoal/80">
              Trị liệu tâm lý là một quá trình hợp tác giữa bạn và nhà trị liệu để giúp bạn hiểu rõ hơn về suy nghĩ, cảm xúc, hành vi của mình và phát triển các kỹ năng đối phó lành mạnh.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-lg border border-soft-clay/20">
            <h4 className="text-xl font-semibold text-soft-clay mb-2">Khi nào nên tìm đến trị liệu?</h4>
            <p className="text-sm text-warm-charcoal/80">
              Nếu bạn cảm thấy khó khăn trong việc quản lý cảm xúc, đối mặt với căng thẳng, gặp vấn đề trong các mối quan hệ, hoặc đơn giản là muốn hiểu rõ hơn về bản thân, trị liệu có thể hữu ích.
            </p>
          </div>
        </div>
      </section>

      {/* Mocked Therapy Integration Features */}
      <section className="mb-12 p-6 bg-sage-green/10 rounded-xl shadow">
        <h3 className="text-2xl font-semibold font-be-vietnam text-sage-green mb-6">Kết nối với chuyên gia (Mô phỏng)</h3>
        <p className="text-warm-charcoal/80 mb-6">Các tính năng dưới đây đang được phát triển để giúp bạn dễ dàng tìm kiếm và kết nối với các nhà trị liệu chuyên nghiệp.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow">
            <UsersIcon className="w-10 h-10 text-sage-green mb-3"/>
            <h4 className="font-semibold text-warm-charcoal mb-1">Tìm nhà trị liệu</h4>
            <p className="text-xs text-warm-charcoal/70">Duyệt danh sách các chuyên gia phù hợp.</p>
            <Button size="sm" variant="secondary" className="mt-3" disabled>Sắp ra mắt</Button>
          </div>
          <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow">
            <CalendarDaysIcon className="w-10 h-10 text-sage-green mb-3"/>
            <h4 className="font-semibold text-warm-charcoal mb-1">Đặt lịch hẹn</h4>
            <p className="text-xs text-warm-charcoal/70">Quản lý lịch hẹn trực tuyến dễ dàng.</p>
            <Button size="sm" variant="secondary" className="mt-3" disabled>Sắp ra mắt</Button>
          </div>
          <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow">
            <VideoIcon className="w-10 h-10 text-sage-green mb-3"/>
            <h4 className="font-semibold text-warm-charcoal mb-1">Phiên trị liệu trực tuyến</h4>
            <p className="text-xs text-warm-charcoal/70">Tham gia các buổi trị liệu an toàn, bảo mật.</p>
            <Button size="sm" variant="secondary" className="mt-3" disabled>Sắp ra mắt</Button>
          </div>
        </div>
      </section>
      
       <section className="mb-12 p-6 bg-warm-linen rounded-xl shadow border border-soft-clay/20">
        <h3 className="text-2xl font-semibold font-be-vietnam text-soft-clay mb-4">Dành cho Nhà trị liệu</h3>
        <p className="text-warm-charcoal/80 mb-4">
          Bạn Thương mong muốn hợp tác cùng các nhà trị liệu tâm lý để mang đến sự hỗ trợ tốt nhất cho học sinh. Chúng tôi đang phát triển một cổng thông tin dành riêng cho chuyên gia với các công cụ quản lý và hỗ trợ AI.
        </p>
        <Button variant="outline" disabled>Tìm hiểu thêm (Sắp có)</Button>
      </section>

    </div>
  );
};