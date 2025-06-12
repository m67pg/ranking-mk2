"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
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
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface RankingItem {
  id: number
  accountName: string
  profileUrl: string
  followers: number
  imageUrl: string
  area: string
  storeName: string
}

// サンプルデータ
const initialData: RankingItem[] = [
  {
    id: 1,
    accountName: "@tokyo_foodie_yuki",
    profileUrl: "https://instagram.com/tokyo_foodie_yuki",
    followers: 125000,
    imageUrl: "/placeholder.svg?height=40&width=40",
    area: "東京都渋谷区",
    storeName: "カフェ・ド・パリ",
  },
  {
    id: 2,
    accountName: "@osaka_gourmet_ken",
    profileUrl: "https://instagram.com/osaka_gourmet_ken",
    followers: 98500,
    imageUrl: "/placeholder.svg?height=40&width=40",
    area: "大阪府大阪市",
    storeName: "たこ焼き本舗",
  },
  {
    id: 3,
    accountName: "@kyoto_sweets_mami",
    profileUrl: "https://instagram.com/kyoto_sweets_mami",
    followers: 87200,
    imageUrl: "/placeholder.svg?height=40&width=40",
    area: "京都府京都市",
    storeName: "和菓子処 花月",
  },
]

export default function AdminRanking() {
  const [rankings, setRankings] = useState<RankingItem[]>(initialData)
  const [filteredRankings, setFilteredRankings] = useState<RankingItem[]>(initialData)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<RankingItem | null>(null)
  const [formData, setFormData] = useState({
    accountName: "",
    profileUrl: "",
    followers: "",
    imageUrl: "",
    area: "",
    storeName: "",
  })

  const router = useRouter()

  useEffect(() => {
    const filtered = rankings.filter(
      (item) =>
        item.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.storeName.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredRankings(filtered)
  }, [searchTerm, rankings])

  const resetForm = () => {
    setFormData({
      accountName: "",
      profileUrl: "",
      followers: "",
      imageUrl: "",
      area: "",
      storeName: "",
    })
  }

  const handleAdd = () => {
    if (!formData.accountName || !formData.followers) {
      toast({
        title: "エラー",
        description: "必須項目を入力してください",
        variant: "destructive",
      })
      return
    }

    const newItem: RankingItem = {
      id: Math.max(...rankings.map((r) => r.id)) + 1,
      accountName: formData.accountName,
      profileUrl: formData.profileUrl,
      followers: Number.parseInt(formData.followers),
      imageUrl: formData.imageUrl || "/placeholder.svg?height=40&width=40",
      area: formData.area,
      storeName: formData.storeName,
    }

    setRankings([...rankings, newItem])
    setIsAddDialogOpen(false)
    resetForm()
    toast({
      title: "成功",
      description: "インスタグラマーを追加しました",
    })
  }

  const handleEdit = (item: RankingItem) => {
    setEditingItem(item)
    setFormData({
      accountName: item.accountName,
      profileUrl: item.profileUrl,
      followers: item.followers.toString(),
      imageUrl: item.imageUrl,
      area: item.area,
      storeName: item.storeName,
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdate = () => {
    if (!editingItem || !formData.accountName || !formData.followers) {
      toast({
        title: "エラー",
        description: "必須項目を入力してください",
        variant: "destructive",
      })
      return
    }

    const updatedRankings = rankings.map((item) =>
      item.id === editingItem.id
        ? {
            ...item,
            accountName: formData.accountName,
            profileUrl: formData.profileUrl,
            followers: Number.parseInt(formData.followers),
            imageUrl: formData.imageUrl || "/placeholder.svg?height=40&width=40",
            area: formData.area,
            storeName: formData.storeName,
          }
        : item,
    )

    setRankings(updatedRankings)
    setIsEditDialogOpen(false)
    setEditingItem(null)
    resetForm()
    toast({
      title: "成功",
      description: "インスタグラマー情報を更新しました",
    })
  }

  const handleDelete = (id: number) => {
    const updatedRankings = rankings.filter((item) => item.id !== id)
    setRankings(updatedRankings)
    toast({
      title: "成功",
      description: "インスタグラマーを削除しました",
    })
  }

  const formatFollowers = (count: number) => {
    return count.toLocaleString()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">インスタグラマーランキング管理</h1>
          <p className="text-gray-600">インスタグラマーの情報を管理できます</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>インスタグラマー一覧</CardTitle>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => router.push("/admin/ranking/create")}>
                    <Plus className="h-4 w-4 mr-2" />
                    新規追加
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>新しいインスタグラマーを追加</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="accountName">アカウント名 *</Label>
                      <Input
                        id="accountName"
                        value={formData.accountName}
                        onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                        placeholder="@example_account"
                      />
                    </div>
                    <div>
                      <Label htmlFor="profileUrl">プロフィールURL</Label>
                      <Input
                        id="profileUrl"
                        value={formData.profileUrl}
                        onChange={(e) => setFormData({ ...formData, profileUrl: e.target.value })}
                        placeholder="https://instagram.com/example_account"
                      />
                    </div>
                    <div>
                      <Label htmlFor="followers">フォロワー数 *</Label>
                      <Input
                        id="followers"
                        type="number"
                        value={formData.followers}
                        onChange={(e) => setFormData({ ...formData, followers: e.target.value })}
                        placeholder="10000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="imageUrl">画像URL</Label>
                      <Input
                        id="imageUrl"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <div>
                      <Label htmlFor="area">エリア</Label>
                      <Input
                        id="area"
                        value={formData.area}
                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                        placeholder="東京都渋谷区"
                      />
                    </div>
                    <div>
                      <Label htmlFor="storeName">店舗名</Label>
                      <Input
                        id="storeName"
                        value={formData.storeName}
                        onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                        placeholder="カフェ・ド・パリ"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        キャンセル
                      </Button>
                      <Button onClick={handleAdd}>追加</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {/* 検索バー */}
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

            {/* テーブル */}
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
                  {filteredRankings.map((item) => (
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
            </div>

            {filteredRankings.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">データが見つかりませんでした。</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 編集ダイアログ */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>インスタグラマー情報を編集</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-accountName">アカウント名 *</Label>
                <Input
                  id="edit-accountName"
                  value={formData.accountName}
                  onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                  placeholder="@example_account"
                />
              </div>
              <div>
                <Label htmlFor="edit-profileUrl">プロフィールURL</Label>
                <Input
                  id="edit-profileUrl"
                  value={formData.profileUrl}
                  onChange={(e) => setFormData({ ...formData, profileUrl: e.target.value })}
                  placeholder="https://instagram.com/example_account"
                />
              </div>
              <div>
                <Label htmlFor="edit-followers">フォロワー数 *</Label>
                <Input
                  id="edit-followers"
                  type="number"
                  value={formData.followers}
                  onChange={(e) => setFormData({ ...formData, followers: e.target.value })}
                  placeholder="10000"
                />
              </div>
              <div>
                <Label htmlFor="edit-imageUrl">画像URL</Label>
                <Input
                  id="edit-imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <Label htmlFor="edit-area">エリア</Label>
                <Input
                  id="edit-area"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  placeholder="東京都渋谷区"
                />
              </div>
              <div>
                <Label htmlFor="edit-storeName">店舗名</Label>
                <Input
                  id="edit-storeName"
                  value={formData.storeName}
                  onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                  placeholder="カフェ・ド・パリ"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  キャンセル
                </Button>
                <Button onClick={handleUpdate}>更新</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
