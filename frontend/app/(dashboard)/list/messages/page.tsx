'use client';

import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import {
  fetchMe,
  fetchParentMessages,
  fetchTeacherMessages,
  fetchStudents,
  type MeDto,
  type MessageListItem,
  type Student,
} from '@/lib/api';
import { useRole } from '@/lib/auth';
import { sendMessageToParent, sendMessageToTeacher, deleteMessage } from '@/lib/api';
import { useEffect, useState } from 'react';

const columnsParent = [
  { header: 'Date', accessor: 'date' },
  { header: 'From', accessor: 'teacher' },
  { header: 'Student', accessor: 'student' },
  { header: 'Message', accessor: 'text' },
];

const MessagesPage = () => {
  const role = useRole();
  const [me, setMe] = useState<MeDto | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<number | ''>('');
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  const [messages, setMessages] = useState<MessageListItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const isTeacher = role === 'TEACHER';
  const isParent = role === 'PARENT';

  useEffect(() => {
    if (!role) return;
    if (isTeacher || isParent) {
      fetchMe().then(setMe).catch(() => setMe(null));
    }
  }, [role, isTeacher, isParent]);

  // Teacher: kendi öğrencilerini getir
  useEffect(() => {
    if (!isTeacher) return;
    if (me == null || me.teacherId == null) return;
    fetchStudents({ teacherId: me.teacherId })
      .then(setStudents)
      .catch(() => setStudents([]));
  }, [isTeacher, me?.teacherId]);

  // Parent/Teacher: kendi mesajlarını getir
  useEffect(() => {
    if (!isParent && !isTeacher) {
      setLoading(false);
      return;
    }
    const load = async () => {
      try {
        const data = isParent ? await fetchParentMessages() : await fetchTeacherMessages();
        setMessages(data);
      } catch {
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isParent, isTeacher]);

  const filteredMessages = messages.filter((m) =>
    (m.text || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.senderName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.studentName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!role) {
    return <div className="bg-white p-4 rounded-md flex-1 flex items-center justify-center">Loading...</div>;
  }

  if (!isTeacher && !isParent) {
    return (
      <div className="bg-white p-4 rounded-md flex-1 flex items-center justify-center">
        Messages are only available for Teachers and Parents.
      </div>
    );
  }

  const handleSendFromTeacher = async () => {
    if (!selectedStudentId || !text.trim()) return;
    try {
      setSending(true);
      await sendMessageToParent({ studentId: Number(selectedStudentId), text: text.trim() });
      setText('');
      alert('Message sent to parent.');
    } catch (e: any) {
      alert(e?.message ?? 'Failed to send');
    } finally {
      setSending(false);
    }
  };

  const children = me?.studentSummaries ?? [];

  const handleSendFromParent = async () => {
    if (!selectedStudentId || !text.trim()) return;
    try {
      setSending(true);
      await sendMessageToTeacher({ studentId: Number(selectedStudentId), text: text.trim() });
      setText('');
      alert('Message sent to teacher.');
    } catch (e: any) {
      alert(e?.message ?? 'Failed to send');
    } finally {
      setSending(false);
    }
  };

  if (isTeacher) {
    return (
      <div className="bg-white p-4 rounded-md flex-1 space-y-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="hidden md:block text-lg font-semibold">Messages to Parents</h1>
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <TableSearch onSearch={setSearchTerm} />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Student</label>
            <select
              className="w-full ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value ? Number(e.target.value) : '')}
            >
              <option value="">Select student...</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {(s.fullName || s.name || `Student #${s.id}`) +
                    (s.className ? ` (${s.className})` : '')}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Message</label>
            <textarea
              className="w-full ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm min-h-[80px]"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write a message to the student's parent..."
            />
          </div>
          <button
            type="button"
            onClick={handleSendFromTeacher}
            disabled={sending || !selectedStudentId || !text.trim()}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {sending ? 'Sending...' : 'Send'}
          </button>
        </div>
        <p className="text-xs text-gray-400">
          The message will be visible in the parent&apos;s Messages page.
        </p>

        <Table
          columns={columnsParent}
          renderRow={(item: MessageListItem) => (
            <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purpleLight">
              <td className="p-4 text-xs text-gray-500">
                {new Date(item.createdAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
              </td>
              <td>{item.senderName}</td>
              <td>{item.studentName || '—'}</td>
              <td className="max-w-xs break-words">{item.text}</td>
              <td className="text-right pr-4">
                <button
                  type="button"
                  onClick={async () => {
                    if (!confirm('Delete this message?')) return;
                    try {
                      await deleteMessage(item.id);
                      setMessages(prev => prev.filter(m => m.id !== item.id));
                      window.dispatchEvent(new CustomEvent("messages-updated"));
                    } catch (e: any) {
                      alert(e?.message ?? 'Failed to delete');
                    }
                  }}
                  className="text-xs text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          )}
          data={filteredMessages}
        />
        {filteredMessages.length === 0 && (
          <p className="text-xs text-gray-400 mt-2">No messages yet.</p>
        )}
      </div>
    );
  }

  // Parent view
  if (loading) {
    return (
      <div className="bg-white p-4 rounded-md flex-1 flex items-center justify-center min-h-[200px]">
        Loading...
      </div>
    );
  }

  const renderParentRow = (item: MessageListItem) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purpleLight">
      <td className="p-4 text-xs text-gray-500">
        {new Date(item.createdAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
      </td>
      <td>{item.senderName}</td>
      <td>{item.studentName || '—'}</td>
      <td className="max-w-xs break-words">{item.text}</td>
      <td className="text-right pr-4">
        <button
          type="button"
          onClick={async () => {
            if (!confirm('Delete this message?')) return;
            try {
              await deleteMessage(item.id);
              setMessages(prev => prev.filter(m => m.id !== item.id));
              window.dispatchEvent(new CustomEvent("messages-updated"));
            } catch (e: any) {
              alert(e?.message ?? 'Failed to delete');
            }
          }}
          className="text-xs text-red-600 hover:underline"
        >
          Delete
        </button>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="hidden md:block text-lg font-semibold">My Messages</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch onSearch={setSearchTerm} />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1">Student</label>
          <select
            className="w-full ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value ? Number(e.target.value) : '')}
          >
            <option value="">Select student...</option>
            {children.map((c) => (
              <option key={c.id} value={c.id}>
                {c.fullName || `Student #${c.id}`}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1">Message to teacher</label>
          <textarea
            className="w-full ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm min-h-[80px]"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a message to your child's teacher..."
          />
        </div>
        <button
          type="button"
          onClick={handleSendFromParent}
          disabled={sending || !selectedStudentId || !text.trim()}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {sending ? 'Sending...' : 'Send'}
        </button>
      </div>

      <Table
        columns={columnsParent}
        renderRow={renderParentRow}
        data={filteredMessages}
      />
      {filteredMessages.length === 0 && (
        <p className="text-xs text-gray-400 mt-4">No messages yet.</p>
      )}
    </div>
  );
};

export default MessagesPage;
