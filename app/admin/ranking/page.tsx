"use client"

import { useState, useEffect, Fragment, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Search, Plus, Edit, Trash2, ExternalLink, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { getRankings, deleteRanking } from "../../../src/lib/actions"
import { Pagination, PaginationLink } from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface RankingItem {
  id: number
  accountName: string
  profileUrl: string
  followers: number
  imageUrl: string
  area: string
  storeName: string
}

export default function AdminRankingPage() {
  const [rankings, setRankings] = useState<RankingItem[]>([])
  const [filteredRankings, setFilteredRankings] = useState<RankingItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const result = await getRankings()
        if (result.success) {
          setRankings(result.data as RankingItem[])
          setFilteredRankings(result.data as RankingItem[])
        }
      } catch (error) {
        console.error("Failed to fetch rankings:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRankings()
  }, [])

  useEffect(() => {
    const filtered = rankings.filter(
      (item) =>
        item.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.area && item.area.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.storeName && item.storeName.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    setFilteredRankings(filtered)
    setCurrentPage(1) // 検索時はページを1に戻す
  }, [searchTerm, rankings])

  const handleDelete = async (id: number) => {
    try {
      const result = await deleteRanking(id)
      if (result.success) {
        setRankings(rankings.filter((item) => item.id !== id))
      }
    } catch (error) {
      console.error("Failed to delete ranking:", error)
    }
  }

  const formatFollowers = (count: number) => {
    return count.toLocaleString()
  }
  
  const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    renderLink,
    ...props
  }: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    renderLink: (page: number) => React.ReactNode;
  }) => (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center")}
    >
      {currentPage > 1 && (
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          className="mr-2"
        >
          前へ
        </button>
      )}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Fragment key={page}>
          {renderLink(page)}
        </Fragment>
      ))}
      {currentPage < totalPages && (
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          className="ml-2"
        >
          次へ
        </button>
      )}
    </nav>
  )

  const paginatedRankings = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredRankings.slice(start, end);
  }, [currentPage, itemsPerPage, filteredRankings]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">インスタグラマーランキング管理</h1>
          <p className="text-gray-600">インスタグラマーの情報を管理できます</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>インスタグラマー一覧</CardTitle>
              <Button onClick={() => router.push("/admin/ranking/create")}>
                <Plus className="h-4 w-4 mr-2" />
                新規追加
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="アカウント名、エリア、店舗名で検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>プロフィール</TableHead>
                    <TableHead>アカウント名</TableHead>
                    <TableHead>フォロワー数</TableHead>
                    <TableHead>エリア</TableHead>
                    <TableHead>店舗名</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedRankings.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={item.imageUrl || "/placeholder.svg"} alt={item.accountName} />
                          <AvatarFallback>{item.accountName.slice(1, 3).toUpperCase()}</AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{item.accountName}</span>
                          {item.profileUrl && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(item.profileUrl, "_blank")}
                              className="p-1"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4 text-gray-500" />
                          <Badge variant="secondary">{formatFollowers(item.followers)}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>{item.area}</TableCell>
                      <TableCell>{item.storeName}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/admin/ranking/edit/${item.id}`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>削除の確認</AlertDialogTitle>
                                <AlertDialogDescription>
                                  {item.accountName} を削除してもよろしいですか？この操作は取り消せません。
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>キャンセル</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(item.id)}>削除</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredRankings.length / itemsPerPage)}
                onPageChange={(page) => setCurrentPage(page)}
                renderLink={(page) => (
                  <PaginationLink
                    key={page}
                    isActive={page === currentPage}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </PaginationLink>
                )}
              />
            </div>

            {filteredRankings.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">データが見つかりませんでした。</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
