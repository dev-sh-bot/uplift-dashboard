import { useState } from "react"
import PropTypes from "prop-types"
import { NavLink, useLocation } from "react-router-dom"
import { useDispatch } from "react-redux"
import { logoutUser } from "../reducers/authSlice"

// Icons
import {
  FaChevronDown,
  FaChevronUp,
  FaChevronLeft,
  FaChevronRight,
  FaMotorcycle,
  FaCar,
  FaUsers,
  FaCog,
} from "react-icons/fa"
import { LuLayoutDashboard, LuLogOut } from "react-icons/lu"

// Your logo asset
import logo from "../assets/images/logo.webp"

const menuItems = [
  {
    title: "Dashboard",
    path: "/",
    icon: <LuLayoutDashboard />,
  },
  {
    title: "Riders",
    path: "/riders",
    icon: <FaMotorcycle />,
  },
  {
    title: "Customers",
    path: "/customers",
    icon: <FaUsers />,
  },
  {
    title: "Vehicle Type Rates",
    path: "/vehicle-type-rates",
    icon: <FaCar />,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: <FaCog />,
  },
  // {
  //   title: "Sales",
  //   icon: <FaChartBar />,
  //   links: [
  //     { label: "Sale Quotations", path: "/sale-quotations" },
  //     { label: "Sale Orders", path: "/sale-orders" },
  //     { label: "Delivery Notes", path: "/delivery-notes" },
  //     { label: "Sale Receipts", path: "/sale-receipts" },
  //     { label: "Sale Voucher", path: "/sale-vouchers" },
  //     { label: "Sale Return", path: "/sale-return" },
  //     { label: "Sale Return Voucher", path: "/sale-return-voucher" },
  //   ],
  // },
  
]

function SidebarItem({ item, isSidebarExpanded, onExpand }) {
  const [isOpen, setIsOpen] = useState(false)
  const hasSubLinks = item.links && item.links.length > 0
  const location = useLocation()

  let subLinks = []
  if (hasSubLinks) {
    subLinks = item.links
  }
  const isParentActive =
    hasSubLinks &&
    subLinks.some((link) => location.pathname.startsWith(link.path))

  const handleItemClick = () => {
    if (!isSidebarExpanded && hasSubLinks) {
      onExpand()
      setIsOpen(true)
    } else if (hasSubLinks) {
      setIsOpen(!isOpen)
    }
  }

  if (hasSubLinks) {
    return (
      <div>
        <button
          onClick={handleItemClick}
          title={!isSidebarExpanded ? item.title : undefined}
          className={`
            w-full h-10 flex items-center
            ${isSidebarExpanded ? "justify-between px-4" : "justify-center"}
            font-medium border-l-4
            ${isParentActive
              ? "bg-primary-50 dark:bg-primary-900/20 border-primary-600 text-primary-600 dark:text-primary-400"
              : "border-transparent text-gray-700 dark:text-facebook-textSecondary hover:bg-gray-100 dark:hover:bg-facebook-hover"
            }
          `}
        >
          <div className="flex items-center gap-3 whitespace-nowrap overflow-hidden">
            <span className="text-inherit text-base">{item.icon}</span>
            {isSidebarExpanded && <span className="text-sm text-inherit">{item.title}</span>}
          </div>
          {isSidebarExpanded && (
            <span className="text-inherit text-xs">
              {isOpen ? <FaChevronUp /> : <FaChevronDown />}
            </span>
          )}
        </button>
        {isOpen && isSidebarExpanded && (
          <div className="flex flex-col ml-6 border-l border-gray-200 dark:border-facebook-border">
            {subLinks.map((link, index) => (
              <NavLink
                key={index}
                to={link.path}
                title={!isSidebarExpanded ? link.label : undefined}
                className={({ isActive }) =>
                  `
                    h-10 flex items-center pl-2 text-xs transition-colors
                    whitespace-nowrap overflow-hidden
                    border-l-4
                    ${isActive
                    ? "bg-primary-50 dark:bg-primary-900/20 border-primary-600 text-primary-600 dark:text-primary-400"
                    : "border-transparent text-gray-600 dark:text-facebook-textSecondary hover:bg-gray-100 dark:hover:bg-facebook-hover"
                  }
                  `
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <NavLink
      to={item.path}
      title={!isSidebarExpanded ? item.title : undefined}
      className={({ isActive }) =>
        `
         w-full h-10 flex items-center
         ${isSidebarExpanded ? "justify-start px-4 gap-3" : "justify-center"}
         font-medium border-l-4
         ${isActive
          ? "bg-primary-50 dark:bg-primary-900/20 border-primary-600 text-primary-600 dark:text-primary-400"
          : "border-transparent text-gray-700 dark:text-facebook-textSecondary hover:bg-gray-100 dark:hover:bg-facebook-hover"
        }
        `
      }
    >
      <span className="text-inherit text-base">{item.icon}</span>
      {isSidebarExpanded && (
        <span className="whitespace-nowrap text-sm text-inherit overflow-hidden">{item.title}</span>
      )}
    </NavLink>
  )
}

SidebarItem.propTypes = {
  item: PropTypes.object.isRequired,
  isSidebarExpanded: PropTypes.bool.isRequired,
  onExpand: PropTypes.func,
}

export default function Sidebar({ isExpanded, setIsExpanded }) {
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(logoutUser())
  }

  return (
    <aside
      className={`
        sticky top-0 left-0 z-10
        flex flex-col h-screen border-r border-gray-200 dark:border-facebook-border bg-white dark:bg-facebook-card
        ${isExpanded ? "w-64" : "w-20"}
        transition-all duration-300 overflow-hidden
      `}
    >
      {/* Header / Logo */}
      <div
        className={`
          flex items-center
          ${isExpanded ? "justify-between px-4" : "justify-center"}
          h-20 bg-white dark:bg-facebook-card shadow-sm dark:shadow-gray-900/20
        `}
      >
        <div className="w-10 h-10 p-1 bg-[#1C70B9] rounded-full">
          <img src={logo} alt="Logo" className="w-full h-full object-contain" />
        </div>
        {isExpanded && (
          <div className="flex-1 flex items-center justify-center gap-3">
            <img src={logo} alt="Logo" className="w-24 h-24 object-contain" />
          </div>
        )}
      </div>

      {/* Main Nav Items */}
      <div className="flex-1 overflow-y-auto space-y-1">
        {menuItems.map((item, index) => (
          <SidebarItem
            key={index}
            item={item}
            isSidebarExpanded={isExpanded}
            onExpand={() => setIsExpanded(true)}
          />
        ))}
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        title={!isExpanded ? "Logout" : undefined}
        className={`
          w-full h-10 flex items-center 
          ${isExpanded ? "justify-start px-4 gap-3" : "justify-center"}
          text-sm font-medium border-l-4
          border-transparent text-gray-700 dark:text-facebook-textSecondary hover:bg-gray-100 dark:hover:bg-facebook-hover
        `}
      >
        <LuLogOut className="text-base" />
        {isExpanded && <span>Logout</span>}
      </button>

      {/* Expand/Collapse Toggle */}
      <div className="border-t border-gray-200 dark:border-facebook-border">
        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          title={!isExpanded ? "Expand" : undefined}
          className={`
            w-full h-10 flex items-center 
            ${isExpanded ? "justify-start px-4 gap-3" : "justify-center"}
            text-sm font-medium border-l-4
            border-transparent text-gray-700 dark:text-facebook-textSecondary hover:bg-gray-100 dark:hover:bg-facebook-hover
          `}
        >
          {isExpanded ? <FaChevronLeft /> : <FaChevronRight />}
          {isExpanded && <span>Expand</span>}
        </button>
      </div>
    </aside>
  )
}

Sidebar.propTypes = {
  isExpanded: PropTypes.bool.isRequired,
  setIsExpanded: PropTypes.func.isRequired,
}