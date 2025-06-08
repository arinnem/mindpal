import Link from 'next/link'

const emergencyHotlines = [
  {
    name: 'Tổng đài Quốc gia về Bảo vệ trẻ em',
    number: '111',
    description: 'Hỗ trợ 24/7 cho trẻ em và người chăm sóc',
  },
  {
    name: 'Đường dây nóng Bộ Y tế',
    number: '1900 9095',
    description: 'Tư vấn sức khỏe tâm thần',
  },
  {
    name: 'Tổng đài Tư vấn & Hỗ trợ trẻ em',
    number: '1800 1567',
    description: 'Hỗ trợ tâm lý cho trẻ em và thanh thiếu niên',
  },
]

const footerLinks = [
  {
    title: 'Về chúng tôi',
    links: [
      { name: 'Giới thiệu', href: '/gioi-thieu' },
      { name: 'Đội ngũ', href: '/doi-ngu' },
      { name: 'Liên hệ', href: '/lien-he' },
    ],
  },
  {
    title: 'Hỗ trợ',
    links: [
      { name: 'Câu hỏi thường gặp', href: '/faq' },
      { name: 'Chính sách bảo mật', href: '/bao-mat' },
      { name: 'Điều khoản sử dụng', href: '/dieu-khoan' },
    ],
  },
  {
    title: 'Tài nguyên',
    links: [
      { name: 'Blog', href: '/blog' },
      { name: 'Tài liệu', href: '/tai-lieu' },
      { name: 'Cộng đồng', href: '/cong-dong' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="bg-white border-t border-accent-warm-light/20">
      {/* Emergency Hotlines */}
      <div className="bg-accent-warm-light/10 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-semibold text-warm-charcoal mb-4">
            Đường dây nóng khẩn cấp
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {emergencyHotlines.map((hotline) => (
              <div
                key={hotline.number}
                className="bg-white rounded-xl p-4 shadow-sm"
              >
                <h3 className="font-medium text-warm-charcoal">{hotline.name}</h3>
                <p className="text-soft-clay text-lg font-semibold mt-1">
                  {hotline.number}
                </p>
                <p className="text-warm-charcoal/60 text-sm mt-1">
                  {hotline.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-2">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-be-vietnam font-semibold text-warm-charcoal">
                Bạn thương
              </span>
            </Link>
            <p className="mt-4 text-warm-charcoal/60 text-sm max-w-md">
              Một không gian số ấm áp và an toàn, nơi học sinh Việt Nam có thể
              chia sẻ, lắng nghe và phát triển bản thân.
            </p>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-warm-charcoal">
                {section.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-warm-charcoal/60 hover:text-accent-warm transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-accent-warm-light/20">
          <p className="text-center text-sm text-warm-charcoal/60">
            © {new Date().getFullYear()} Bạn thương. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  )
} 