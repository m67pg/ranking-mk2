import type React from "react"
import { redirect } from "next/navigation"
import { isAuthenticated } from "../../../src/lib/auth"
import AdminHeader from "../../../components/admin-header"

export default async function AdminRankingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const authenticated = await isAuthenticated()

  if (!authenticated) {
    redirect("/admin")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <main>{children}</main>
    </div>
  )
}
