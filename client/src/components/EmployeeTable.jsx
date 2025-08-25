// client/src/component/EmployeeTable.jsx
import React, { useEffect, useMemo, useState } from 'react';

export default function EmployeeTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // sorteringsstatus
  const [sortKey, setSortKey] = useState('employee'); // 'employee' | 'email' | 'employee_id'
  const [sortOrder, setSortOrder] = useState('asc');  // 'asc' | 'desc'

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('http://localhost:5000/api/employees');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setRows(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('❌ Error fetching employees:', e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const collator = new Intl.Collator('sv', { sensitivity: 'base' });

  const getVal = (r, key) => {
    if (key === 'employee')   return r?.full_name ?? '';
    if (key === 'email')      return r?.email ?? '';
    if (key === 'employee_id')return r?.employee_id ?? '';
    return '';
  };

  const sorted = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      const av = getVal(a, sortKey);
      const bv = getVal(b, sortKey);
      const cmp = collator.compare(String(av), String(bv));
      return sortOrder === 'asc' ? cmp : -cmp;
    });
    return copy;
  }, [rows, sortKey, sortOrder]);

  const handleSort = (key) => {
    if (sortKey === key) setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  // inverterad pil (asc → ▼, desc → ▲) med fast bredd
  const Arrow = ({ active }) => (
    <span className="inline-block w-4 text-xs align-middle">
      {active ? (sortOrder === 'asc' ? '▼' : '▲') : ''}
    </span>
  );

  if (loading) return <div className="p-6 max-w-5xl mx-auto">Laddar…</div>;
  if (error)   return <div className="p-6 max-w-5xl mx-auto text-red-600">Fel: {error}</div>;

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4 text-center">All Employees ({rows.length})</h2>
      <div className="overflow-x-auto">
        <table className="w-full table-fixed text-center">
          <thead className="border-b">
            <tr>
              <th className="py-3 px-4 w-1/3">
                <button
                  type="button"
                  onClick={() => handleSort('employee')}
                  className="inline-flex items-center justify-center gap-1 w-full font-semibold hover:underline"
                  title="Sortera på namn"
                >
                  <span>Employee</span>
                  <Arrow active={sortKey === 'employee'} />
                </button>
              </th>
              <th className="py-3 px-4 w-1/3">
                <button
                  type="button"
                  onClick={() => handleSort('email')}
                  className="inline-flex items-center justify-center gap-1 w-full font-semibold hover:underline"
                  title="Sortera på email"
                >
                  <span>Email</span>
                  <Arrow active={sortKey === 'email'} />
                </button>
              </th>
              <th className="py-3 px-4 w-1/3">
                <button
                  type="button"
                  onClick={() => handleSort('employee_id')}
                  className="inline-flex items-center justify-center gap-1 w-full font-semibold hover:underline"
                  title="Sortera på Employee ID"
                >
                  <span>Employee ID</span>
                  <Arrow active={sortKey === 'employee_id'} />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr key={r._id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4"><div className="truncate">{r?.full_name ?? '—'}</div></td>
                <td className="py-2 px-4"><div className="truncate">{r?.email ?? '—'}</div></td>
                <td className="py-2 px-4"><div className="truncate">{r?.employee_id ?? '—'}</div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
