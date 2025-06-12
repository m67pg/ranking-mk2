"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"
import { prisma } from "./prisma"

export async function authenticate(email: string, password: string) {
  try {
    // データベースからユーザーを取得
    const user = await prisma.user.findUnique({
      where: {
        email: email,
        isActive: true,
      },
    })

    if (!user) {
      return { success: false, error: "メールアドレスまたはパスワードが正しくありません" }
    }

    // パスワードを検証
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return { success: false, error: "メールアドレスまたはパスワードが正しくありません" }
    }

    // セッションクッキーを設定
    const cookieStore = await cookies()
    const sessionData = JSON.stringify({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    })

    cookieStore.set("admin-session", sessionData, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 24時間
    })

    return { success: true, user: { id: user.id, email: user.email, name: user.name, role: user.role } }
  } catch (error) {
    console.error("Authentication error:", error)
    return { success: false, error: "認証処理中にエラーが発生しました" }
  }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete("admin-session")
  redirect("/admin")
}

export async function isAuthenticated() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("admin-session")

    if (!sessionCookie?.value) {
      return false
    }

    // セッションデータを解析
    const sessionData = JSON.parse(sessionCookie.value)

    // ユーザーがまだアクティブかチェック
    const user = await prisma.user.findUnique({
      where: {
        id: sessionData.userId,
        isActive: true,
      },
    })

    return !!user
  } catch (error) {
    console.error("Session validation error:", error)
    return false
  }
}

export async function getAdminSession() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("admin-session")

    if (!sessionCookie?.value) {
      return null
    }

    const sessionData = JSON.parse(sessionCookie.value)

    // ユーザー情報を最新の状態で取得
    const user = await prisma.user.findUnique({
      where: {
        id: sessionData.userId,
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    })

    return user
  } catch (error) {
    console.error("Get session error:", error)
    return null
  }
}

// 新しいユーザーを作成する関数（管理者用）
export async function createUser(email: string, password: string, name: string, role = "admin") {
  try {
    // パスワードをハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    })

    return { success: true, user }
  } catch (error) {
    console.error("Create user error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "ユーザー作成に失敗しました",
    }
  }
}

// パスワードを変更する関数
export async function changePassword(userId: number, currentPassword: string, newPassword: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return { success: false, error: "ユーザーが見つかりません" }
    }

    // 現在のパスワードを検証
    const isValidPassword = await bcrypt.compare(currentPassword, user.password)
    if (!isValidPassword) {
      return { success: false, error: "現在のパスワードが正しくありません" }
    }

    // 新しいパスワードをハッシュ化
    const hashedNewPassword = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    })

    return { success: true }
  } catch (error) {
    console.error("Change password error:", error)
    return { success: false, error: "パスワード変更に失敗しました" }
  }
}
