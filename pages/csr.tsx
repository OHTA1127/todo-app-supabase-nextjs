import { NextPage } from 'next'
import React, { useEffect, useState } from 'react'
import { Notice, Task } from '../types/types'
import { supabase } from '../utils/supabase'
import Layout from '../components/Layout'
import Link from 'next/link'
import { useRouter } from 'next/router'

//Client Server Renderingの略
const Csr: NextPage = () => {
  const router = useRouter()
  //クライアントサイドでフェッチを行うため、取得したデータを格納するstateを定義する
  const [tasks, setTasks] = useState<Task[]>([])
  const [notices, setNotices] = useState<Notice[]>([])

  //初回だけ行う処理
  useEffect(() => {
    //supabaseからデートを取得する処理
    const getTasks = async () => {
      const { data: tasks } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: true })
      setTasks(tasks as Task[])
    }
    const getNotices = async () => {
      const { data: notices } = await supabase
        .from('notices')
        .select('*')
        .order('created_at', { ascending: true })
      setNotices(notices as Notice[])
    }
    //関数の実行
    getTasks()
    getNotices()
  }, [])

  return (
    <Layout title="CSR">
      {/* CSFはClient Side Fetchingの略 */}
      <p className="mb-3 text-blue-500">SSG + CSF</p>
      {/* task一覧表示 */}
      <ul className="mb-3">
        {tasks.map((task) => (
          <li key={task.id}>
            <p className="text-lg font-extrabold">{task.title}</p>
          </li>
        ))}
      </ul>
      {/* notices一覧表示 */}
      <ul className="mb-3">
        {notices.map((notice) => (
          <li key={notice.id}>
            <p className="text-lg font-extrabold">{notice.content}</p>
          </li>
        ))}
      </ul>
      <Link href={'/ssr'} prefetch={false}>
        <a className="my-3 text-xs">Link to SSR</a>
      </Link>
      <button className="mb-3 text-xs" onClick={() => router.push('/ssr')}>
        Route to SSR
      </button>
    </Layout>
  )
}

export default Csr
