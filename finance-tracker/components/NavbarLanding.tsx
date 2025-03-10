"use client"
import * as React from "react"
import { useState, useEffect } from "react"
import { Menu, X, Moon, Sun, Home, PieChart, CreditCard, Settings, User, LogOut } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function NavbarLanding() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // Handle hydration issue
  useEffect(() => {
    setMounted(true)
  }, [])

  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (mobileMenuOpen && !event.target.closest('.mobile-menu') && !event.target.closest('.menu-button')) {
        setMobileMenuOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [mobileMenuOpen])

  // Only render after component is mounted
  if (!mounted) return null

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and main nav items */}
          <div className="flex">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                Flow
              </Link>
            </div>
            
            
          </div>
          
          {/* Right side section */}
          <div className="flex items-center justify-between gap-3 ">
            {/* Theme toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme} 
              aria-label="Toggle theme"
              className="rounded-full mr-4"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            
            {/* User profile - visible on desktop */}
            <Link href="/login">
              <Button className="hidden sm:flex ml-3" >Get Started</Button>
            </Link>
            
            
            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="icon"
              className="sm:hidden menu-button rounded-full"
              onClick={toggleMobileMenu}
              aria-label="Open menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden mobile-menu">
          <div className="px-2 pt-2 pb-4 space-y-1 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <Link href="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center">
              <Button>Get Started</Button>
            </Link>

          </div>
          
        </div>
      )}
    </nav>
  )
}