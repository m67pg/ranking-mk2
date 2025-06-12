import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LogOut, User, Home } from "lucide-react"
import Link from "next/link"
import { logout, getAdminSession } from "../src/lib/auth"

// AdminHeaderProps interfaceを削除し、サーバーコンポーネントに変更
export default async function AdminHeader() {
  const session = await getAdminSession()
  const userEmail = session?.email
  const userName = session?.name

  const handleSignOut = async () => {
    "use server"
    await logout()
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <Home className="h-5 w-5" />
              <span>トップページ</span>
            </Link>
            <span className="text-gray-300">|</span>
            <h1 className="text-xl font-semibold text-gray-900">Ranking MK2 管理画面</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900">{userName}</span>
                <span className="text-xs text-gray-500">{userEmail}</span>
              </div>
            </div>

            <form action={handleSignOut}>
              <Button variant="outline" size="sm" type="submit">
                <LogOut className="h-4 w-4 mr-2" />
                ログアウト
              </Button>
            </form>
          </div>
        </div>
      </div>
    </header>
  )
}
