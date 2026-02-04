import React, { useEffect, useState } from 'react'
import { fetchComments } from '../api'

export default function DataList({ reload }: { reload?: number }){
  const [items, setItems] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(()=>{ setPage(1) }, [search, reload])

  useEffect(()=>{
    let cancelled = false
    setLoading(true)
    fetchComments(page, limit, search).then((res:any)=>{
      if(cancelled) return
      setItems(res.items)
      setTotal(res.total)
      setLoading(false)
    }).catch(()=> setLoading(false))
    return ()=>{ cancelled = true }
  },[page, limit, search, reload])

  const pages = Math.max(1, Math.ceil(total/limit))

  // generate a compact set of page numbers around the current page
  const pageButtons = (() => {
    const maxButtons = 7;
    if (pages <= maxButtons) return { start: 1, end: pages, nums: Array.from({ length: pages }, (_, i) => i + 1) };
    let start = Math.max(1, page - Math.floor(maxButtons / 2));
    let end = start + maxButtons - 1;
    if (end > pages) { end = pages; start = pages - maxButtons + 1; }
    return { start, end, nums: Array.from({ length: end - start + 1 }, (_, i) => start + i) };
  })()

  // Helper to highlight occurrences of the search term inside a text string
  const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const highlightText = (text: string | number | undefined, q: string) => {
    const str = String(text ?? '')
    if (!q) return str
    const re = new RegExp(`(${escapeRegExp(q)})`, 'i')
    const parts = str.split(new RegExp(`(${escapeRegExp(q)})`, 'i'))
    return parts.map((part, idx) => (
      re.test(part) ? <mark key={idx} className="highlight">{part}</mark> : <span key={idx}>{part}</span>
    ))
  }

  return (
    <div className="list">
      <div className="toolbar">
        <input placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} />
      </div>

      {loading && <div className="loading">Loading...</div>}

      {!loading && (
        <table>
          <thead><tr><th>Id</th><th>Post</th><th>Name</th><th>Email</th><th>Body</th></tr></thead>
          <tbody>
            {items.map(i=> (
              <tr key={i.id}>
                <td>{i.id}</td>
                <td>{i.postid ?? i.postId}</td>
                <td>{highlightText(i.name, search)}</td>
                <td>{highlightText(i.email, search)}</td>
                <td>{highlightText(i.body, search)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="pager">
        <button className="arrow-button" onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page<=1} aria-label="Previous page">←</button>

        {/* leading first page */}
        {pageButtons.start > 1 && (
          <>
            <button className="page-btn" onClick={()=>setPage(1)}>1</button>
            {pageButtons.start > 2 && <span className="dots">…</span>}
          </>
        )}

        {/* numeric buttons */}
        {pageButtons.nums.map(n => (
          <button key={n} className={`page-btn ${n===page ? 'active' : ''}`} onClick={()=>setPage(n)} aria-current={n===page ? 'page' : undefined}>{n}</button>
        ))}

        {/* trailing last page */}
        {pageButtons.end < pages && (
          <>
            {pageButtons.end < pages - 1 && <span className="dots">…</span>}
            <button className="page-btn" onClick={()=>setPage(pages)}>{pages}</button>
          </>
        )}

        <button className="arrow-button" onClick={()=>setPage(p=>Math.min(p+1,pages))} disabled={page>=pages} aria-label="Next page">→</button>
      </div>
    </div>
  )
}
