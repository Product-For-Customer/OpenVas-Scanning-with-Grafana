import { FiShoppingBag, FiEdit } from 'react-icons/fi';
import { AiOutlineShoppingCart, AiOutlineUser } from 'react-icons/ai';
import { FaCarSide } from 'react-icons/fa';
import { RiCustomerService2Line } from 'react-icons/ri';
import type { JSX } from 'react/jsx-dev-runtime';

export const getLinks = () => {
  const baseLinks = [
    {
      title: 'Dashboard',
      links: [
        { name: 'Dashboard', icon: <FiShoppingBag /> },
        { name: 'vulnerability', icon: <FiEdit /> },
        { name: 'Target', icon: <FiEdit /> },
      ],
    },
    {
      title: 'Mangement',
      links: [
        { name: 'Line notification', icon: <AiOutlineShoppingCart /> },
        { name: 'User', icon: <FaCarSide /> },
      ],
    },
  ];

  return baseLinks;
};

export const themeColors = [
  {
    name: 'blue-theme',
    color: '#1A97F5',
  },
  {
    name: 'green-theme',
    color: '#03C9D7',
  },
  {
    name: 'purple-theme',
    color: '#7352FF',
  },
  {
    name: 'red-theme',
    color: '#FF5C8E',
  },
  {
    name: 'indigo-theme',
    color: '#1E4DB7',
  },
  {
    color: '#FB9678',
    name: 'orange-theme',
  },
];

// สามารถเพิ่ม type เพื่อความชัดเจน
export type UserProfileItem = {
  icon: JSX.Element;
  title: string;
  desc: string;
  iconColor: string;
  iconBg: string;
  link: string;
};

// ✅ อัปเดตให้มี field link และเพิ่มเมนู Service
export const userProfileData: UserProfileItem[] = [
  {
    icon: <AiOutlineUser />,
    title: 'My Profile',
    desc: 'Account Settings',
    iconColor: '#03C9D7',
    iconBg: '#E5FAFB',
    link: '/admin/profile',          // ปรับ path ตามระบบจริงของคุณ
  },
  {
    icon: <RiCustomerService2Line />,
    title: 'Service',
    desc: 'แก้ไขข้อมูลฝ่ายบริการ',
    iconColor: '#2563EB',
    iconBg: '#EAF2FF',
    link: '/admin/Service',          // ✅ ไปหน้า Service ตามที่ต้องการ
  },
];