// client/src/component/AssignmentTable.jsx
import React, { useEffect, useMemo, useState } from 'react';

export default function AssignmentTable() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sorteringsstatus
  const [sortKey, setSortKey] = useState('start_date'); // 'employee' | 'project' | 'start_date'
  const [sortOrder, setSortOrder] = useState('desc');   // 'asc' | 'desc'

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('http://localhost:5000/api/projectassignments');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setAssignments(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('❌ Error fetching assignments:', e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Säker datumformatterare
  const safeDate = (d) => {
    const dt = d ? new Date(d) : null;
    return dt && !isNaN(dt) ? dt.toLocaleDateString() : 'N/A';
  };

  // Svensk textjämförare för stabil sortering
  const collator = new Intl.Collator('sv', { sensitivity: 'base' });

  const getSortValue = (row, key) => {
    if (key === 'employee') return row?.employee_id?.full_name ?? '';
    if (key === 'project')  return row?.project_id?.project_name ?? '';
    // start_date
    return row?.start_date ? new Date(row.start_date).getTime() : 0;
  };

  const sorted = useMemo(() => {
    const copy = [...assignments];
    copy.sort((a, b) => {
      const av = getSortValue(a, sortKey);
      const bv = getSortValue(b, sortKey);
      const cmp =
        sortKey === 'start_date'
          ? av - bv // numerisk jämförelse
          : collator.compare(String(av), String(bv)); // textjämförelse
      return sortOrder === 'asc' ? cmp : -cmp;
    });
    return copy;
  }, [assignments, sortKey, sortOrder]);

  const handleSort = (key) => {
    if (sortKey === key) setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  // Inverterad pil: visar motsatt riktning mot nuvarande sortering (asc → ▼, desc → ▲)
  // Fixerad bredd så rubrikerna inte hoppar.
  const Arrow = ({ active }) => (
    <span className="inline-block w-4 text-xs align-middle">
      {active ? (sortOrder === 'asc' ? '▼' : '▲') : ''}
    </span>
  );

  if (loading) return <div className="p-6 max-w-5xl mx-auto">Laddar…</div>;
  if (error)   return <div className="p-6 max-w-5xl mx-auto text-red-600">Fel: {error}</div>;

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Project Assignments ({assignments.length})
      </h2>

      <div className="overflow-x-auto">
        {/* table-fixed + centrerad text gör att inget hoppar när pilarna växlar */}
        <table className="w-full table-fixed text-center">
          <thead className="border-b">
            <tr>
              <th className="py-3 px-4 w-1/3">
                <button
                  type="button"
                  onClick={() => handleSort('employee')}
                  className="inline-flex items-center justify-center gap-1 w-full font-semibold hover:underline"
                  title="Sortera på Employee"
                >
                  <span>Employee</span>
                  <Arrow active={sortKey === 'employee'} />
                </button>
              </th>
              <th className="py-3 px-4 w-1/3">
                <button
                  type="button"
                  onClick={() => handleSort('project')}
                  className="inline-flex items-center justify-center gap-1 w-full font-semibold hover:underline"
                  title="Sortera på Project"
                >
                  <span>Project</span>
                  <Arrow active={sortKey === 'project'} />
                </button>
              </th>
              <th className="py-3 px-4 w-1/3">
                <button
                  type="button"
                  onClick={() => handleSort('start_date')}
                  className="inline-flex items-center justify-center gap-1 w-full font-semibold hover:underline"
                  title="Sortera på Start Date"
                >
                  <span>Start Date</span>
                  <Arrow active={sortKey === 'start_date'} />
                </button>
              </th>
            </tr>
          </thead>

          <tbody>
            {sorted.map((row) => (
              <tr key={row._id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4 whitespace-nowrap">
                  <div className="truncate">{row?.employee_id?.full_name ?? 'N/A'}</div>
                </td>
                <td className="py-2 px-4 whitespace-nowrap">
                  <div className="truncate">{row?.project_id?.project_name ?? 'N/A'}</div>
                </td>
                <td className="py-2 px-4 whitespace-nowrap">
                  <div className="truncate">{safeDate(row?.start_date)}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
